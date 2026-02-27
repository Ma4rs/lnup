# Plan: React #300 beim Abmelden beheben + Dark Mode für die ganze App

## 1. React Error #300 beim Abmelden

**Bedeutung:** React Error #300 = *"Rendered fewer hooks than expected"*. Ein Komponent rendert bei einem Re-Render weniger Hooks als beim vorherigen Render (Verstoß gegen die Hooks-Regeln).

**Ablauf beim Abmelden:**
- `handleLogout` in `app/settings.tsx` ruft `await logout()` auf.
- `logout()` in `stores/authStore.ts` setzt nach `signOut()` im `finally` sofort `user: null` und `isAuthenticated: false`.
- **Erst danach** wird `router.replace("/(auth)/login")` ausgeführt.
- Durch das sofortige Store-Update re-rendern alle Komponenten, die `useAuthStore` nutzen (z. B. RootLayout, Settings, Tab-Layout, ggf. weitere), **während die Settings-Seite noch gemountet ist**. Wenn dabei irgendwo (inkl. Expo Router / React Navigation) bedingt weniger Hooks aufgerufen werden, entsteht #300.

**Lösungsansatz A – Store-Update nach Navigation (empfohlen):**  
Das Auth-Store-Update erst ausführen, **nachdem** die Navigation zur Login-Seite erfolgt ist. So wird die Settings-Seite (und der (tabs)-Baum) zuerst unmounted, danach wird `user` auf `null` gesetzt.

- In `app/settings.tsx` in `handleLogout`: zuerst `router.replace("/(auth)/login")` aufrufen, **nicht** auf `await logout()` warten bevor navigiert wird.
- Optional: `logout()` erst nach der Navigation aufrufen (z. B. in einem kurzen `setTimeout` oder nach `router.replace` ohne await), oder die Reihenfolge so ändern, dass die Navigation sofort ausgelöst wird und der Store erst danach aktualisiert wird.
- In `stores/authStore.ts`: `logout()` so anpassen, dass `set({ user: null, … })` nicht im selben Tick wie der Aufruf passiert, z. B. nach `requestAnimationFrame` oder `setTimeout(..., 0)`, damit React die Navigation (Unmount) zuerst ausführen kann.

**Lösungsansatz B – Fehlerquelle eingrenzen:**  
- App einmal mit **Development Build** (nicht minified) starten und erneut abmelden; die Fehlermeldung nennt dann die konkrete Komponente.
- In allen eigenen Komponenten prüfen: keine Hooks **nach** einem `if (!user) return null` oder ähnlichen early returns; Hooks immer in fester Reihenfolge und unabhängig von Auth-Zustand aufrufen.

**Empfohlene Umsetzung:**  
- In `handleLogout`: zuerst `router.replace("/(auth)/login")` ausführen (ohne auf Logout zu warten), dann `logout()` aufrufen (ohne await, oder mit await in Hintergrund).  
- Oder in `authStore.logout()`: nach `signOut()` die Navigation nicht blockieren – z. B. `set({ user: null, ... })` in `setTimeout(..., 0)` oder in einem von der aufrufenden Seite übergebenen Callback nach `router.replace` ausführen.  
- So wird die problematische Re-Render-Phase (Auth-Update bei noch gemounteter Settings) vermieden.

---

## 2. Dark Mode / Theme nur in der unteren Leiste sichtbar

**Ursache:**  
- Die **Tab-Leiste** nutzt `useThemeStore` und setzt Farben per `screenOptions` (z. B. `tabBarStyle.backgroundColor: colors.card`). Beim Theme-Wechsel wird der Tab-Layout neu gerendert → die Leiste wechselt korrekt.
- Der **Rest der App** nutzt überwiegend **Tailwind-Klassen** wie `bg-background`, `text-text-primary` usw. Diese hängen in `tailwind.config.js` an **CSS-Variablen** (`var(--color-background)` usw.).
- Die Variablen sind in `global.css` definiert: **`:root`** = Hell, **`.dark`** = Dunkel. Die **Root-View** in `app/_layout.tsx` hat aber **keine** Klasse `dark`. Daher wird `.dark` nirgends angewendet und alle Flächen/ Texte, die nur über Tailwind laufen, bleiben hell.

