const fs = require('fs');
const sharp = require('sharp');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const inputFolder = './input/';
const outputFolder = './output/';

if (!fs.existsSync(inputFolder)) {
  fs.mkdirSync(inputFolder);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

rl.question('Enter how many times you want the images to be downscaled (e.g., 2 for half resolution): ', (percentage) => {
  const scaleFactor = parseFloat(percentage);

  if (isNaN(scaleFactor) || scaleFactor <= 0) {
    console.log('Invalid input. Please enter a positive number for downsizing.');
    rl.close();
    return;
  }

  // Create the output folder if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  fs.readdir(inputFolder, (err, files) => {
    if (err) {
      console.error('Error reading the input folder:', err);
      rl.close();
      return;
    }

    files.forEach((file) => {
      const inputFile = inputFolder + file;
      const outputFile = outputFolder + file;

      sharp(inputFile)
        .metadata()
        .then((metadata) => {
          const newWidth = Math.round(metadata.width / scaleFactor);
          const newHeight = Math.round(metadata.height / scaleFactor);

          sharp(inputFile)
            .resize(newWidth, newHeight)
            .toFile(outputFile, (err) => {
              if (err) {
                console.error(`Error processing ${file}: ${err}`);
              } else {
                console.log(`Processed ${file}`);
              }
            });
        })
        .catch((error) => {
          console.error(`Error reading metadata for ${file}: ${error}`);
        });
    });

    console.log('Image processing complete.');
    rl.close();
  });
});
