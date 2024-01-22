const fs = require('fs');
const path = require("path");
const dirPath = path.join(__dirname, "secret-folder");
  
// Читаем каталог
fs.readdir(dirPath, { withFileTypes: true }, (err, files) => { 
  if (err) 
    console.log(err); 
  else { 
    files.forEach(file => { 
      if (file.isFile()) {
        const fileName = path.parse(file.name).name
        const fileExtname = (path.extname(file.name)).slice(1);
        const filePath = path.join(__dirname, "secret-folder", file.name);
 
        //определяем размер файлов
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          const fileSize = `${stats.size} bytes`
          console.log(`${fileName} - ${fileExtname} - ${fileSize}`);
        });
      }
    }) 
  } 
}) 