# AI Meditation MVP Next.js

这是静态版 Demo 的工程化升级版本。

## 启动方式

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

3. 打开

```text
http://localhost:3000
```

## 当前能力

- 首页
- 分步骤问卷
- `/api/analyze`
- `/api/generate-meditation`
- 本地 mock 数据存储
- 结果页展示
- 浏览器语音播放

## 说明

- 当前仍使用本地 mock 文稿生成器
- 后续可替换 `lib/mock-openai.js` 为真实 OpenAI API 调用
