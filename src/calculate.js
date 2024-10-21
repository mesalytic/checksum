import crypto from 'crypto';
import fs from 'fs';
import progress from 'progress-stream';
import chalk from 'chalk';
import { updateProgress } from './progress.js';

function calculateChecksum(filePath, algorithm, progressArray, progressPercentages, index) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const fileSize = fs.statSync(filePath).size;
        const progressStream = progress({
            length: fileSize,
            time: 30 // in ms
        });

        progressStream.on('progress', (progress) => {
            progressPercentages[index] = progress.percentage;
            progressArray[index] = `${chalk.blue(algorithm.toUpperCase())} Progress: ${chalk.green((progress.percentage).toFixed(2))}%`;
            updateProgress(progressArray, progressPercentages, fileSize, filePath);
        });

        const stream = fs.createReadStream(filePath);

        stream.pipe(progressStream).on('data', (data) => {
            hash.update(data);
        });

        stream.on('end', () => {
            const hashValue = hash.digest('hex');
            progressArray[index] = `${chalk.blue(algorithm.toUpperCase())}: ${chalk.green(hashValue)}`;
            progressPercentages[index] = 100;
            updateProgress(progressArray, progressPercentages, fileSize, filePath);
            resolve(hashValue);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

export async function calculateAllChecksums(filePath, algorithms) {
    try {
        const progressArray = algorithms.map((algorithm) => `${chalk.blue(algorithm.toUpperCase())} Progress: ${chalk.yellow('Queued')}`);
        const progressPercentages = new Array(algorithms.length).fill(0);
        const fileSize = fs.statSync(filePath).size;

        // Hide the cursor
        process.stdout.write('\x1B[?25l');

        const results = [];
        for (let i = 0; i < algorithms.length; i++) {
            const result = await calculateChecksum(filePath, algorithms[i], progressArray, progressPercentages, i);
            results.push(result);
        }

        // Show the cursor
        process.stdout.write('\x1B[?25h');

        updateProgress(progressArray, progressPercentages, fileSize, filePath);
    } catch (error) {
        console.error(`${chalk.red('Error calculating checksums:')} ${error.message}`);
    }
}