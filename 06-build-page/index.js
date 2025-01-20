const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const templateHtml = path.join(__dirname, 'template.html');

const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    copyAssets(assets, outputAssets);
    buildHtml();
    mergeStyles();
});

function copyAssets(src, dest) {
    fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }

        fs.readdir(src, (err, files) => {
            if (err) {
              throw err;
            }

            files.forEach((file) => {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);

                fs.stat(srcPath, (err, stats) => {
                    if (err) {
                      throw err;
                    }

                    if (stats.isDirectory()) {
                        copyAssets(srcPath, destPath);
                    } else {
                        fs.copyFile(srcPath, destPath, (err) => {
                            if (err) {
                              throw err;
                            }
                        });
                    }
                });
            });
        });
    });
}

function buildHtml() {
    fs.readFile(templateHtml, 'utf-8', (err, templateContent) => {
        if (err) {
          throw err;
        }
        let template = templateContent;
        fs.readdir(components, (err, files) => {
            if (err) {
              throw err;
            }
            let count = 0;
            files.forEach((file) => {
                const ext = path.extname(file);
                if (ext === '.html') {
                    const name = path.basename(file, ext);
                    const componentPath = path.join(components, file);
                    fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
                        if (err) {
                          throw err;
                        }

                        template = template.replace(new RegExp(`{{${name}}}`, 'g'), componentContent);
                        count++;

                        if (count === files.length) {
                            fs.writeFile(outputHtml, template, (err) => {
                                if (err) {
                                  throw err;
                                }
                            });
                        }
                    });
                } else {
                    count++;
                }
            });
        });
    });
}

function mergeStyles() {
    fs.readdir(styles, (err, files) => {
        if (err) {
          throw err;
        }

        const writeStream = fs.createWriteStream(outputCss);
        files.forEach((file) => {
            const filePath = path.join(styles, file);
            const extName = path.extname(file);
            if (extName === '.css') {
                const readStream = fs.createReadStream(filePath, 'utf-8');
                readStream.pipe(writeStream, { end: false });
                readStream.on('end', () => writeStream.write('\n'));
            }
        });
    });
}
