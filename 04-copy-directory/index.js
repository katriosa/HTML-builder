const copyFiles = () => {
  const fs = require('fs');
  const path = require('path');
  const originFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');
  
  // создаем папку
  fs.mkdir(copyFolderPath, { recursive: true },
    (err) => {
      if (err) {
      return console.log(err);
      }
    })

  // очищаем папку files-copy, если она не пустая
  fs.readdir(copyFolderPath, (err, files) => {
    if (err)
      console.log(err);
    else {
      if (files.length > 0) {
        files.forEach(file => {

          const filePath = path.join(copyFolderPath, file);
          fs.unlink(filePath, err => {
            if (err) console.log(err);
          });
        })
      }
    }
  })

  // читаем каталог
  fs.readdir(originFolderPath, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {  
        const originFilePath = path.join(originFolderPath, file);
        const copyFilePath = path.join(copyFolderPath, file);
        // копируем файлы
        fs.copyFile(originFilePath, copyFilePath, (err) => {
          if (err) {
            console.log(err);
          }
          // else {
          //   console.log(`${file} copied successfully!`);
          // }
        })
      })
    }
  })
  console.log('Files copied!');
}
copyFiles();

