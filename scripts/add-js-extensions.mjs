import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directory = path.join(__dirname, '../dist');

function addJsExtensions(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      addJsExtensions(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/(from\s+['"])(\.\/[^'"]+)(['"])/g, '$1$2.js$3');
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

addJsExtensions(directory);