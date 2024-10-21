import { cosmiconfig } from 'cosmiconfig';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const explorer = cosmiconfig('checksumjs');

export interface Config {
    defaultAlgorithms?: string[];
}

export async function loadConfig(): Promise<Config> {
    let config: Config = {};

    try {
        const result = await explorer.search();
        if (result && result.config) {
            console.log('Configuration loaded:', result.config);
            config = result.config as Config;
        } else {
            console.log('No configuration file found. Looking for environment variables...');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`${chalk.red('Error loading configuration:')} ${error.message}`);
        } else {
            console.error(`${chalk.red('Error loading configuration:')} ${String(error)}`);
        }
    }

    if (process.env.DEFAULT_ALGORITHMS) {
        config.defaultAlgorithms = process.env.DEFAULT_ALGORITHMS.split(',');
    }

    return config;
}