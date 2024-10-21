import readline from 'readline';
import chalk from 'chalk';
import { formatBytes } from './utils.js';

export function updateProgress(progressArray, progressPercentages, fileSize, filePath) {
    const totalProgress = progressPercentages.reduce((acc, percentage) => acc + percentage, 0) / progressPercentages.length;

    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log(`${chalk.bold('File:')} ${chalk.cyan(filePath)}`);
    console.log(`${chalk.bold('Size:')} ${chalk.cyan(formatBytes(fileSize))} | ${chalk.cyan(fileSize)} bytes\n`);
    progressArray.forEach((line, index) => {
        readline.cursorTo(process.stdout, 0, 3 + index);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(line);
    });
    readline.cursorTo(process.stdout, 0, 3 + progressArray.length);
    readline.clearLine(process.stdout, 0);
    console.log(`\n${chalk.bold('Total Progress:')} ${chalk.green(totalProgress.toFixed(2))}%`);
}