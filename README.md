# Lynia's Blog

<p align="center">
  <img src="public/avatar.png" width="120" height="120" style="border-radius: 50%" alt="avatar" />
</p>

<p align="center">个人技术博客，分享 XCPC 题解、算法笔记与开发心得。</p>

<p align="center">
  <a href="https://github.com/yxz2333/yxz2333.github.io/actions/workflows/deploy.yml">
    <img src="https://github.com/yxz2333/yxz2333.github.io/actions/workflows/deploy.yml/badge.svg" alt="Deploy" />
  </a>
</p>

## 技术栈

| 层   | 技术                   |
| ---- | ---------------------- |
| 框架 | Vue 3 + Vite           |
| 样式 | Tailwind CSS           |
| 路由 | Vue Router             |
| 部署 | GitHub Pages + Actions |

## How to use?

```bash
yarn install
yarn dev
yarn build
yarn preview
```

## 内容管理

笔记按类型存放在 `public/` 下的三个目录：

| 目录 | 类型       | 路由       |
| ---- | ---------- | ---------- |
| `p/` | 题目题解   | `/p/:slug` |
| `k/` | 算法知识点 | `/k/:slug` |
| `c/` | 比赛题解   | `/c/:slug` |

由后端解析器自动生成。手动添加笔记：

1. 将 `.md` 文件放入 `backend/notes-in/`
2. 运行 `cd backend && uv run python parse_notes.py`
3. JSON 自动输出到 `public/{p,k,c}/`