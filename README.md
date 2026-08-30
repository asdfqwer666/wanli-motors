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

缺失密钥时后台登录被拒绝，但不影响前台页面正常渲染。

## 后台媒体管理

- 入口：`/admin/login` → `/admin/models` → 车型双栏工作台
- 左栏为系统只读演示资产（`matchLevel: category`），禁止删除与篡改
- 右栏上传门店实拍图：自动方向校正、剔除 EXIF/GPS、等比限宽 2560px、转码 WebP（质量 85）
- 实拍存储于 `public/images/uploads/models/<slug>/`，删除全部实拍后前台自动回退演示图
- 安全限制：仅 JPEG/PNG/WebP/AVIF（Magic Number 校验）、单张 ≤10MB、单批 ≤10 张、≤50MP、路径遍历防御

## 发布说明

- 代码托管于 GitHub（asdfqwer666），部署至 Vercel（`https://<repo>.vercel.app`）
- 注意：Vercel 文件系统为只读，后台实拍上传功能仅在本地 / 自托管环境可持久化；生产环境建议接入对象存储
