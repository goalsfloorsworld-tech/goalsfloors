const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), 'src/data/products');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directoryPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            try {
                const json = JSON.parse(data);
                if (json.afterInstallation) {
                    delete json.afterInstallation;
                    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                    console.log(`Removed afterInstallation from ${file}`);
                }
            } catch (e) {
                console.error(`Error parsing ${file}:`, e);
            }
        }
    });
});
