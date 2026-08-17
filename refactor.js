const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const appDir = path.join(__dirname, 'app', '[lang]');

walkDir(appDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Update getAllContent calls
    if (content.includes('getAllContent(')) {
      content = content.replace(/getAllContent\((['"][^'"]+['"])/g, 'getAllContent(lang, $1');
      changed = true;
    }

    // Update getFileContent calls
    if (content.includes('getFileContent(')) {
      content = content.replace(/getFileContent\((['"][^'"]+['"])/g, 'getFileContent(lang, $1');
      changed = true;
    }
    
    // Update params to include lang in the types if necessary, though mostly we just need `lang` in scope.
    // Let's also add `const { lang } = await params;` if `lang` is used but not defined (this might be tricky with regex).
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
