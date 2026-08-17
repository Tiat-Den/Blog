const fs = require('fs');
const files = [
  'content/en/projects/app-ql-qr.mdx',
  'content/en/projects/aspnet-web-store.mdx',
  'content/vi/projects/app-ql-qr.mdx',
  'content/vi/projects/aspnet-web-store.mdx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/demoUrl:\s*\"\"\n/g, '');
  fs.writeFileSync(f, c);
});
