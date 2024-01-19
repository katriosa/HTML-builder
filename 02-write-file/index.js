const path = require("path");
const fs = require("fs");
const filePath = path.join(__dirname, "text.txt");

// Создаем интерфейс для чтения из консоли
const readline = require('readline');
let rl = readline.createInterface(
  process.stdin, process.stdout);

// Создаем пустой файл
fs.writeFile(filePath, '', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  
let isFirstTime = true;

const writeToFile = () => {
  if (isFirstTime) {
    console.log('Please type text:');
    isFirstTime = false;
  }

  rl.question('', (inputText) => {
    if (inputText.toLowerCase() === 'exit') {
      // Закрываем интерфейс чтения из консоли
      console.log('Bye\n');
      rl.close();
    } else {

   // Добавляем введенный текст в файл
      fs.appendFile(filePath, inputText + '\n', (err) => {
        if (err) {
          console.log(err);
        } else {
          writeToFile();
        }
      });
    }
  });
};

writeToFile();
});

// Обработка события (Ctrl+C)
rl.on('close', () => {
  console.log('Bye\n');
  process.exit(0);
});
