---
title: '如何在这个博客上写文章'
description: '完整的写作指南:文件放哪里、frontmatter 有哪些字段、标签怎么用、草稿如何生效,以及本地预览和发布流程。'
pubDate: 2026-11-02T10:30:00+08:00
tags: ['指南', '工具链']
---

写文章很简单 —— 在 `src/content/blog/` 目录下新建一个 `.md` 文件,写好内容,提交推送。剩下的交给自动化。

## 一篇文章长什么样

每篇文章都是带 frontmatter 的 Markdown 文件。frontmatter 位于文件开头,用 `---` 包裹:

```md
---
title: '文章标题'
description: '一句话摘要,会显示在列表页和 RSS 中'
pubDate: 2026-11-02T10:30:00+08:00
updatedDate: 2026-11-05T16:00:00+08:00
tags: ['指南', '工具链']
draft: false
---

正文从这里开始,用 Markdown 书写。
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `description` | 是 | 摘要,用于列表页、RSS 和 SEO 描述 |
| `pubDate` | 是 | 发布日期,决定文章在列表和归档中的排序 |
| `updatedDate` | 否 | 最后更新日期,会显示在标题下方 |
| `tags` | 否 | 标签数组,会自动生成对应的标签页 |
| `draft` | 否 | 默认为 `false`;设为 `true` 时不会出现在生产站点 |

字段定义集中在 `src/content.config.ts`,由 Zod 校验。写错字段名或漏掉必填项,**构建会直接失败**并指出具体位置。

## 文件名即网址

文件名决定文章的访问路径:

```
src/content/blog/how-to-write.md  →  /blog/how-to-write/
```

所以文件名建议用小写英文加连字符,例如 `how-to-write.md`。中文标题写在 frontmatter 的 `title` 里即可,两者不必一致。

## 标签的用法

标签可以打多个,会同时出现在文章顶部、列表页和标签索引中:

```md
tags: ['指南', '工具链', '效率']
```

标签页会按标签聚合所有文章,例如 `/tags/工具链/`。注意中文标签在 URL 中会被编码,站点会自动处理这个转换,不需要手动 encode。

如果某篇文章想临时藏着不发布,加上 `draft: true` 即可:

```md
draft: true
```

开发模式下(`npm run dev`)草稿是可见的,方便预览排版效果;生产构建时草稿会被完全过滤掉,不会出现在列表、标签页、归档和 RSS 里。

## 本地预览

```bash
npm install     # 首次运行
npm run dev     # 启动开发服务器,默认 http://localhost:4321
```

开发服务器支持热更新:保存 Markdown 文件后浏览器会自动刷新,不需要手动重启。

提交前建议跑一次完整检查:

```bash
npm run check   # 类型检查
npm run build   # 生产构建
npm run preview # 预览生产构建的产物
```

## 发布

推送到 `main` 分支就会触发 GitHub Actions 自动构建并部署到 GitHub Pages,通常一两分钟内生效:

```bash
git add .
git commit -m "post: 新文章标题"
git push
```

部署流水线见仓库里的 `.github/workflows/deploy.yml`。构建失败时线上站点会保持上一个成功版本,不受影响 —— 修好再推一次即可。

## 一点小提示

写技术文章时,我习惯把踩坑过程也写出来,而不只是最终解法。几年后再回看,「当时为什么会走错路」往往比「正确答案是什么」更有价值 —— 因为它能提醒你下次别再踩同一个坑。
