export const exampleSlides = `# Markdownスライドへようこそ！ 🚀
## Markdown書式のクイックガイド

---

# 基本的なテキスト装飾

## 文字を強調する
- **ダブルアスタリスク**で**太字**
- *シングルアスタリスク*で*斜体*
- バッククォートで\`インラインコード\`
---
- > で引用文
- --- でスライド区切り

> これは引用文です。重要なポイントを強調するのに便利！

---

# リストと構造

## 番号付き・箇条書きリスト
1. 最初の項目
2. 2番目の項目
3. 3番目の項目
---
- 箇条書きはハイフンで
- 追加の項目
  - 2つスペースでインデント
  - ネストしたリストもOK

## タスクリスト
- [x] 完了したタスク
- [ ] 未完了のタスク

---

# コードブロックと表
---
## コード例
\`\`\`javascript
// 3つのバッククォートでコードブロック
function greet(name) {
  return \`こんにちは、\${name}さん！\`;
}
\`\`\`
---
## 表の例
| 要素 | Markdown記法 |
|------|--------------|
| 太字 | \`**テキスト**\` |
| 斜体 | \`*テキスト*\` |
| コード | \`\`\`コード\`\`\` |

---

# リンクと画像

---

## リンクを追加
- [こちらをクリック](https://example.com) - \`[テキスト](URL)\`
- <https://example.com> - \`<URL>\`
---
## 画像を追加
![画像例](https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop)
\`![代替テキスト](画像URL)\`

---

# 数式表現

---

# インライン数式
以下はインライン数式の例です：

- アインシュタインの有名な式: $E = mc^2$
- 二次方程式の解の公式: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- オイラーの等式: $e^{i\\pi} + 1 = 0$
- ピタゴラスの定理: $a^2 + b^2 = c^2$
---
# ブロック数式
以下はブロック数式の例です：

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
---
## マクスウェル方程式
$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} &= \\frac{4\\pi}{c}\\vec{\\mathbf{j}} + \\frac{1}{c}\\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} &= 4\\pi\\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}} &= -\\frac{1}{c}\\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} &= 0
\\end{aligned}
$$
---
## その他の例
$$
\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix} =
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}
$$

---

# スライド作成のコツ

## ベストプラクティス
1. 内容は簡潔に
2. 視覚的な階層を意識
3. 例を入れる
4. 関連画像を追加
5. スタイルを統一
---
## 覚えておこう
- 1スライド1メッセージ
- 見出しで構造化
- 視覚的に魅力的に
- 書式をテストしよう

---

# さあ、作ってみよう！

## スライド作成の流れ
1. Markdownで記述
2. リアルタイムでプレビュー
3. PDF/PPTXにエクスポート
4. みんなと共有
---
## 楽しいプレゼンを！ 🎉`;
