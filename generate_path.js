const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '/blog');

function readDirectory(dir, basePath = '') {
  const result = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const relativePath = path.join(basePath, item.name);
    if (item.isDirectory()) {
      result.push({
        type: 'folder',
        name: item.name,
        path: `tyler-blog-site/blog/${relativePath}`.replace(/\\/g, '/'), // Ensure path format is URL-friendly
        children: readDirectory(path.join(dir, item.name), relativePath)
      });
    } else if (item.name.endsWith('.md')) {
      // Generate a web-accessible path relative to the public directory
      const webPath = `blog/${relativePath}`.replace(/\\/g, '/'); // Ensure path format is URL-friendly
      result.push({
        type: 'file',
        name: item.name,
        path: webPath
      });
    }
  });

  return result;
}

const structure = readDirectory(directoryPath);
fs.writeFileSync('../src/blogStructure.json', JSON.stringify(structure, null, 2));