const fs = require('fs');
const path = require("path");
const originFolderPath = path.join(__dirname, "styles");
const newFilePath = path.join(__dirname, "project-dist", "bundle.css");


// Проверяем существует ли bundle
const checkExistBundle = async () => {
  try {
    await fs.promises.access(newFilePath, fs.constants.F_OK);
    // Файл существует, нужно перезаписывать
    return true;
  } catch (err) {
    // Файл не существует, нужно создать
    return false;
  }
};


// Записываем bundle
const writeInFile = async (chunk, rewriteBundle) => {
  try {
    if (rewriteBundle) {
      // нужно перезаписать
      const rewritableStream = fs.createWriteStream(newFilePath, { flags: 'w' });
      rewritableStream.write('');
      rewritableStream.end();   
    };

    // нужно создать
    const writableStream = fs.createWriteStream(newFilePath, { flags: 'a' });
    writableStream.write(chunk + '\n');
    writableStream.end();   
    
  } catch (err) {
   console.log('writeInFile', err);
  }
};


// Читаем папку styles
const readStyles = async () => {
  try {
    const files = await fs.promises.readdir(originFolderPath, {
      withFileTypes: true
    });
    // Проверяем нужно создать или перезаписать bundle
    let rewriteBundle = await checkExistBundle();

    for (const file of files) {
      
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(originFolderPath, file.name);
        const readableStream = fs.createReadStream(filePath, "utf-8");
        readableStream.on("data", (chunk) => {
          writeInFile(chunk, rewriteBundle)
          if (rewriteBundle) {
            rewriteBundle = false;
          }
        });
 
        readableStream.on("error", (err) => console.log(err.message));
      }
    }
  } catch(err) {
    console.log('readStyles', err);
  } 
};
readStyles();
  


