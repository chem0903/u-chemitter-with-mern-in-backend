// サーバー立ち上げ
const express = require("express");
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log("サーバーが起動しました"));

// モーガン
const morgan = require("morgan");
app.use(morgan('dev'));

// jsonファイルの読み込み
app.use(express.json());

// ルーティング
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

// DB接続
const mongoose = require("mongoose");
require('dotenv').config();
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("データベースと接続しました"))
    .catch((err) => console.log("エラーが発生しました", err));
