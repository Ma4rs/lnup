/**
 * Konfigurierbare Event-Quellen pro Stadt.
 *
 * Für jede Stadt können Webseiten und Instagram-Accounts angegeben werden,
 * die bei der KI-Event-Suche gezielt durchsucht werden sollen.
 *
 * - websites: URLs von Event-Kalendern, Locations, Veranstaltern
 * - instagram: Instagram-Handles (ohne @) von Clubs, Bars, Locations, Veranstaltern
 */

export interface CityEventSources {
  websites: string[];
  instagram: string[];
}

/**
 * Quellen pro Stadt (Key = Stadtname, case-insensitive beim Lookup).
 * Einfach hier neue Städte/Quellen ergänzen.
 */
const CITY_SOURCES: Record<string, CityEventSources> = {
  Deggendorf: {
    websites: [
      "https://www.deggendorf-pulsiert.de/",
      "https://www.deggendorf.de/rathaus-buergerservice/veranstaltungen",
      "https://www.deggendorfer-stadthallen.de/",
      "https://www.scottys-deggendorf.de/",
    ],
    instagram: [
      "deggendorf_pulsiert",
      "fuchsbau.bayern",
      "deggendorfer_stadthallen",
      "stage.club.deggendorf",
      "scottys_deggendorf",
      "samsbar.deggendorf",
      "minibar.deggendorf",
      "chaochao.deggendorf",
    ],
  },
  Passau: {
    websites: [
      "https://www.passau.de/Veranstaltungskalender.aspx",
      "https://www.passau-erleben.de/",
      "https://www.passaubasscollective.com/",
    ],
    instagram: [
      "passau_erleben",
      "kneipentourpassau",
      "pbc.mp3",
      "cubaclubbpassau",
      "schaene_passau",
      "zauberberg_passau",
    ],
  },
  Straubing: {
    websites: [
      "https://www.straubing.de/de/veranstaltungen.html",
    ],
    instagram: [
      "peoplebar_straubing",
      "kingz_lounge_straubing",
      "lola_bar_straubing",
      "wuid_straubing",
    ],
  },
  Regensburg: {
    websites: [
      "https://www.regensburg.de/veranstaltungskalender",
      "https://www.alte-maelzerei.de/programm/",
    ],
    instagram: [
      "regensburg.de",
      "heartregensburg",
      "bar.bar.a.regensburg",
      "finitoclub",
      "scala_regensburg",
      "club_schimmerlos",
      "beatsclubregensburg",
      "rauschgold_regensburg",
    ],
  },
};

/**
 * Allgemeine Quellen, die für ALLE Städte genutzt werden.
 */
const GLOBAL_SOURCES: CityEventSources = {
  websites: [],
  instagram: [],
};

/**
 * Gibt die konfigurierten Quellen für eine Stadt zurück (inkl. globaler Quellen).
 */
export function getSourcesForCity(city: string): CityEventSources {
  const keys = Object.keys(CITY_SOURCES);
  let key: string | undefined;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === city.toLowerCase()) {
      key = keys[i];
      break;
    }
  }
  const citySources = key ? CITY_SOURCES[key] : { websites: [], instagram: [] };

  return {
    websites: [...citySources.websites, ...GLOBAL_SOURCES.websites],
    instagram: [...citySources.instagram, ...GLOBAL_SOURCES.instagram],
  };
}

/**
 * Gibt alle konfigurierten Städte zurück.
 */
export function getConfiguredCities(): string[] {
  return Object.keys(CITY_SOURCES);
}
