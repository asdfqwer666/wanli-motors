# 万里商用车官网

阜阳市万里汽车销售服务有限公司数字化官网 —— 前台官网 + 车型产品库 + 车型对比 + 门店展示 + 顾问咨询 + 后台媒体管理系统。

技术栈：Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide React · Framer Motion · Sharp

## 快速开始

```bash
npm install
npm run generate:placeholders   # 生成 12 款车型的矢量演示图（首次必跑）
npm run dev                     # 开发模式 http://localhost:3000
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` | 先执行文本合规校验，再产出生产构建 |
| `npm run start` | 运行生产构建 |
| `npm run check:text` | 「颍东区」行政区划用字合规强校验 |
| `npm run generate:placeholders` | 重新生成车型演示图素材 |

## 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

- `ADMIN_PASSWORD`：后台登录密码
- `ADMIN_SESSION_SECRET`：Session 签名密钥（至少 32 位随机字符串）
- `MEDIA_STORAGE_PROVIDER`：Vercel 生产环境设为 `blob`；不设置时使用本地文件系统
- `BLOB_READ_WRITE_TOKEN`：在 Vercel 项目中创建并连接 Blob Store 后自动注入，严禁提交到仓库

缺失密钥时后台登录被拒绝，但不影响前台页面正常渲染。

## 后台媒体管理

- 入口：`/admin/login` → `/admin/models` → 车型双栏工作台
- 左栏为系统只读演示资产（`matchLevel: category`），禁止删除与篡改
- 右栏上传门店实拍图：自动方向校正、剔除 EXIF/GPS、等比限宽 2560px、转码 WebP（质量 85）
- 本地开发时，实拍存储于 `public/images/uploads/models/<slug>/`，元数据写入 `data/media-registry.json`
- Vercel 生产环境使用浏览器直传 Blob（单张 10MB），服务端校验并转码后将 WebP 成品与车型级 JSON 元数据持久化到 Blob
- 删除全部实拍后前台自动回退演示图；Blob 暂时不可用时公开页面也会安全回退，不抛出 500
- 安全限制：仅 JPEG/PNG/WebP/AVIF（Magic Number 校验）、单张 ≤10MB、单批 ≤10 张、≤50MP、路径遍历防御

## 车型图片来源治理

- `src/data/reference-image-sources.json` 记录 12 款车型的检索词、来源页、匹配级别、版权状态与采用结论
- 只有 `usageStatus: approved` 且 `copyrightStatus: approved` 的外部参考图才允许进入前台媒体注册表
- 当前未经书面或明确许可的官网 / 媒体候选图均不下载、不上线；车型不完全匹配时保留演示图并显示免责声明

## 发布说明

- 代码托管于 GitHub（asdfqwer666），部署至 Vercel（`https://<repo>.vercel.app`）
- Vercel 项目需要创建 Blob Store，并在 Production / Preview 环境配置上述三个后台与存储变量
