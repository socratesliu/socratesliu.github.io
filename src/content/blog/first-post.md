---
title: '为什么我把博客构建在 GitHub Pages 上'
description: '一次技术选型的复盘:比较过 Astro、Hugo 与自建方案之后,为什么最终选择 Astro + GitHub Actions 这条路线。'
pubDate: 2026-11-04T14:20:00+08:00
tags: ['技术选型', '工具链', '随笔']
---

搭这个博客的时候,我认真比较了几种方案。这篇文章记录一下取舍的过程,顺便也把几个踩过的坑写下来。

## 候选方案

### 方案一:纯静态手写 HTML

最朴素的做法:写一堆 `.html` 文件,传到仓库里,让 GitHub Pages 直接服务。

**优点**是零依赖 —— 没有任何构建步骤,没有 `node_modules`,改完刷新就生效。

**缺点**也很明显:每写一篇新文章都要复制粘贴一套 HTML 骨架,标签、归档、RSS 全得手工维护。文章一多就彻底失控。这个方案适合只有三五篇静态页面的个人主页,不适合真正的博客。

### 方案二:Hugo

Hugo 是 Go 写的静态站点生成器,单文件二进制,构建速度极快。

```bash
hugo new posts/my-post.md   # 创建文章
hugo server                 # 本地预览
hugo                        # 构建,产物在 public/
```

模板用 Go template 语法,配合主题系统效果很好。构建一万篇文章也在一秒以内。

**我没有选它的原因**是模板的定制成本。Go template 的语法对我来说不如 JS/TS 顺手,深度改造主题结构时,调试体验也不如 Astro 的组件模型直接。当然,如果你更熟悉 Go 生态,Hugo 是完全合理的选择 —— 它在构建速度上依然无可替代。

### 方案三:Astro(最终选择)

Astro 是「以内容为中心」的框架。它的定位很清晰:默认零 JavaScript 运行时,只在真正需要交互的组件上「激活」客户端代码。

```astro
---
import { getCollection, render } from 'astro:content';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<ul>
  {posts.map((post) => <li><a href={`/blog/${post.id}/`}>{post.data.title}</a></li>)}
</ul>
```

**决定性的理由**是内容集合。它把「文章」变成了一等公民:

```ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

定义一次,全站受益 —— frontmatter 自动校验、TypeScript 类型自动推导、编辑器里还有自动补全。对一个要长期维护的博客来说,这种「把错误挡在构建期而不是运行期」的能力,比构建快 200 毫秒重要得多。

## 部署方式:为什么是 Actions 而不是分支

GitHub Pages 过去支持「从某个分支直接发布」,现在官方推荐的做法是走 GitHub Actions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

相比把构建产物提交到 `gh-pages` 分支,Actions 方案有几个实际好处:

1. **仓库里不存构建产物** —— 源码仓库保持干净,不用维护「源码在 main、产物在 gh-pages」的双分支结构
2. **权限更小** —— 只需要 `pages: write` 和 `id-token: write`,不需要 `contents: write`
3. **回滚更自然** —— 部署历史在 Actions 页面里,重新跑一次历史任务就是回滚

而且因为 Actions 用的是 OIDC 换取的临时令牌,不需要在仓库里存任何长期有效的密钥。

## 踩过的坑

### Node 版本与框架版本不匹配

这是最花时间的一个坑。装依赖时 npm 会警告引擎不匹配:

```
npm warn EBADENGINE Current: node@22.14.0
npm warn EBADENGINE Required: node@>=22.23.4
```

npm 默认只警告不报错(`engine-strict=false`),所以安装看起来「成功」了,但构建时可能莫名其妙地失败。

教训是:**把版本约束当作硬约束来对待**。既然本机 Node 是 22.14.0,就锁一个与之兼容的框架版本,而不是装最新版然后祈祷 CI 能跑通。

### 中文标签的 URL 编码

中文标签直接放进路径参数时,生成的链接和实际生成的文件对不上:

```astro
params: { tag: encodeURIComponent(tag) }   <!-- 生成时编码 -->
<a href={`/tags/${tag}/`}>                   <!-- 链接时忘记编码 -->
```

两处必须一致,否则标签页会 404。这个问题在我加上标签页之后立刻就暴露出来了 —— 第一版的中文标签点进去全是 404。

### 排序顺序不能假设

`getCollection()` 返回的顺序是**不确定**的,官方文档明确说明这一点。如果不自己排序,文章顺序在不同环境下可能不一致:

```ts
.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
```

## 一些还没用上的能力

Astro 的生态里还有很多东西我暂时没上:

- **MDX** —— 可以在 Markdown 里直接写组件,但会引入额外的构建复杂度,先用纯 Markdown
- **图片优化** —— `astro:assets` 能自动做响应式图片和格式转换,目前文章里图片还不多
- **全文搜索** —— Pagefind 可以在构建期生成静态索引,等文章多了再说

这些都可以后加,不影响现在的结构。**先把简单的事情做好,再按需扩展**,这本身也是一种工程选择。

---

下一篇会记录一些日常的开发心得。如果你有不同看法,欢迎在下面的评论区聊聊。
