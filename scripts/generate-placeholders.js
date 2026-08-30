/**
 * 12 款车型展示图生成器（厂商风格矢量整车彩图）。
 * 在 public/images/demo/models/<slug>/cover.svg 生成按真实车型特征绘制的
 * 侧视整车插画（驾驶室/气瓶/保温厢/制冷机组/自卸货斗/长头/电池组等）。
 * 注意：这些属于「车型展示图（演示图）」，不代表门店实车，免责声明由前台组件叠加展示。
 */
const fs = require('fs');
const path = require('path');

// ---------- 基础元素 ----------

function defs() {
  return `<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDFDFD"/>
      <stop offset="100%" stop-color="#ECECED"/>
    </linearGradient>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.14)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <linearGradient id="cabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="{CAB_TOP}"/>
      <stop offset="100%" stop-color="{CAB_BOT}"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C4D6E8"/>
      <stop offset="100%" stop-color="#8FB0CC"/>
    </linearGradient>
    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBFCFD"/>
      <stop offset="100%" stop-color="#E4E7EB"/>
    </linearGradient>
    <linearGradient id="tankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EDEFF2"/>
      <stop offset="100%" stop-color="#C3C8CF"/>
    </linearGradient>
    <linearGradient id="bedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F2A93B"/>
      <stop offset="100%" stop-color="#D97E1F"/>
    </linearGradient>
  </defs>`;
}

function stage() {
  return `<rect width="1200" height="750" fill="url(#bg)"/>
  <ellipse cx="620" cy="575" rx="430" ry="26" fill="url(#shadow)"/>`;
}

function wheel(cx, cy, r, dual = false) {
  const spokes = [0, 60, 120, 180, 240, 300]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      const x1 = cx - Math.cos(rad) * r * 0.16;
      const y1 = cy - Math.sin(rad) * r * 0.16;
      const x2 = cx - Math.cos(rad) * r * 0.46;
      const y2 = cy - Math.sin(rad) * r * 0.46;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    })
    .join('');
  const dualCircle = dual
    ? `<circle cx="${cx + r * 0.62}" cy="${cy}" r="${r * 0.94}" fill="#2E3035"/>
       <circle cx="${cx + r * 0.62}" cy="${cy}" r="${r * 0.56}" fill="#E3E5E8" stroke="#A7ABB2" stroke-width="3"/>`
    : '';
  return `<g>
    ${dualCircle}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2E3035"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="#E3E5E8" stroke="#A7ABB2" stroke-width="3"/>
    <g stroke="#A7ABB2" stroke-width="4" stroke-linecap="round">${spokes}</g>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.17}" fill="#8E8E93"/>
  </g>`;
}

function ground(x1, x2) {
  return `<line x1="${x1}" y1="560" x2="${x2}" y2="560" stroke="#8E8E93" stroke-width="5" stroke-linecap="round"/>`;
}

