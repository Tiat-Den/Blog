const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const appDir = path.join(__dirname, 'app', '[lang]');

walkDir(appDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    let hasParams = content.includes('params: Promise<{');
    
    // Inject params if missing, but we'll do this safely.
    // Instead of regex hacking everything, I'll just use a more careful regex for the page components.
    
    if (content.match(/export default (async )?function \w+\(\)\s*\{/)) {
       content = content.replace(/(export default (async )?function \w+)\(\)\s*\{/, '$1({ params }: { params: Promise<{ lang: string }> }) {\n  const { lang } = await params;');
       changed = true;
    } else if (content.match(/export default (async )?function \w+\(props: [^)]+\)\s*\{/) && !content.includes('const { lang } = await params')) {
       // if it already has props, assume props.params has lang
       content = content.replace(/(export default (async )?function \w+\(props: [^)]+\)\s*\{)/, '$1\n  // ensure lang is extracted\n  const { lang } = await props.params;');
       changed = true;
    }

    // Now update getAllContent and getFileContent
    if (content.match(/getAllContent\((['"][^'"]+['"])/)) {
      content = content.replace(/getAllContent\((['"][^'"]+['"])/g, 'getAllContent(lang, $1');
      changed = true;
    }

    if (content.match(/getFileContent\((['"][^'"]+['"])/)) {
      content = content.replace(/getFileContent\((['"][^'"]+['"])/g, 'getFileContent(lang, $1');
      changed = true;
    }

    // update internal links from href="/ to href={`/${lang}/
    // Only do this for links like href="/blog" or href={`/blog/${
    if (content.match(/href="\/([^"]*)"/)) {
       content = content.replace(/href="\/([^"]*)"/g, 'href={`/${lang}/$1`}');
       changed = true;
    }

    if (content.match(/href=\{\`\/([^$]*)\$\{/)) {
       content = content.replace(/href=\{\`\/([^$]*)\$\{/g, 'href={`/${lang}/$1${');
       changed = true;
    }

    if (content.match(/href=\{\`\/\$\{params\.slug\}/)) {
      // already root relative with slug
      content = content.replace(/href=\{\`\/\$\{params\.slug\}/g, 'href={`/${lang}/${params.slug}');
      changed = true;
    }

    if (content.includes('generateStaticParams')) {
       // generateStaticParams needs updates
       content = content.replace(/const files = await getFiles\("([^"]+)"\);/, 'const viFiles = await getFiles("vi", "$1");\n  const enFiles = await getFiles("en", "$1");\n  const files = [...viFiles.map(f => ({ lang: "vi", slug: f.replace(/\\.mdx?$/, "") })), ...enFiles.map(f => ({ lang: "en", slug: f.replace(/\\.mdx?$/, "") }))];\n  return files;');
       content = content.replace(/return files\.map\(\(file\) => \(\{\n\s*slug: file\.replace\(\/\\\\\.mdx\?\$\/, ""\),\n\s*\}\)\);/, '');
       changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
