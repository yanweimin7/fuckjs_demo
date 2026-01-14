const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, 'src/large_data.ts');
const numStrings = 14; // 14 * 0.5MB = 7MB
const stringSize = 1024 * 512; // 0.5MB
const chunk = 'A'.repeat(stringSize);

let fileContent = `/**
 * Auto-generated large data file to increase bundle size.
 */
`;

for (let i = 0; i < numStrings; i++) {
    fileContent += `export const DATA_${i} = ${JSON.stringify(chunk)};\n`;
}

fileContent += `\nexport const ALL_DATA = [\n`;
for (let i = 0; i < numStrings; i++) {
    fileContent += `  DATA_${i},\n`;
}
fileContent += `];\n`;

fs.writeFileSync(targetFile, fileContent);
console.log(`Generated ${targetFile} with ${numStrings} strings of ${stringSize} bytes each.`);
