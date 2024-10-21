import { calculateAllChecksums } from './calculate';
import { promptFilePath, promptAlgorithms } from './prompt';
import { verifyChecksum } from './verify';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileExists } from './utils';
import { loadConfig, Config } from './config';
import logger from './logger';

const availableAlgorithms = ['sha1', 'sha256', 'sha384', 'sha512', 'md5'];

async function main(): Promise<void> {
    const config: Config = await loadConfig();
    const defaultAlgorithms = config.defaultAlgorithms || [];

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
                        default: defaultAlgorithms,
                    });
            },
            async (argv) => {
                let filePath = argv.file as string;
                let algorithms = argv.algorithms as string[];

                if (!filePath) {
                    filePath = await promptFilePath();
                }

                if (!(await fileExists(filePath))) {
                    const errorMessage = `The file "${filePath}" does not exist or is not accessible.`;
                    logger.error(errorMessage);
                    return;
                }

                if (algorithms.length === 0) {
                    algorithms = await promptAlgorithms();
                }

                const invalidAlgorithms = algorithms.filter((alg) => !availableAlgorithms.includes(alg));
                if (invalidAlgorithms.length > 0) {
                    const errorMessage = `Invalid algorithms: ${invalidAlgorithms.join(', ')}. Available algorithms are: ${availableAlgorithms.join(', ')}`;
                    logger.warn(errorMessage);
                    return;
                }

                logger.info(`Generating checksums for file: ${filePath} using algorithms: ${algorithms.join(', ')}`);
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
                    const errorMessage = 'Please provide a file path.';
                    logger.error(errorMessage);
                    return;
                }

                if (!(await fileExists(filePath))) {
                    const errorMessage = `The file "${filePath}" does not exist or is not accessible.`;
                    logger.error(errorMessage);
                    return;
                }

                if (!checksum) {
                    const errorMessage = 'Please provide a checksum.';
                    logger.error(errorMessage);
                    return;
                }

                if (!algorithm) {
                    const errorMessage = 'Please provide an algorithm.';
                    logger.error(errorMessage);
                    return;
                }

                if (!availableAlgorithms.includes(algorithm)) {
                    const errorMessage = `Invalid algorithm: ${algorithm}. Available algorithms are: ${availableAlgorithms.join(', ')}`;
                    logger.error(errorMessage);
                    return;
                }

                logger.info(`Verifying checksum for file: ${filePath} using algorithm: ${algorithm}`);
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