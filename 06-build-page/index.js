const fs = require('fs');
const path = require("path");
const newFolderPath = path.join(__dirname, "project-dist");
const newIndexPath = path.join(__dirname, "project-dist", "index.html");
const templateFilePath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");


// создаем папку
fs.mkdir(newFolderPath, { recursive: true },
  (err) => {
    if (err) {
    return console.log('Create folder', err);
    }
  })

// Заменяем теги на компоненты
const changeData = (templateData, filesArr) => {
  let modifiedData = templateData;
  for (const obj of filesArr) {
    const tag = `{{${obj.name}}}`;
    const component = `${obj.data}`
    modifiedData = modifiedData.replace(tag, component);
  }
   return modifiedData
}


// наполняем index.html
const createIndexFile = async (filesArr) => {
  try {
    // читаем содержимое template.html
    const templateData = await fs.promises.readFile(templateFilePath, 'utf-8');

    // заменяем теги на компоненты
    const modifiedData = changeData(templateData, filesArr)
    
    // записываем в Index
    await fs.promises.writeFile(newIndexPath, modifiedData);

  } catch (error) {
    console.error('readTemplateFile', error);
  }
}


// Читаем компоненты
const readComponents = async () => {
  try {
    const filesArr = [];
    const files = await fs.promises.readdir(componentsPath)
    for (const file of files) {
      const filePath = path.join(componentsPath, file);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const obj = {
        name: file.split('.')[0],
        data: data
      }
      filesArr.push(obj)
     }
     createIndexFile(filesArr);
    
  } catch (err) {
    console.log('readComponents', err);
  }
}
readComponents();


// копируем assets
const originAssetsPath = path.join(__dirname, "assets");
const copyAssetsPath = path.join(__dirname,"project-dist", "assets");

const copyAssets = async (originPath, copyPath) => {
  try {
    // создаем новую папку-копию
    await fs.promises.mkdir(copyPath, { recursive: true });

    // читаем содержимое
    const files = await fs.promises.readdir(originPath);
    for (const file of files) {
      const originFilePath = path.join(originPath, file);
      const copyFilePath = path.join(copyPath, file);
      
      const stats = await fs.promises.stat(originFilePath);
      if (stats.isDirectory()) {
        await copyAssets(originFilePath, copyFilePath);
      } else {
        await fs.promises.copyFile(originFilePath, copyFilePath);
      }
    }
  } catch (err) {
    console.log('copyAssets', err);
  }
 }
copyAssets(originAssetsPath, copyAssetsPath);


// добавляем стили
const originStylesPath = path.join(__dirname, "styles");
const newStylesPath = path.join(__dirname, "project-dist", "style.css");


// Проверяем существует ли bundle
const checkExistBundle = async () => {
  try {
    await fs.promises.access(newStylesPath, fs.constants.F_OK);
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
      const rewritableStream = fs.createWriteStream(newStylesPath, { flags: 'w' });
      rewritableStream.write('');
      rewritableStream.end();   
    };

    // нужно создать
    const writableStream = fs.createWriteStream(newStylesPath, { flags: 'a' });
    writableStream.write(chunk + '\n');
    writableStream.end();   
    
  } catch (err) {
   console.log('writeInFile', err);
  }
};


// Читаем папку styles
const readStyles = async () => {
  try {
    const files = await fs.promises.readdir(originStylesPath, {
      withFileTypes: true
    });
    // Проверяем нужно создать или перезаписать bundle
    let rewriteBundle = await checkExistBundle();

    for (const file of files) {
      
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(originStylesPath, file.name);
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