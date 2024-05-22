### MongoDB

1. データ構造の定義

```js
// インスタンス1生成
const mongoose = require("mongoose");
// インスタンス1クラス1の利用
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 25,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
});
// インスタンス1メソッド1の利用
module.exports = mongoose.model("User", UserSchema);
```

2. データをいじる

```js
// インスタンス2生成
const User = require("../mongodb-settings/user-task-schema");
router.get("/:id", async (req, res) => {
  try {
    // インスタンス2メソッド1の利用 and それによるインスタンス3生成
    const user = await User.findById(req.params.id);

    // インスタンス3フィールドの利用
    const { password, updatedAt, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
```

# インスタンス 1: Mongoose インスタンス

Mongoose ライブラリ全体のインスタンスで、スキーマ定義やモデル作成などの基本的な機能を提供します。

主なメソッドとクラス:

- mongoose.Schema: スキーマを定義するためのクラス。
- mongoose.model: スキーマからモデルを作成するためのメソッド。第一引数にはデータベースの collection 名が入り、MongoDB のサイトに反映される。

# インスタンス 2: モデルインスタンス

スキーマに基づいて作成されたモデルで、データベース操作のためのインターフェースを提供します。このインスタンスは、データの取得、保存、更新、削除などを行います。

主なメソッド:

- findById: ID に基づいてドキュメントを検索します。
- findByIdAndUpdate: ID に基づいてドキュメントを更新します。
- findByIdAndDelete: ID に基づいてドキュメントを削除します。
- findOne: クエリ条件に基づいてドキュメントを検索します。

# : ドキュメントインスタンス

モデルインスタンスのメソッド（例えば findById）によって返されるインスタンスで、データベースのドキュメントを表します。このインスタンスには、フィールドデータやドキュメント操作のためのメソッドが含まれます。

主なフィールドとメソッド:

- \_doc: ドキュメントの生のデータが含まれています。
- save: ドキュメントをデータベースに保存します。
- remove: ドキュメントをデータベースから削除します。