function chassis(x1, x2, y = 492) {
  return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="18" rx="7" fill="#6B7078"/>`;
}

// 标准平头驾驶室（车头朝左）
function cab(x, top, opts = {}) {
  const w = opts.w ?? 250;
  const color = opts.color ?? 'url(#cabGrad)';
  const deflector = opts.deflector
    ? `<path d="M ${x + 84} ${top} L ${x + 128} ${top - 46} L ${x + w} ${top - 46} L ${x + w} ${top} Z" fill="${color}" stroke="#9AA0A8" stroke-width="2"/>`
    : '';
  return `<g>
    ${deflector}
    <path d="M ${x + 10} 492 L ${x + 4} ${top + 62} Q ${x + 4} ${top} ${x + 66} ${top} L ${x + w - 16} ${top} Q ${x + w} ${top} ${x + w} ${top + 18} L ${x + w} 492 Z"
      fill="${color}" stroke="#9AA0A8" stroke-width="2.5"/>
    <path d="M ${x + 34} ${top + 28} L ${x + w - 28} ${top + 28} Q ${x + w - 20} ${top + 28} ${x + w - 20} ${top + 40} L ${x + w - 20} ${top + 108} L ${x + 34} ${top + 108} Z"
      fill="url(#glassGrad)" stroke="#7E93A8" stroke-width="2.5"/>
    <line x1="${x + w * 0.56}" y1="${top + 108}" x2="${x + w * 0.56}" y2="488" stroke="rgba(255,255,255,0.55)" stroke-width="3"/>
    <rect x="${x + w * 0.62}" y="${top + 122}" width="26" height="7" rx="3.5" fill="#7A7F87"/>
    <rect x="${x - 8}" y="${top + 54}" width="10" height="26" rx="3" fill="#5A5E66"/>
    <rect x="${x - 2}" y="428" width="40" height="17" rx="5" fill="#FFE9A8" stroke="#D6B84C" stroke-width="2"/>
    <rect x="${x - 12}" y="462" width="72" height="30" rx="7" fill="#7A7F87"/>
    <rect x="${x + w - 74}" y="464" width="42" height="28" rx="5" fill="#5A5E66"/>
  </g>`;
}

// 长头驾驶室（乘龙 T7）
function longNoseCab(x, top, color) {
  return `<g>
    <path d="M ${x + 142} 492 L ${x + 142} ${top + 62} L ${x + 186} ${top} L ${x + 320} ${top} Q ${x + 334} ${top} ${x + 334} ${top + 18} L ${x + 334} 492 Z"
      fill="${color}" stroke="#9AA0A8" stroke-width="2.5"/>
    <path d="M ${x} ${top + 34} L ${x + 128} ${top + 34} Q ${x + 142} ${top + 34} ${x + 142} ${top + 52} L ${x + 142} ${top + 62} L ${x + 142} 492 L ${x + 6} 492 Q ${x - 6} 492 ${x} ${top + 78} Z"
      fill="${color}" stroke="#9AA0A8" stroke-width="2.5"/>
    <path d="M ${x + 158} ${top + 16} L ${x + 296} ${top + 16} L ${x + 296} ${top + 100} L ${x + 158} ${top + 100} Z" fill="url(#glassGrad)" stroke="#7E93A8" stroke-width="2.5"/>
    <line x1="${x + 236}" y1="${top + 100}" x2="${x + 236}" y2="488" stroke="rgba(255,255,255,0.55)" stroke-width="3"/>
    <rect x="${x + 10}" y="416" width="34" height="17" rx="5" fill="#FFE9A8" stroke="#D6B84C" stroke-width="2"/>
    <rect x="${x - 6}" y="${top + 46}" width="10" height="26" rx="3" fill="#5A5E66"/>
    <g stroke="#8E8E93" stroke-width="4" stroke-linecap="round">
      <line x1="${x + 22}" y1="448" x2="${x + 118}" y2="448"/>
      <line x1="${x + 22}" y1="462" x2="${x + 118}" y2="462"/>
    </g>
    <rect x="${x - 12}" y="468" width="146" height="24" rx="7" fill="#7A7F87"/>
  </g>`;
}

// LNG 气瓶后置支架
function lngRack(x) {
  return `<g>
    <rect x="${x}" y="292" width="188" height="66" rx="30" fill="url(#tankGrad)" stroke="#9AA0A8" stroke-width="2.5"/>
    <rect x="${x}" y="376" width="188" height="66" rx="30" fill="url(#tankGrad)" stroke="#9AA0A8" stroke-width="2.5"/>
    <ellipse cx="${x + 10}" cy="325" rx="9" ry="24" fill="#AEB3BA"/>
    <ellipse cx="${x + 10}" cy="409" rx="9" ry="24" fill="#AEB3BA"/>
    <line x1="${x + 62}" y1="292" x2="${x + 62}" y2="358" stroke="#9AA0A8" stroke-width="4"/>
    <line x1="${x + 126}" y1="292" x2="${x + 126}" y2="358" stroke="#9AA0A8" stroke-width="4"/>
    <line x1="${x + 62}" y1="376" x2="${x + 62}" y2="442" stroke="#9AA0A8" stroke-width="4"/>
    <line x1="${x + 126}" y1="376" x2="${x + 126}" y2="442" stroke="#9AA0A8" stroke-width="4"/>
  </g>`;
}

// 厢式货厢（cargo / box van）
function boxBody(x1, x2, y1, y2, stripe) {
  return `<g>
    <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" rx="12" fill="url(#boxGrad)" stroke="#C9CDD3" stroke-width="2.5"/>
    <line x1="${x1 + (x2 - x1) * 0.33}" y1="${y1 + 10}" x2="${x1 + (x2 - x1) * 0.33}" y2="${y2 - 10}" stroke="#DDE1E6" stroke-width="3"/>
    <line x1="${x1 + (x2 - x1) * 0.66}" y1="${y1 + 10}" x2="${x1 + (x2 - x1) * 0.66}" y2="${y2 - 10}" stroke="#DDE1E6" stroke-width="3"/>
    <rect x="${x1 + 6}" y="${y2 - 20}" width="${x2 - x1 - 12}" height="12" rx="5" fill="${stripe}"/>
  </g>`;
}

// 冷链制冷机组
function reeferUnit(x, y) {
  return `<g>
    <rect x="${x}" y="${y}" width="46" height="60" rx="7" fill="#F2F4F6" stroke="#9AA0A8" stroke-width="2.5"/>
    <g stroke="#7A7F87" stroke-width="4" stroke-linecap="round">
      <line x1="${x + 10}" y1="${y + 16}" x2="${x + 36}" y2="${y + 16}"/>
      <line x1="${x + 10}" y1="${y + 30}" x2="${x + 36}" y2="${y + 30}"/>
      <line x1="${x + 10}" y1="${y + 44}" x2="${x + 36}" y2="${y + 44}"/>
    </g>
    <circle cx="${x + 23}" cy="${y - 12}" r="7" fill="none" stroke="#2E86C1" stroke-width="3"/>
    <text x="${x + 23}" y="${y - 6}" font-family="sans-serif" font-size="11" fill="#2E86C1" text-anchor="middle">❄</text>
  </g>`;
}

// 自卸货斗
function dumpBed(x1, x2, y1, y2) {
  const ribs = [0.22, 0.44, 0.66, 0.88]
    .map(
      (p) =>
        `<line x1="${(x1 + (x2 - x1) * p).toFixed(1)}" y1="${y1 + 12}" x2="${(x1 + (x2 - x1 - 30) * p + 15).toFixed(1)}" y2="${y2 - 8}" stroke="#B4690F" stroke-width="5" opacity="0.6"/>`
    )
    .join('');
  return `<g>
    <path d="M ${x1} ${y1} L ${x2} ${y1} L ${x2 - 34} ${y2} L ${x1 + 26} ${y2} Z" fill="url(#bedGrad)" stroke="#B4690F" stroke-width="3"/>
    <rect x="${x1 - 4}" y="${y1 - 10}" width="${x2 - x1 + 8}" height="14" rx="6" fill="#E8912D" stroke="#B4690F" stroke-width="2.5"/>
    ${ribs}
  </g>`;
}

// 纯电电池包
function batteryPack(x1, x2) {
  const cells = [0, 1, 2, 3, 4, 5]
    .map(
      (i) =>
        `<line x1="${x1 + ((x2 - x1) / 6) * (i + 0.5)}" y1="${462}" x2="${x1 + ((x2 - x1) / 6) * (i + 0.5)}" y2="${502}" stroke="#27AE60" stroke-width="4" opacity="0.85"/>`
    )
    .join('');
  return `<g>
    <rect x="${x1}" y="${458}" width="${x2 - x1}" height="46" rx="12" fill="#2F3237"/>
    ${cells}
    <circle cx="${x1 - 22}" cy="${480}" r="10" fill="none" stroke="#27AE60" stroke-width="4"/>
  </g>`;
}

function texts(brand, name, type) {
  return `<text x="600" y="132" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="21" font-weight="600" fill="#86868B" text-anchor="middle" letter-spacing="5">${brand}</text>
  <text x="600" y="176" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="34" font-weight="700" fill="#1D1D1F" text-anchor="middle">${name}</text>
  <text x="600" y="654" font-family="-apple-system, SF Pro Display, PingFang SC, sans-serif" font-size="16" font-weight="500" fill="#86868B" text-anchor="middle">${type} · 车型展示图（非门店实拍）</text>`;
}

function svg(model) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="100%" height="100%">
  ${defs().replace(/\{CAB_TOP\}/g, model.cabTop).replace(/\{CAB_BOT\}/g, model.cabBot)}
  ${stage()}
  ${model.body()}
  ${texts(model.brand, model.name, model.type)}
</svg>`;
}

// ---------- 配色 ----------
const AUMAN = { top: '#4C7CC0', bot: '#31517F' };   // 欧曼蓝
const AUMAN_SILVER = { top: '#D9DDE2', bot: '#AEB4BC' }; // 欧曼银
const CL_RED = { top: '#D2574A', bot: '#9E2F24' };  // 乘龙红
const CL_WHITE = { top: '#F4F6F8', bot: '#D5D9DE' }; // 乘龙白

// ---------- 12 款车型定义 ----------
const models = [
  {
    slug: 'auman-xinghui-max-580',
    name: '欧曼星辉 MAX 580',
    brand: 'AUMAN',
    type: '6×4 牵引车 · 干线高效物流',
    cabTop: AUMAN.top, cabBot: AUMAN.bot,
    body: () =>
      ground(230, 980) + chassis(300, 950) +
      cab(258, 244, { color: 'url(#cabGrad)', deflector: true }) +
      `<path d="M 636 468 L 742 468 L 726 492 L 652 492 Z" fill="#4A4E55"/>` +
      wheel(336, 512, 48) + wheel(806, 512, 48, true) + wheel(920, 512, 48, true)
  },
  {
    slug: 'auman-xinghui-lng-500',
    name: '欧曼星辉 LNG 500',
    brand: 'AUMAN',
    type: '6×4 天然气重卡 · 资源与长途运输',
    cabTop: AUMAN_SILVER.top, cabBot: AUMAN_SILVER.bot,
    body: () =>
      ground(230, 1000) + chassis(300, 950) +
      cab(258, 244, { color: 'url(#cabGrad)', deflector: true }) +
      lngRack(548) +
      `<path d="M 636 468 L 742 468 L 726 492 L 652 492 Z" fill="#4A4E55" opacity="0"/>` +
      wheel(336, 512, 48) + wheel(836, 512, 48, true) + wheel(950, 512, 48, true)
  },
  {
    slug: 'auman-xinghui-cold-chain-530',
    name: '欧曼星辉冷链 530',
    brand: 'AUMAN',
    type: '智能温控冷链车 · 生鲜温控运输',
    cabTop: AUMAN.top, cabBot: AUMAN.bot,
    body: () =>
      ground(220, 1060) + chassis(300, 1030) +
      cab(252, 250, { color: 'url(#cabGrad)', w: 236 }) +
      boxBody(500, 1046, 226, 492, '#2E86C1') +
      reeferUnit(452, 244) +
      `<text x="773" y="300" font-family="-apple-system, PingFang SC, sans-serif" font-size="26" font-weight="600" fill="#9AA5B1" text-anchor="middle" letter-spacing="6">COLD CHAIN</text>` +
      wheel(326, 512, 47) + wheel(840, 512, 47, true) + wheel(936, 512, 47) + wheel(1000, 512, 47, true)
  },
  {
    slug: 'auman-xinghui-express-500',
    name: '欧曼星辉快递 500',
    brand: 'AUMAN',
    type: '6×2 高速快运车 · 快递电商干线',
    cabTop: AUMAN_SILVER.top, cabBot: AUMAN_SILVER.bot,
    body: () =>
      ground(230, 1000) + chassis(300, 950) +
      cab(258, 240, { color: 'url(#cabGrad)', deflector: true }) +
      `<path d="M 636 468 L 742 468 L 726 492 L 652 492 Z" fill="#4A4E55"/>` +
      `<rect x="530" y="452" width="52" height="40" rx="8" fill="#C9CDD3" stroke="#9AA0A8" stroke-width="2"/>` +
      wheel(336, 512, 48) + wheel(850, 512, 48) + wheel(946, 512, 48)
  },
  {
    slug: 'chenglong-h7-560-lng',
    name: '乘龙 H7 560 LNG',
    brand: 'CHENGLONG',
    type: '6×4 燃气牵引车 · 绿通及重载干线',
    cabTop: CL_RED.top, cabBot: CL_RED.bot,
    body: () =>
      ground(230, 1000) + chassis(300, 950) +
      cab(258, 244, { color: 'url(#cabGrad)', deflector: true }) +
      lngRack(548) +
      wheel(336, 512, 48) + wheel(836, 512, 48, true) + wheel(950, 512, 48, true)
  },
  {
    slug: 'chenglong-h5-cargo-260',
    name: '乘龙 H5 载货车 260',
    brand: 'CHENGLONG',
    type: '4×2 大容积载货车 · 区域集散分拨',
    cabTop: CL_RED.top, cabBot: CL_RED.bot,
    body: () =>
      ground(250, 940) + chassis(320, 880) +
      cab(280, 300, { color: 'url(#cabGrad)', w: 196 }) +
      boxBody(486, 892, 252, 492, '#C0392B') +
      wheel(348, 514, 44) + wheel(800, 514, 44, true)
  },
  {
    slug: 'chenglong-k7-600',
    name: '乘龙 K7 600',
    brand: 'CHENGLONG',
    type: '6×4 旗舰重卡 · 高端干线零担',
    cabTop: CL_RED.top, cabBot: CL_RED.bot,
    body: () =>
      ground(230, 980) + chassis(300, 950) +
      cab(258, 232, { color: 'url(#cabGrad)', deflector: true }) +
      `<rect x="300" y="220" width="196" height="10" rx="5" fill="#E8C34A"/>` +
      `<path d="M 636 468 L 742 468 L 726 492 L 652 492 Z" fill="#4A4E55"/>` +
      `<rect x="262" y="428" width="40" height="17" rx="5" fill="#FFF6D9" stroke="#E8C34A" stroke-width="2"/>` +
      wheel(336, 512, 48) + wheel(806, 512, 48, true) + wheel(920, 512, 48, true)
  },
  {
    slug: 'chenglong-t7-longhead',
    name: '乘龙 T7 长头重卡',
    brand: 'CHENGLONG',
    type: '美洲风长头重卡 · 跨省长途舒适型',
    cabTop: CL_RED.top, cabBot: CL_RED.bot,
    body: () =>
      ground(210, 980) + chassis(280, 950) +
      longNoseCab(240, 264, 'url(#cabGrad)') +
      `<path d="M 636 468 L 742 468 L 726 492 L 652 492 Z" fill="#4A4E55"/>` +
      wheel(318, 512, 48) + wheel(806, 512, 48, true) + wheel(920, 512, 48, true)
  },
  {
    slug: 'chenglong-l3-city-light',
    name: '乘龙 L3 城配轻卡',
    brand: 'CHENGLONG',
    type: '4×2 城配轻卡 · 同城商超仓配',
    cabTop: CL_WHITE.top, cabBot: CL_WHITE.bot,
    body: () =>
      ground(240, 900) + chassis(310, 850) +
      cab(296, 330, { color: 'url(#cabGrad)', w: 158 }) +
      boxBody(458, 872, 292, 494, '#C0392B') +
      wheel(360, 516, 40) + wheel(776, 516, 40, true)
  },
  {
    slug: 'chenglong-m3-engineering-400',
    name: '乘龙 M3 工程车 400',
    brand: 'CHENGLONG',
    type: '8×4 渣土自卸车 · 渣土与矿区工程',
    cabTop: CL_RED.top, cabBot: CL_RED.bot,
    body: () =>
      ground(220, 1060) + chassis(300, 1030) +
      cab(252, 258, { color: 'url(#cabGrad)', w: 220 }) +
      dumpBed(496, 1056, 286, 492) +
      wheel(330, 512, 48) + wheel(826, 512, 48, true) + wheel(922, 512, 48) + wheel(990, 512, 48, true)
  },
  {
    slug: 'chenglong-h7-ev-400kw',
    name: '乘龙 H7 纯电 400kW',
    brand: 'CHENGLONG',
    type: '纯电动新能源重卡 · 港口短驳/钢厂闭环',
    cabTop: CL_WHITE.top, cabBot: CL_WHITE.bot,
    body: () =>
      ground(230, 980) + chassis(300, 950) +
      cab(258, 244, { color: 'url(#cabGrad)', deflector: true }) +
      batteryPack(560, 900) +
      `<rect x="262" y="396" width="70" height="16" rx="8" fill="#27AE60"/>
       <text x="297" y="409" font-family="sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">EV</text>` +
      wheel(336, 512, 48) + wheel(806, 512, 48, true) + wheel(920, 512, 48, true)
  },
  {
    slug: 'auman-xinghui-box-350',
    name: '欧曼星辉厢式 350',
    brand: 'AUMAN',
    type: '6×2 专用厢式运输车 · 工业散货及专线',
    cabTop: AUMAN.top, cabBot: AUMAN.bot,
    body: () =>
      ground(220, 1060) + chassis(300, 1030) +
      cab(252, 256, { color: 'url(#cabGrad)', w: 216 }) +
      boxBody(478, 1052, 240, 492, '#31517F') +
      wheel(330, 512, 47) + wheel(850, 512, 47) + wheel(946, 512, 47)
  }
];

const baseDir = path.join(process.cwd(), 'public', 'images', 'demo', 'models');

models.forEach((m) => {
  const modelDir = path.join(baseDir, m.slug);
  fs.mkdirSync(modelDir, { recursive: true });
  fs.writeFileSync(path.join(modelDir, 'cover.svg'), svg(m), 'utf8');
});

console.log(`\x1b[32m[ASSETS]\x1b[0m 已生成 12 款车型的厂商风格整车展示图（演示图，非实拍）。`);
