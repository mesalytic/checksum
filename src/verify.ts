import chalk from 'chalk';
import logger from './logger';

export async function verifyChecksum(_filePath: string, _checksum: string, _algorithm: string) {
    // TODO: verify feature
    logger.error(`${chalk.yellow('Verify functionality is not yet implemented.')}`);
}