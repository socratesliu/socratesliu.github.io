/**
 * 站点全局信息集中管理。修改站点标题、描述、作者等信息只需改这一个文件。
 */
export const SITE = {
  title: '苏格拉底刘的技术博客',
  description: '记录技术实践、阅读笔记与日常思考。',
  author: '苏格拉底刘',
  /** 语言标记,影响 <html lang> 与 RSS 的 language 字段 */
  lang: 'zh-CN',
  /** 仓库地址,Giscus 评论组件需要 */
  repo: 'socratesliu/socratesliu.github.io',
} as const;

/**
 * Giscus 评论组件配置。
 *
 * repoId / categoryId 由 GitHub GraphQL API 查询得到,是仓库专属的公开标识
 * (非密钥),可以安全地提交进仓库。获取方式见 README。
 *
 * category 目前用仓库默认自带的 General 分类。GitHub 没有开放创建讨论分类的
 * API(GraphQL 与 REST 均无),想单独建一个 Comment 分类需要在网页端操作,
 * 拿到新 id 后改这里的 category / categoryId 即可。
 */
export const GISCUS = {
  repoId: 'R_kgDOVi185g',
  category: 'General',
  categoryId: 'DIC_kwDOVi185s4DKYQW',
} as const;
