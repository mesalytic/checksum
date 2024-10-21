import crypto from 'crypto';
import fs from 'fs';
import progress from 'progress-stream';
import readline from 'readline';
import chalk from 'chalk';
import inquirer from 'inquirer';
import stripAnsi from 'strip-ansi';

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

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

function updateProgress(progressArray, progressPercentages, fileSize, filePath) {
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

async function calculateAllChecksums(filePath, algorithms) {
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

function promptFilePath() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Please enter the file path: ', (filePath) => {
            rl.close();
            resolve(filePath);
        });
    });
}

function promptAlgorithms() {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'algorithms',
            message: 'Select the algorithms to use:',
            choices: ['sha1', 'sha256', 'sha384', 'sha512', 'md5'],
            validate: (answer) => {
                if (answer.length < 1) {
                    return 'You must choose at least one algorithm.';
                }
                return true;
            }
        }
    ]).then((answers) => answers.algorithms);
}

async function main() {
    let filePath = process.argv[2];
    let algorithms = process.argv.slice(3);

    if (!filePath) {
        filePath = await promptFilePath();
    }

    if (algorithms.length === 0) {
        algorithms = await promptAlgorithms();
    }

    calculateAllChecksums(filePath, algorithms);
}

main();