import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 仓库名为 GitHub 用户站点(socratesliu.github.io),站点部署在根域,
// 因此 site 直接填写域名且不设置 base。
//
// 注意:@astrojs/rss v4 起不再是 integration,它是纯函数库,
// 由 src/pages/rss.xml.js 直接调用 rss() 生成 feed。
export default defineConfig({
  site: 'https://socratesliu.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // 双主题:浅色用 github-light,深色用 github-dark-dimmed。
      // Shiki 会输出 --shiki-light / --shiki-dark 两组 CSS 变量,
      // 由 global.css 依据 :root[data-theme] 选择其一。
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      defaultColor: 'light',
      wrap: true,
    },
  },
});
