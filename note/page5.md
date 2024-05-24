## 静的ファイルの読み込みについて

状況：サーバーサイド、ローカルホスト 5000 番でサーバーを立ち上げ。

```js
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "public/images")));
```

上記の記述は、クライアントから、"http://localhost:5000/images" にアクセスされた場合、
path.join の第一引数に指定したディレクトリに対して、第二引数に指定した相対パス（./public/images"）を参照するという意味になる。

例:

以下のディレクトリ構造の時を考える。

```bash
/your-project
  /public
    /images
      example.jpg
  /src
    server.js
```

この時、sever.js で以下の文を実行すると、「\_\_dirname」 は src ディレクトリを指し、相対パスを用いて/your-project/public/images を参照することになる。

```js
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "../public/images")));
```

ここに、クライアントから、"http://localhost:5000/images/sample.jpeg"のリクエストが送信されると、/your-project/public/images の中の sample.jpeg をレスポンスする。

**React ではサーバーサイド側でこの設定を自動的に行ってくれている**
