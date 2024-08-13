import fs from 'fs';

function loadEnvFile(filePath) {
    if (fs.existsSync(filePath)) {
        const envFile = fs.readFileSync(filePath, 'utf8');

        const envVars = envFile.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=');
            let trimVal = value;
            if (value) trimVal = value.trim();
            acc[key] = trimVal;
            return acc;
        }, {});

        return envVars;
    } else {
        console.error(`.env file not found at ${filePath}`);
        return {};
    }
}

export default loadEnvFile;
