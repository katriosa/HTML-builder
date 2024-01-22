const copyFiles = async () => {
  const fs = require('fs');
  const path = require('path');
  const originFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');
  
  try {
    // создаем папку
    await fs.promises.mkdir(copyFolderPath, { recursive: true });

    // очищаем папку files-copy, если она не пустая
    const files = await fs.promises.readdir(copyFolderPath);
    if (files.length > 0) {
      for (const file of files) {
        const filePath = path.join(copyFolderPath, file);
        await fs.promises.unlink(filePath)
      }
    }
      // читаем каталог
      const originFiles = await fs.promises.readdir(originFolderPath);
      for (const file of originFiles) {
        const originFilePath = path.join(originFolderPath, file);
        const copyFilePath = path.join(copyFolderPath, file);
        
        // копируем файлы
        await fs.promises.copyFile(originFilePath, copyFilePath);
      }
    console.log('Files copied!');
  } catch (err) {
    console.log('copyFiles', err);
  }
}
copyFiles();

