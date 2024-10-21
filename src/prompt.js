import readline from 'readline';
import inquirer from 'inquirer';

export function promptFilePath() {
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

export function promptAlgorithms() {
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