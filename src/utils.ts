import fs from 'fs';
import logger from './logger';

export function formatBytes(bytes: number): string {
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.R_OK);
        logger.info(`File path ${filePath} is valid`)
        return true;
    } catch {
        logger.error(`File path ${filePath} is invalid`)
        return false;
    }
}