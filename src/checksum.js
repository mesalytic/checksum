import { calculateAllChecksums } from './calculate.js';
import { promptFilePath, promptAlgorithms } from './prompt.js';
import { verifyChecksum } from './verify.js';
import chalk from 'chalk';

async function main() {
    const command = process.argv[2];
    let filePath = process.argv[3];
    let algorithms = process.argv.slice(4);

    if (!filePath) {
        filePath = await promptFilePath();
    }

    if (command === 'generate') {
        if (algorithms.length === 0) {
            algorithms = await promptAlgorithms();
        }
        calculateAllChecksums(filePath, algorithms);
    } else if (command === 'verify') {
        const checksum = process.argv[4];
        const algorithm = process.argv[5];
        if (!checksum || !algorithm) {
            console.error(`${chalk.red('Error:')} Please provide a checksum and an algorithm for verification.`);
            return;
        }
        verifyChecksum(filePath, checksum, algorithm);
    } else {
        console.error(`${chalk.red('Error:')} Unknown command. Use 'generate' or 'verify'.`);
    }
}

main();