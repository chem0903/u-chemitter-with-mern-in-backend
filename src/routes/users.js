const express = require("express");
const router = express.Router();
const User = require("../mongodb-settings/User");

// ユーザー情報の更新
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            // 第一引数に指定したidとDBのデータのidを照合し、一致したデータを第二引数に指定したデータに更新する。
            await User.findByIdAndUpdate(req.params.id, { $set: req.body })

            res.status(200).json(`ユーザー情報が更新されました`);
        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("ユーザーが不正です");
    }
})

// ユーザー情報の削除
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.status(200).json(`ユーザー情報が削除されました`);
        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("ユーザーが不正です");
    }
})

// ユーザー情報の取得
// router.get("/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         const { password, updatedAt, ...others } = user._doc;

//         res.status(200).json(others);
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

// クエリでユーザー情報を取得
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        // password、updateAtは別で取得してクライアントには送信しない。
        // *「_doc」プロパティはMongoDB特有のプロパティ。モデルインスタンスが内部的に保持する純粋なドキュメントデータ（メソッドなどは含まない）にアクセスするためのプロパティ。
        const { password, updatedAt, ...others } = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

// ユーザーのフォロー（= フォローするユーザーのfollowers配列に自分のuIDを追加し、自分のfollowing配列にフォローするユーザーのuIDを追加する）（req.params.idにはフォローするユーザーのidを指定する）
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {    // ? フォローするユーザーは自分自身ではないか
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            // フォロワー（配列）の中に自分（のid）がなかったら（includesがfalseに化ける）フォローできる（if文の第一ブロックが実行される）。
            if (!user.followers.includes(req.body.userId)) {  // ? すでにフォローしていないか
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    }
                })
                res.status(200).json(`${user._id} をフォローしました`)
            } else {
                res.status(403).json(`${user._id} をすでにフォローしています`)
            }

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(500).json(`${req.body.userId} は自分自身です`)
    }
})

// ユーザーのフォロー解除（req.params.idにはフォロー解除するユーザーのidを指定する）
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {    // ? フォロー解除するユーザーは自分自身ではないか
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            // フォロワー（配列）の中に自分（のid）があったら（includesがtrueに化ける）フォロー解除できる（if文の第一ブロックが実行される）。
            if (user.followers.includes(req.body.userId)) {   // ? フォローしているか
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    }
                })
                res.status(200).json(`${user._id} のフォローを解除しました`)
            } else {
                res.status(403).json(`${user._id} をフォローしていません`)
            }

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(500).json(`${req.body.userId} は自分自身です`)
    }
})


module.exports = router;