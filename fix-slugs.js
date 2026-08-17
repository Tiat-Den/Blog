const fs = require('fs');

const files = [
  'd:/Project_Web/Web-Blog/app/[lang]/brain/[slug]/page.tsx',
  'd:/Project_Web/Web-Blog/app/[lang]/lab/[slug]/page.tsx',
  'd:/Project_Web/Web-Blog/app/[lang]/capsule/[slug]/page.tsx'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix dead code in generateStaticParams
  content = content.replace(/return files;\s*return files\.map\(\(file\) => \(\{\s*slug: file\.replace\(\/\\\\\.mdx\?\$\/, ""\),\s*\}\)\);/g, 'return files;');

  // Destructure lang properly
  content = content.replace(/const params = await props\.params;\n\s*const (\w+) = await getFileContent\(params\.lang/g, 'const params = await props.params;\n  const { lang } = params;\n  const $1 = await getFileContent(lang');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
});
