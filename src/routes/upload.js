const express = require("express");
const router = express.Router();
// 画像アップロードのライブラリ
const multer = require("multer");

// クライアントから送信された画像をサーバーサイドのディレクトリに保存する際の処理内容。
// destination：どのフォルダに保存するか。fileneme：何のファイル名で保存するか。
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage });

// 画像アップロード（第二引数はmulterライブラリのミドルウェアを指定しており、singleの引数にはクライアントからファイルを送信するときのプロパティ名を指定している。）
router.post("/", upload.single("file"), (req, res) => {
  try {
    res.status(200).json("画像アップロード");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
