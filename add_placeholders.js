const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

content = content.replace(/img: '(.*?)',(\s*)(?!images:)/g, "img: '$1',$2images: [\n                    '$1',\n                    'assets/placeholder1.jpg',\n                    'assets/placeholder2.jpg'\n                ],$2");

fs.writeFileSync('script.js', content);
console.log('Added placeholders');
