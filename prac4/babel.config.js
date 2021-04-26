module.exports = {
  // presets: ["./babel/mypreset.js"],
  // presets: ["@babel/preset-env"],
  // presets: [
  //   [
  //     "@babel/preset-env",
  //     {
  //       targets: {
  //         // target browser 설정
  //         chrome: "69",
  //         ie: "11",
  //       },
  //     },
  //   ],
  // ],
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // polyfill 사용 방식 지정
        corejs: {
          // polyfill 버전 지정
          version: 2,
        },
      },
    ],
  ],
};
