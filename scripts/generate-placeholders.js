/**
 * 12 款车型初始高品质矢量底图生成器。
 * 在 public/images/demo/models/<slug>/cover.svg 生成浅色舞台风格的车型演示图。
 * 生成的素材属于系统内置 Demo 资产（matchLevel: category），仅供选型参考。
 */
const fs = require('fs');
const path = require('path');

const models = [
  { slug: "auman-xinghui-max-580", name: "欧曼星辉 MAX 580", brand: "AUMAN", type: "6×4 牵引车" },
  { slug: "auman-xinghui-lng-500", name: "欧曼星辉 LNG 500", brand: "AUMAN", type: "6×4 天然气重卡" },
  { slug: "auman-xinghui-cold-chain-530", name: "欧曼星辉冷链 530", brand: "AUMAN", type: "智能温控冷链车" },
  { slug: "auman-xinghui-express-500", name: "欧曼星辉快递 500", brand: "AUMAN", type: "6×2 高速快运车" },
  { slug: "chenglong-h7-560-lng", name: "乘龙 H7 560 LNG", brand: "CHENGLONG", type: "6×4 燃气牵引车" },
  { slug: "chenglong-h5-cargo-260", name: "乘龙 H5 载货车 260", brand: "CHENGLONG", type: "4×2 大容积集散车" },
  { slug: "chenglong-k7-600", name: "乘龙 K7 600", brand: "CHENGLONG", type: "6×4 旗舰重卡" },
  { slug: "chenglong-t7-longhead", name: "乘龙 T7 长头重卡", brand: "CHENGLONG", type: "美洲风长头重卡" },
  { slug: "chenglong-l3-city-light", name: "乘龙 L3 城配轻卡", brand: "CHENGLONG", type: "同城商超仓配" },
  { slug: "chenglong-m3-engineering-400", name: "乘龙 M3 工程车 400", brand: "CHENGLONG", type: "8×4 渣土自卸车" },
  { slug: "chenglong-h7-ev-400kw", name: "乘龙 H7 纯电 400kW", brand: "CHENGLONG", type: "纯电动新能源重卡" },
  { slug: "auman-xinghui-box-350", name: "欧曼星辉厢式 350", brand: "AUMAN", type: "6×2 专用工业厢车" }
];

function generateSVG(model) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDFDFD"/>
      <stop offset="100%" stop-color="#ECECED"/>
    </linearGradient>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#bg)"/>
  <ellipse cx="600" cy="580" rx="460" ry="40" fill="url(#shadow)"/>
  <g fill="none" stroke="#D1D1D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 280 540 L 920 540" stroke="#8E8E93" stroke-width="4"/>
    <path d="M 320 540 L 320 280 L 480 280 L 580 340 L 880 340 L 880 540 Z"/>
    <path d="M 480 280 L 480 420 L 320 420"/>
    <circle cx="390" cy="540" r="45" fill="#E5E5EA" stroke="#8E8E93" stroke-width="5"/>
    <circle cx="750" cy="540" r="45" fill="#E5E5EA" stroke="#8E8E93" stroke-width="5"/>
    <circle cx="850" cy="540" r="45" fill="#E5E5EA" stroke="#8E8E93" stroke-width="5"/>
  </g>
  <text x="600" y="200" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="20" font-weight="600" fill="#86868B" text-anchor="middle" letter-spacing="4">${model.brand}</text>
  <text x="600" y="240" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="34" font-weight="700" fill="#1D1D1F" text-anchor="middle">${model.name}</text>
  <text x="600" y="470" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="16" font-weight="500" fill="#86868B" text-anchor="middle">${model.type} · 选型展示图</text>
</svg>`;
}

const baseDir = path.join(process.cwd(), 'public', 'images', 'demo', 'models');

models.forEach((m) => {
  const modelDir = path.join(baseDir, m.slug);
  fs.mkdirSync(modelDir, { recursive: true });
  fs.writeFileSync(path.join(modelDir, 'cover.svg'), generateSVG(m), 'utf8');
});

console.log(`\x1b[32m[ASSETS]\x1b[0m 已成功初始化 12 款车型的系统级高清矢量演示图素材。`);
