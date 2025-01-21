import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findTsFiles(dir, files = []) {
    const entries = readdirSync(dir);

    entries.forEach(entry => {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            findTsFiles(fullPath, files);
        } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.spec.ts')) {
            const relativePath = relative('src/lib', fullPath);
            const importPath = `./${relativePath.replace('.ts', '')}`;
            files.push(importPath);
        }
    });

    return files;
}

// Remonter d'un niveau depuis le dossier scripts
const srcPath = join(dirname(__dirname), 'src/lib');
const tsFiles = findTsFiles(srcPath);
const exports = tsFiles.map(file => {
    return `export * from '${file}';`;
}).join('\n');

writeFileSync(join(srcPath, 'index.ts'), exports);