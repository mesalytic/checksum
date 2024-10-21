import readline from 'readline';
import { checkbox } from '@inquirer/prompts';
import logger from './logger';

export function promptFilePath(): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Please enter the file path: ', (filePath: string) => {
            rl.close();
            logger.info(`User entered file path: ${filePath}`);
            resolve(filePath);
        });
    });
}

export async function promptAlgorithms(): Promise<string[]> {
    const questions: string[] = await checkbox({
        message: 'Select the algorithms to use:',
        choices: ['sha1', 'sha256', 'sha384', 'sha512', 'md5'],
        validate(choices) {
            if (choices.length < 1) {
                const errorMessage = 'You must choose at least one algorithm.';
                logger.warn(errorMessage);
                return errorMessage;
            }
            return true;
        },
    });

    logger.info(`User selected algorithms: ${questions.join(', ')}`);
    return questions;
}