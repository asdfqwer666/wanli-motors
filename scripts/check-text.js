/**
 * 颍东区行政区划用字合规强校验脚本。
 * 说明：为避免脚本扫描到自身源码中的敏感字样，禁用词通过字符串拼接构造。
 */
const fs = require('fs');
const path = require('path');

const FORBIDDEN_WORD = '颖' + '东区';
const CORRECT_WORD = '颍东区';

const TARGET_DIRS = ['src', 'public', 'scripts', 'data'];
const TARGET_ROOT_FILES = ['README.md'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'out', 'build', '.vercel'];

let errorCount = 0;

function scanFile(fullPath) {
  const ext = path.extname(fullPath).toLowerCase();
  if (!['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html'].includes(ext)) {
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(FORBIDDEN_WORD)) {
    console.error(`\x1b[31m[TEXT ERROR]\x1b[0m 发现严禁错别字 "${FORBIDDEN_WORD}" 在文件: ${fullPath}`);
    console.error(`            必须修正为正确的 "${CORRECT_WORD}"！`);
    errorCount++;
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      scanFile(fullPath);
    }
  }
}

console.log(`\x1b[36m[CHECK]\x1b[0m 正在扫描项目中可能存在的 "${FORBIDDEN_WORD}" 错别字...`);
TARGET_DIRS.forEach((dir) => {
  const targetPath = path.join(process.cwd(), dir);
  if (fs.existsSync(targetPath)) {
    scanDirectory(targetPath);
  }
});
TARGET_ROOT_FILES.forEach((file) => {
  const targetPath = path.join(process.cwd(), file);
  if (fs.existsSync(targetPath)) {
    scanFile(targetPath);
  }
});

if (errorCount > 0) {
  console.error(`\x1b[31m[FAILED]\x1b[0m 共发现 ${errorCount} 处文本违规，构建已终止。请修正后再试。`);
  process.exit(1);
} else {
  console.log(`\x1b[32m[PASSED]\x1b[0m 行政区划文本合规检查全部通过（"颍东区" 用字无误）。`);
  process.exit(0);
}
