# Mica / Field Notes

一个以“安静的档案室”为视觉隐喻的个人博客前端，使用原生 HTML、CSS 和 JavaScript 构建，适合直接部署到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173
```

然后打开 <http://localhost:4173>。

## GitHub Pages

项目包含 `.github/workflows/pages.yml`：推送到 `main` 后，GitHub Actions 会自动发布静态文件。

在仓库设置中将 Pages 的发布来源设置为 **GitHub Actions** 即可。
