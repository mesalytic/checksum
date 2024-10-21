import { calculateAllChecksums } from './calculate';
import { promptFilePath, promptAlgorithms } from './prompt';
import { verifyChecksum } from './verify';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileExists } from './utils';

const availableAlgorithms = ['sha1', 'sha256', 'sha384', 'sha512', 'md5'];

async function main(): Promise<void> {
    yargs(hideBin(process.argv))
        .wrap(null) // Disable wrapping
        .command(
            'generate [file] [algorithms..]',
            'Generate checksums for a file',
            (yargs) => {
                yargs
                    .positional('file', {
                        describe: 'Path to the file',
                        type: 'string',
                    })
                    .positional('algorithms', {
                        describe: 'List of algorithms',
                        type: 'string',
                        array: true,
                        choices: availableAlgorithms,
                    });
            },
            async (argv) => {
                let filePath = argv.file as string;
                let algorithms = argv.algorithms as string[];

                if (!filePath) {
                    filePath = await promptFilePath();
                }

                if (!(await fileExists(filePath))) {
                    console.error(`${chalk.red('Error:')} The file "${filePath}" does not exist or is not accessible.`);
                    return;
                }

                if (algorithms.length === 0) {
                    algorithms = await promptAlgorithms();
                }

                const invalidAlgorithms = algorithms.filter((alg) => !availableAlgorithms.includes(alg));
                if (invalidAlgorithms.length > 0) {
                    console.error(`${chalk.red('Error:')} Invalid algorithms: ${invalidAlgorithms.join(', ')}. Available algorithms are: ${availableAlgorithms.join(', ')}`);
                    return;
                }

                await calculateAllChecksums(filePath, algorithms);
            }
        )
        .command(
            'verify [file] [checksum] [algorithm]',
            'Verify a checksum for a file',
            (yargs) => {
                yargs
                    .positional('file', {
                        describe: 'Path to the file',
                        type: 'string',
                    })
                    .positional('checksum', {
                        describe: 'Checksum to verify',
                        type: 'string',
                    })
                    .positional('algorithm', {
                        describe: 'Algorithm used for checksum',
                        type: 'string',
                        choices: availableAlgorithms,
                    });
            },
            async (argv) => {
                const filePath = argv.file as string;
                const checksum = argv.checksum as string;
                const algorithm = argv.algorithm as string;

                if (!filePath) {
                    console.error(`${chalk.red('Error:')} Please provide a file path.`);
                    return;
                }

                if (!(await fileExists(filePath))) {
                    console.error(`${chalk.red('Error:')} The file "${filePath}" does not exist or is not accessible.`);
                    return;
                }

                if (!checksum) {
                    console.error(`${chalk.red('Error:')} Please provide a checksum.`);
                    return;
                }

                if (!algorithm) {
                    console.error(`${chalk.red('Error:')} Please provide an algorithm.`);
                    return;
                }

                if (!availableAlgorithms.includes(algorithm)) {
                    console.error(`${chalk.red('Error:')} Invalid algorithm: ${algorithm}. Available algorithms are: ${availableAlgorithms.join(', ')}`);
                    return;
                }

                await verifyChecksum(filePath, checksum, algorithm);
            }
        )
        .demandCommand(1, `${chalk.red('Error:')} Unknown command. Use 'generate' or 'verify'.`)
        .help()
        .alias('help', 'h')
        .alias('version', 'v')
        .epilogue(`Available algorithms: ${availableAlgorithms.join(', ')}`)
        .argv;
}

main();