const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

(async function () {
    try {
        const { uriChoice } = await inquirer.prompt([{
            type: 'list',
            name: 'uriChoice',
            message: 'Select Mongo connection string:',
            choices: ['example', 'custom'],
        }]);

        const { mongoUri } = await inquirer.prompt([{
            type: 'input',
            name: 'mongoUri',
            message: 'Enter Mongo URI:',
            when: () => uriChoice === 'custom',
            default: 'mongodb://localhost:27017/BG_STATS_WEB'
        }]);

        const finalUri = uriChoice === 'example'
            ? 'mongodb://localhost:27017/BG_STATS_WEB'
            : mongoUri;

        const { portChoice } = await inquirer.prompt([{
            type: 'list',
            name: 'portChoice',
            message: 'Select port for application:',
            choices: ['4200', '3000', 'custom'],
        }]);

        const { customPort } = await inquirer.prompt([{
            type: 'input',
            name: 'customPort',
            message: 'Enter custom port:',
            when: () => portChoice === 'custom',
            default: '4242',
            validate: input => {
                const num = parseInt(input, 10);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid port number';
            }
        }]);

        const finalPort = portChoice === 'custom' ? customPort : portChoice;

        // .env
        const envContent = `MONGO_URI=${finalUri}\n`;
        fs.writeFileSync(path.resolve(process.cwd(), '.env'), envContent);
        console.log('.env file created');

        //settings.json
        const settings = { port: parseInt(finalPort, 10) };
        fs.writeFileSync(
            path.resolve(process.cwd(), 'settings.json'),
            JSON.stringify(settings, null, 2)
        );
        console.log('settings.json file created');

    } catch (err) {
        console.error('Error during setup:', err);
        process.exit(1);
    }
})();
