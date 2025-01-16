const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.log('error', err);
    }
    files.forEach((file) => {
        if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log('error', err);
                }
                const extName = path.extname(file.name);
                const baseName = path.basename(file.name, extName);
                console.log(`${baseName} - ${extName.slice(1)} - ${stats.size}`);
            })
        }
    })
});
