import fs from 'fs';
import path from 'path';

const oldPath = path.join(import.meta.dirname, '..', 'dist', 'electron', 'main.js');
const newPath = path.join(import.meta.dirname, '..', 'dist', 'electron', 'main.cjs');

fs.renameSync(oldPath, newPath);
