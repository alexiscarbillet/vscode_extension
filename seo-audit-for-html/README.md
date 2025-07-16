## 📊 SEO Audit – Live HTML SEO Checker

A Visual Studio Code extension that performs **live SEO audits** on your HTML files. It highlights common SEO issues directly in your editor—so you can fix them on the fly!

---

### ✨ Features

* ✅ Warns if `<title>` or `<meta description>` tags are missing
* 🖼️ Checks for missing `alt` attributes on images
* 📐 Real-time diagnostics with underlines and tooltips
* 📂 Automatically runs on HTML file open/edit
* 🧠 Light and fast — no online tracking or heavy dependencies

---

### 🚀 Getting Started

1. **Install** the extension from the VSIX file or Marketplace.
2. **Open any HTML file** in VSCode.
3. Instantly see warnings if common SEO issues are found.

> 🧪 No setup required. It works automatically!

---

### 🧩 Example Issues Detected

```html
<!-- ❌ Missing <title> -->
<head>
  <meta name="description" content="...">
</head>
```

```html
<!-- ❌ <img> missing alt attribute -->
<img src="photo.jpg">
```

---

### 📂 Extension Settings

No configuration required. All checks run automatically.

---

### 🔧 Future Features (Planned)

* ⚠️ Warn about multiple `<h1>` tags
* 🔗 Detect missing `rel` on `<a>` links
* 🌐 Check for external script load order issues

---

### 🛠️ Developer Info

Built using:

* [TypeScript](https://www.typescriptlang.org/)
* [Cheerio](https://cheerio.js.org/)
* [VSCode Extension API](https://code.visualstudio.com/api)

---

### 📄 License

MIT © 2025 Alexis Carbillet
