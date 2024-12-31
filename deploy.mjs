/*
 * Copyright (c) 2024. curryfirm.com
 */

import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

const packageJsonDir = path.resolve('.');
const distDir = path.resolve('dist');
const targetDir = '~/deployments/receipt-report-parser';

(async () => {
    try {
        await execAsync(`mkdir -p ${targetDir}`);
        await execAsync(`cp ${packageJsonDir}/package.json ${targetDir}`);
        await execAsync(`cp -R ${distDir} ${targetDir}`);
        console.log(`Deployed successfully to ${targetDir}`);
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
})();
