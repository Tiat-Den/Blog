const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { 
    name: 'app-ql-qr.mdx', 
    tech: '["Kotlin", "Room DB", "CameraX", "ZXing"]' 
  },
  { 
    name: 'aspnet-web-store.mdx', 
    tech: '["ASP.NET Core", "C#", "SQL Server", "EF Core"]' 
  },
  { 
    name: 'flutter-movie-app.mdx', 
    tech: '["Flutter", "Dart", "Firebase", "Agora RTC"]' 
  }
];

const langs = ['en', 'vi'];

for (const lang of langs) {
  for (const file of filesToUpdate) {
    const filePath = path.join(__dirname, 'content', lang, 'projects', file.name);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (!content.includes('status:')) {
        content = content.replace(/---\n/, '---\nstatus: "Completed"\ntechStack: ' + file.tech + '\n');
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
      }
    } else {
      console.log('File not found: ' + filePath);
    }
  }
}
