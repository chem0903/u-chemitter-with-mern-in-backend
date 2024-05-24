// サーバー立ち上げ
const express = require("express");
const app = express();
const PORT = 5000;
app.listen(PORT, () => console.log("サーバーが起動しました"));

// モーガン
const morgan = require("morgan");
app.use(morgan("dev"));

// jsonファイルの読み込み
app.use(express.json());

// 静的ファイルのエンドポイント的な
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ルーティング
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);

// DB接続
const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("データベースと接続しました"))
  .catch((err) => console.log("エラーが発生しました", err));
