# 苏格拉底刘的技术博客

基于 [Astro](https://astro.build) 7.3.8 构建的中文个人博客,通过 GitHub Actions 自动部署到 GitHub Pages。

线上地址:<https://socratesliu.github.io/>

## 功能

- **标签分类** — 每篇文章可挂多个标签,`/tags/` 列出全部标签,`/tags/<标签>/` 查看该标签下的文章
- **归档** — `/archive/` 按年份倒序列出全部文章,`/archive/2025/` 查看某一年
- **RSS** — `/rss.xml`,含标题、描述、发布时间与原文链接
- **Sitemap** — `/sitemap-index.xml` 与 `/sitemap-0.xml`,由 `@astrojs/sitemap` 自动生成
- **代码高亮** — 使用 Astro 内置的 [Shiki](https://shiki.style),默认主题随深浅色模式切换
- **深色模式** — 跟随系统偏好,也可手动切换,选择会记在 `localStorage`
- **评论** — [Giscus](https://giscus.app),基于 GitHub Discussions

未包含:全文搜索(依赖 Pagefind)与 i18n 双语。

## 环境要求

- Node.js **22.14.0 或更高**(本仓库锁定 `astro@7.3.8`;不要升级到 7.4.x,那个版本要求 Node ≥ 22.22)
- npm 9+

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发服务器(默认 http://localhost:4321)
npm run dev

# 构建静态站点到 dist/
npm run build

# 本地预览构建产物
npm run preview

# TypeScript 类型检查
npm run check
```

## 目录结构

```
.
├── .github/workflows/deploy.yml   # GitHub Actions 部署流水线
├── public/                        # 静态资源(favicon、robots.txt)
├── src/
│   ├── components/                # 组件
│   │   ├── BaseHead.astro         # <head> 元信息
│   │   ├── Header.astro           # 顶部导航
│   │   ├── Footer.astro           # 页脚
│   │   ├── PostCard.astro         # 文章卡片
│   │   ├── ThemeToggle.astro      # 深浅色切换按钮
│   │   └── Giscus.astro           # 评论组件
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 通用页面骨架
│   │   └── PostLayout.astro       # 文章页骨架
│   ├── pages/                     # 路由
│   │   ├── index.astro            # 首页
│   │   ├── about.astro            # 关于页
│   │   ├── 404.astro              # 404 页
│   │   ├── rss.xml.js             # RSS 端点
│   │   ├── blog/[id].astro        # 文章详情
│   │   ├── tags/index.astro       # 标签索引
│   │   ├── tags/[tag].astro       # 标签详情
│   │   └── archive/[...year].astro # 归档(省略年份即索引页)
│   ├── styles/
│   │   ├── theme.css              # 颜色变量(深浅色)
│   │   └── global.css             # 全局样式
│   ├── content/blog/              # 文章 Markdown
│   ├── config.ts                  # 站点信息与 Giscus 配置
│   └── content.config.ts          # 内容集合 Schema
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 写一篇新文章

在 `src/content/blog/` 下新建一个 `.md` 文件,文件名会成为文章 URL 的 slug。

```markdown
---
title: 我的新文章
description: 一句话摘要,会显示在列表和 RSS 里
pubDate: 2025-01-15
updatedDate: 2025-01-20   # 可选
tags: [技术选型, 随笔]
draft: false              # true 表示草稿
---

正文内容,支持 Markdown 与 Shiki 代码高亮。

```ts
const hello: string = 'world'
```
```

Frontmatter 字段由 `src/content.config.ts` 中的 Zod schema 校验,字段缺失或类型不对会在
`npm run check` / `npm run build` 时直接报错。

几个约定:

- `pubDate` / `updatedDate` 支持 `2025-01-15` 或 `2025-01-15 10:00:00`,后一种会被当作**本地时间**
- `draft: true` 的文章只在生产构建(`npm run build`)中被过滤,开发模式(`npm run dev`)仍然可见
- 标签名可以含中文;链接会自动做 URL 编码,不需要手动编码
- 归档按年份分组时,使用文章的 `pubDate` 所属年份

## 修改站点信息

标题、描述、作者、语言、仓库地址都在 `src/config.ts` 的 `SITE` 对象里:

```ts
export const SITE = {
  title: '苏格拉底刘的技术博客',
  description: '记录技术实践、阅读笔记与日常思考。',
  author: '苏格拉底刘',
  lang: 'zh-CN',
  repo: 'socratesliu/socratesliu.github.io',
} as const;
```

改完这处,页面标题、页脚、RSS 的频道信息、`<html lang>` 会一起更新。

## Giscus 评论配置

评论区的两个 ID 在 `src/config.ts` 的 `GISCUS` 对象里(当前仓库已填好):

```ts
export const GISCUS = {
  repoId: 'R_kgDOVi185g',
  category: 'General',
  categoryId: 'DIC_kwDOVi185s4DKYQW',
} as const;
```

- `repoId` — 仓库的 GraphQL node id,即 `R_kgDO...`
- `categoryId` — Discussions 分类的 GraphQL node id,即 `DIC_kwDO...`
- `category` — 分类的显示名(建 Discussion 时默认选中的分类)

这两个是**公开标识**(不是密钥),可以安全提交。取法:

1. 仓库必须是 public,且已开启 Discussions(仓库 Settings → General → Features → Discussions)
2. 打开 <https://giscus.app>,配置仓库后点「配置」,页面底部会直接给出这两个值
3. 或用 GraphQL 查询:

```bash
curl -s -H "Authorization: bearer <TOKEN>" \
  -d '{"query":"{repository(owner:\"socratesliu\",name:\"socratesliu.github.io\"){id discussionCategories(first:25){nodes{id name}}}}"}' \
  https://api.github.com/graphql
```

### 还需要安装 giscus App

ID 填对了还不够,Giscus 依赖 GitHub 上的 **giscus App**。若未安装,评论区会显示
"App not installed" 错误而不是评论框。安装步骤:

1. 打开 <https://github.com/apps/giscus/installations/new>
2. 选择账号 `socratesliu`,勾选仓库 `socratesliu.github.io`
3. 点 Install,允许 "Discussion" 权限

### 关于讨论分类

GitHub 没有开放创建 Discussion 分类的 API(GraphQL 无 `createDiscussionCategory`
mutation,REST 也没有对应的 POST 端点),所以默认用仓库自带的 **General** 分类。
想单独建一个 Comment 分类,在仓库 Discussions 页面点「New category」手动创建,
然后把新分类的 id 填回上面的 `categoryId` 即可。

**未填写真实 ID 时,评论区会自动静默隐藏,不影响页面其余部分。**

## 部署

推送 `main` 分支即触发 `.github/workflows/deploy.yml`:

1. `actions/checkout@v7` 检出代码
2. `withastro/action@v6` 安装依赖、执行 `npm run build`、上传 Pages artifact
3. `actions/deploy-pages@v5` 发布到 GitHub Pages

仓库 Settings → Pages → Build and deployment → Source 必须设为 **GitHub Actions**。

首次部署需要为 Actions 授予 `pages: write` 与 `id-token: write` 权限。部署进度在仓库
Actions 标签页查看;回滚只需重新运行对应历史任务。

### 本地与线上的差异

`astro.config.mjs` 里 `site` 直填 `https://socratesliu.github.io/`,**没有设置 `base`**,
因为仓库名就是 `socratesliu.github.io`,GitHub Pages 部署在域名根路径。
