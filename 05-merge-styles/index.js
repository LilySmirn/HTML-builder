const fs = require('fs');
const path = require('path');
const styles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const addStyles = path.join(projectDist, 'bundle.css');

fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }
});

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
    if (err) {
        throw err;
    }

    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');
    let tempArray = [];

    cssFiles.forEach((file, index) => {
        const filePath = path.join(styles, file.name);
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }

            tempArray.push(data);

            if (tempArray.length === cssFiles.length) {
                fs.writeFile(addStyles, tempArray.join('\n'), (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
    });
});
