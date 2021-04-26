const path = require("path");
const MyPlugin = require("./custom/myplugin");
const webpack = require("webpack");
const banner = require("./custom/banner");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [path.resolve("./custom/myloader.js")],
      // },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
        // ["style-loader", "css-loader"],
      },
      {
        test: /\.png$/,
        use: {
          // loader: "file-loader",
          loader: "url-loader",
          options: {
            publicPath: "./dist/",
            name: "[name].[ext]?[hash]",
            limit: 5000,
          },
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        // include: [path.resolve(__dirname, "src/js")],
        // use: {
        //   loader: "babel-loader",
        //   // options: {
        //   //   presets: ["@babel/preset-env", { targets: "ie11" }],
        //   // },
        // },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MyPlugin(),
    // new webpack.BannerPlugin({
    //   banner: `build date: ${new Date().toLocaleString()}`,
    // }),
    new webpack.BannerPlugin(banner), // BannerPlugin을 통해 설정한 banner를 main.js에 넣음
    new webpack.DefinePlugin({
      // 변수를 app.js에 전달하기위해서 사용
      TWO: "1+1",
      VERSION: JSON.stringify("v.1.2.3"),
      PRODUCTION: JSON.stringify(false),
      MAX_COUNT: JSON.stringify(999),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      // html파일을 만들때 사용
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(dev)" : "cc", // 왜 undefined???????????????? <-- npm run build 할 때, NODE_ENV=development 입력해야함
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸제거
              removeComments: true, // 주석제거
            }
          : false,
      hash: true, // 해쉬값을 정적파일 로딩 주소의 쿼리 문자열로 붙여 브라우저 캐시로 인한 이슈 방지
    }),
    new CleanWebpackPlugin(), // 빌드 시 기존에 존재하던 dist 폴더를 지우고 새로 생성
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })] // css 파일을 js에 합치지 않고 별도의 css 파일로 만들어서 분리 시킴
      : []),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 정적파일 제공 경로 ( output path )
    publicPath: "/", // 브라우저를 통해 접근하는 경로
    host: "127.0.0.1", // 개발환경에서 도메인 맞출때 사용
    // 쿠키 기반인증은 인증 서버와 동일한 도메인으로 개발환경 설정.
    // OS host file에 해당 도메인과 127.0.0.1을 추가한 뒤 host 속성에 도메인을 설정해서 사용
    overlay: true, // 빌드시 에러나 경고를 브라우저 화면에 표시
    port: 8081,
    stats: "errors-only", // 메세지 수준 설정 ( none, errors-only, minimal, normal, verbose )
    historyApiFallback: true, // 히스토리 API를 사용하는 SPA 개발시 설정, 404 발생시 index.html로 리다이렉트
    before: (app, server, compiler) => {
      // devServer.berfor에 추가하는것이 미들웨어, before에 설정한 미들웨어는 express에 의해 app 객체가 인자로 전달 ( express instance )
      // app.get("/api/keywords", (req, res) => {
      //   // 라우터 컨트롤러, 컨트롤러는 (req와 res를 받음), 이를 통해 개발 초기 ( api 구현 전 ) 프론트에서 서버 응답을 받아올 수 있음
      //   res.json([
      //     { keyword: "이탈리아" },
      //     { keyword: "세프의요리" },
      //     { keyword: "제철" },
      //     { keyword: "홈파티" },
      //   ]);
      // });
      app.use(apiMocker("/api", "mocks/api")); // api 갯수가 많아지면 mockup file로 관리
    },
    proxy: {
      "/api": "http://localhost:8081",
    },
  },
};
