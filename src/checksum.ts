import { calculateAllChecksums } from './calculate';
import { promptFilePath, promptAlgorithms } from './prompt';
import { verifyChecksum } from './verify';
import chalk from 'chalk';

async function main(): Promise<void> {
    const command: string | undefined = process.argv[2];
    let filePath: string | undefined = process.argv[3];
    let algorithms: string[] = process.argv.slice(4);

    if (!filePath) {
        filePath = await promptFilePath();
    }

    if (command === 'generate') {
        if (algorithms.length === 0) {
            algorithms = await promptAlgorithms();
        }
        await calculateAllChecksums(filePath, algorithms);
    } else if (command === 'verify') {
        const checksum: string | undefined = process.argv[4];
        const algorithm: string | undefined = process.argv[5];
        if (!checksum || !algorithm) {
            console.error(`${chalk.red('Error:')} Please provide a checksum and an algorithm for verification.`);
            return;
        }
        await verifyChecksum(filePath, checksum, algorithm);
    } else {
        console.error(`${chalk.red('Error:')} Unknown command. Use 'generate' or 'verify'.`);
    }
}

main();