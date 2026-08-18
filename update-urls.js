const fs = require('fs');
const path = require('path');

const updates = [
  { 
    name: 'personal-universe.mdx', 
    url: 'https://github.com/Tiat-Den/Blog' 
  },
  { 
    name: 'aspnet-web-store.mdx', 
    url: 'https://github.com/Tiat-Den/Project_Asp_net_Mvc' 
  },
  { 
    name: 'flutter-movie-app.mdx', 
    url: 'https://github.com/Tiat-Den/movie_app' 
  }
];

const langs = ['en', 'vi'];

for (const lang of langs) {
  for (const file of updates) {
    const filePath = path.join(__dirname, 'content', lang, 'projects', file.name);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any existing empty githubUrl or repoUrl
      content = content.replace(/^githubUrl:.*$\n/m, '');
      content = content.replace(/^repoUrl:.*$\n/m, '');
      
      // Insert repoUrl right after date
      content = content.replace(/(date:.*$)/m, '$1\nrepoUrl: "' + file.url + '"');
      
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
}
