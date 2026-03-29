const fs = require('fs');
const { execSync } = require('child_process');

// 配置
const SOURCE_URL = 'https://ds65.tv1288.xyz';
const OUTPUT_FILE = 'LN.m3u';
const GITEE_USER = process.env.GITEE_USER || 'zt192';
const GITEE_REPO = process.env.GITEE_REPO || 'ln2';
const GITEE_TOKEN = process.env.GITEE_TOKEN;

async function main() {
  console.log('🦀 虾哥开始更新直播源...');

  // 1. 抓取直播源
  console.log('📡 正在抓取源数据...');
  let content;
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': SOURCE_URL
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    content = await response.text();
    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`✅ 抓取成功：${content.length} 字节`);
  } catch (err) {
    console.error('❌ 抓取失败:', err.message);
    process.exit(1);
  }

  // 2. 推送至 Gitee (通过 git push)
  console.log('🚀 准备推送至 Gitee...');
  try {
    const remoteUrl = `https://${GITEE_TOKEN}@gitee.com/${GITEE_USER}/${GITEE_REPO}.git`;
    
    // 设置远程仓库
    execSync(`git remote set-url origin ${remoteUrl}`, { stdio: 'ignore' });
    
    // 推送
    execSync('git push origin master', { stdio: 'inherit' });
    console.log('✅ 推送成功！');
  } catch (err) {
    console.error('❌ 推送失败:', err.message);
    process.exit(1);
  }

  console.log('🎉 更新完成！');
}

main();
