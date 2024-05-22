const express = require("express");
const router = express.Router();
const Post = require("../mongodb-settings/Post");
const User = require("../mongodb-settings/User");


// 新規投稿する
router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
})

// 特定の投稿を編集する（req.params.idには編集する投稿のidを指定する）
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {  // ? 編集しようとしている投稿は自分の投稿か
            await post.updateOne({
                $set: req.body,
            })
            res.status(200).json(`${post._id} を編集しました`)
        } else {
            res.status(403).json(`${post._id} は自分の投稿ではありません`)
        }
    } catch (err) {
        res.status(403).json(err);
    }
});

// 特定の投稿を削除する（req.params.idには削除する投稿のidを指定する）
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {     // ? 削除しようとしている投稿は自分の投稿か
            await post.deleteOne();
            res.status(200).json(`${post._id} を削除しました`)
        } else {
            res.status(403).json(`${post._id} は自分の投稿ではありません`)
        }
    } catch (err) {
        res.status(403).json(err);
    }
})

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    } catch (err) {
        res.status(403).json(err);
    }
})

// 特定の投稿にいいねする、または外す（= いいねする投稿のlikes配列に自分のuIDを追加、または削除する）（req.params.idにはいいねする投稿のidを指定する）
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // その投稿のいいねの中に自分（のid）がなかったら（includesがfalseに化ける）フォローできる（if文の第一ブロックが実行される）。
        if (!post.likes.includes(req.body.userId)) {  // ? すでにいいねしていないか
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                }
            })
            res.status(200).json(`${post._id} をいいねしました`)
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            })
            res.status(200).json(`${post._id} のいいねを外しました`)
        }

    } catch (err) {
        res.status(500).json(err);
    }
})

// タイムラインの投稿を取得する
// ! ここで api を /timeline のように一節にしてしまうと、特定の投稿を取得する（/:id）と競合してしまうことに注意。:id は任意の文字列なため timeline も任意の文字列とみなされる。
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        // 自分の投稿を全て取得。find は指定した条件に一致するデータを配列形式で全て取得する。
        const userPosts = await Post.find({ userId: currentUser._id });
        console.log(userPosts)
        // 自分がフォローしているユーザーの投稿を全て取得
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendID) => {
                return Post.find({ userId: friendID })
            })
        )
        // concat は二つの配列を結合するメソッド
        // res.status(200).json(userPosts.concat(...friendPosts));
        res.status(200).json([...userPosts, ...friendPosts]);

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;