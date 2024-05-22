const express = require("express");
const router = express.Router();
const User = require("../mongodb-settings/User");

// ユーザー登録
router.post("/register", async (req, res) => {
    try {

        // データ情報を含むインスタンスの生成（コンストラクタの引数はreq.bodyでもOK）。
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }) // newUser = {フィールド: (データ情報), save: () => {...}, ...}

        // newUserに格納されたデータをデータベースに追加する。
        const user = await newUser.save();
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }
})

// ログイン
router.post("/login", async (req, res) => {
    try {

        // 変数userにはリクエストされたemailと一致したユーザーデータ全体が格納される。
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("ユーザーが見つかりません");

        const validPassWord = req.body.password === user.password;
        if (!validPassWord) return res.status(400).json("パスワードが違います");

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;