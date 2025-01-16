const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Welcome message');

process.stdin.on('data', (data) => {
    const input = data.toString();
    if (input.toLowerCase() === 'exit') {
        console.log('\nThe end');
        process.exit();
    }
    writeStream.write(input);
})

process.on('SIGINT', () => {
    console.log('\nThe end');
    process.exit();
});
