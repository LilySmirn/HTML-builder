const fs = require('fs');
const path = require('path');

function copyDir() {
    const firstDir = path.join(__dirname, 'files');
    const copyDir = path.join(__dirname, 'files-copy');

    fs.rm(copyDir, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Error', err);
            return;
        }

        fs.mkdir(copyDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error', err);
                return;
            }

            fs.readdir(firstDir, (err, files) => {
                if (err) {
                    console.error('Error', err);
                    return;
                }

                files.forEach((file) => {
                    const firstFile = path.join(firstDir, file);
                    const copyFile = path.join(copyDir, file);

                    fs.stat(firstFile, (err, stats) => {
                        if (err) {
                            console.error('Error', err);
                            return;
                        }
                        if (stats.isFile()) {
                            fs.copyFile(firstFile, copyFile, (err) => {
                                if (err) {
                                    console.error('Error', err);
                                }
                            });
                        }
                    });
                });
            });
        });
    });
}

copyDir();
