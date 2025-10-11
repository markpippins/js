
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distElectronPath = resolve(__dirname, '..', 'dist', 'electron');

fs.ensureDir(distElectronPath)
  .then(() => {
    console.log('Successfully created dist/electron directory');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