**Lösung:**  
- In `app/_layout.tsx` die äußere **View** so erweitern, dass sie bei Dark Mode die Klasse `dark` erhält und bei Light Mode nicht:
  - z. B. `className={isDark ? "dark" : ""}` (oder vergleichbar, je nach NativeWind-Syntax) an die View mit `style={{ flex: 1 }}` hängen.
- Damit gelten die Variablen aus `.dark` für die gesamte App, und alle Screens mit `bg-background`, `text-text-primary`, `bg-card` usw. wechseln mit dem Theme.
- Optional: In `app/(auth)/_layout.tsx` die fest verdrahtete `contentStyle: { backgroundColor: "#0A0A0F" }` durch theme-basierte Farbe ersetzen (z. B. aus `useThemeStore` oder aus den gleichen CSS-Variablen), damit auch der Auth-Bereich konsistent hell/dunkel ist.

---

## Kurz-Checkliste

| Aufgabe | Datei(en) | Maßnahme |
|--------|-----------|----------|
| #300 vermeiden | `app/settings.tsx`, ggf. `stores/authStore.ts` | Navigation vor Auth-Update; Logout ggf. verzögert oder ohne await vor replace aufrufen; Store-Update erst nach Navigation (z. B. setTimeout/requestAnimationFrame). |
| Dark Mode global | `app/_layout.tsx` | Root-View: `className={isDark ? "dark" : ""}` (bzw. NativeWind-konform). |
| Auth-Layout Theme | `app/(auth)/_layout.tsx` | Optional: Hintergrundfarbe aus Theme/Store statt fest `#0A0A0F`. |

Nach dem Umsetzen: Abmelden testen (kein #300), Theme Hell/Dunkel/System wechseln und prüfen, ob alle Bereiche (Feed, Einstellungen, Auth-Screens, Tab-Leiste) sich ändern.

---

## Weitere behobene Punkte (Stand Suche „was zu beheben ist“)

- **eventStore.persistEventsToDb:** Zeitfelder auf "HH:mm" normalisiert (`toTime()`), Default `time_start` "20:00"; Venue-Insert mit sicheren Defaults (address/city nie leer, Längenbegrenzung); Venue-/Event-Insert-Fehler geloggt, einmal pro Lauf Toast bei Fehlern.
- **extract-event:** `created_by: user.id`; Zeitformat über `normalizeTime()` (Default "20:00"); Venue-Address-Default; Back-Button führt immer zu `router.replace("/(tabs)")`, damit man nicht stecken bleibt.

---

## „Events in DB, aber KI findet nix / Liste leer“

**Ursache:** Nach KI-Suche: Events werden gemerged (lokaler Store) und in der DB gespeichert. Anschließend wird teils **nicht** refetcht – dann bleiben im Store nur die Einträge mit temporären IDs (`ai-...`). Beim nächsten Refresh ersetzt `fetchEvents` den ganzen Store durch die DB; wenn die Inserts vorher fehlgeschlagen sind (z. B. 400), stehen in der DB keine neuen Events → die Liste wirkt leer, obwohl die KI welche „gefunden“ hatte.

**Behoben:**
- **eventStore:** Zeit-/Venue-Normalisierung und Fehlerbehandlung reduzieren 400er beim Speichern; Toast bei Fehlern.
- **Feed (index):** Nach Persist wird bereits `fetchEvents(city, true)` aufgerufen → Store = DB.
- **CityDropdown:** Nach Persist jetzt ebenfalls `fetchEvents(undefined, true)`, damit die Liste nach KI-Suche aus dem Dropdown mit der DB übereinstimmt und echte IDs hat.

---

## Optionale Verbesserungen (noch offen)

- **Hardcodierte Icon-Farben:** Viele Screens nutzen noch `#FFFFFF`, `#6B6B80` etc. für Icons. Für konsistentes Dark Mode könnten diese durch `colors.textPrimary` / `colors.textMuted` aus `useThemeStore` ersetzt werden (z. B. settings, event/[id], profile, leaderboard, create, …).
- **Stille catch-Blöcke:** In `app/event/[id]/index.tsx` und `components/InviteModal.tsx` gibt es `catch {}` ohne Log. Optional: `console.warn` oder Nutzer-Feedback bei Fehlern.
