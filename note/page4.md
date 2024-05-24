## クエリでユーザー情報を取得

例:

クライアントリクエスト

```js
const res = await axios.get(`/users?userId=664bfbd9b3f96dac2c3961cb`);
const res = await axios.get(`/users?username=hyouga`);
```

上記のようなクエリをつけたリクエストを送ると、下記のエンドポイントにアクセスされる。
この時、クエリの値を取得するには**req.query.**と記述すればよい。

エンドポイント

```js
router.get("/users", async (req, res) => {
  const userId = req.query.userId; // 664bfbd9b3f96dac2c3961cb
  const username = req.query.username; // hyouga
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
```
