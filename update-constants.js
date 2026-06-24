const fs = require('fs');
let content = fs.readFileSync('src/lib/constants.ts', 'utf8');

// Update type
content = content.replace(/category: string\n/g, 'category: string\n  categories: string[]\n');

// Update objects
content = content.replace(/category: '([^']+)',/g, (match, p1) => {
  return `category: '${p1}', categories: ['${p1}'],`;
});

fs.writeFileSync('src/lib/constants.ts', content);
console.log('constants updated');
