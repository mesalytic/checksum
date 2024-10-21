import { cosmiconfig } from 'cosmiconfig';
import dotenv from 'dotenv';
import logger from './logger';

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
            logger.info(`Configuration loaded: ${JSON.stringify(result.config)}`);
            config = result.config as Config;
        } else {
            logger.warn('No configuration file found. Looking for environment variables...');
        }
    } catch (error) {
        let errorMessage: string;

        if (error instanceof Error) {
            errorMessage = `Error loading configuration: ${error.message}`;
        } else {
            errorMessage = `Error loading configuration: ${String(error)}`;
        }

        logger.error(errorMessage);
    }

    if (process.env.DEFAULT_ALGORITHMS) {
        config.defaultAlgorithms = process.env.DEFAULT_ALGORITHMS.split(',');
        logger.info(`Loaded configuration from environment variables: ${config.defaultAlgorithms.join(', ')}`);
    }

    return config;
}