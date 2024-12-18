/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { promises as fs } from 'fs';
import path from 'path';

// Source and destination directories
const srcDir = path.resolve('src');
const distDir = path.resolve('dist');

async function copyRecursive(src, dest) {
    const stats = await fs.stat(src);

    if (stats.isDirectory()) {
        // Ensure the destination directory exists
        await fs.mkdir(dest, { recursive: true });

        // Read contents of the directory
        const entries = await fs.readdir(src);

        // Recursively copy each entry
        for (const entry of entries) {
            if (entry.includes('__test__') || entry.endsWith('.spec.mjs')) continue;
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);
            console.log(`Copying: ${srcPath} -> ${destPath}`);
            await copyRecursive(srcPath, destPath);
        }
    } else {
        // Copy file
        await fs.copyFile(src, dest);
    }
}

(async () => {
    try {
        // Clean and recreate the dist directory
        await fs.rm(distDir, { recursive: true, force: true });
        await fs.mkdir(distDir, { recursive: true });

        // Copy files and directories from src to dist
        await copyRecursive(srcDir, distDir);

        console.log('Build completed successfully.');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
})();
