module.exports = function (api) {
  api.cache.using(() => process.env.EXPO_OS || "native");

  const isWeb = process.env.EXPO_OS === "web";

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: isWeb ? [] : ["react-native-reanimated/plugin"],
  };
};
