import express from 'express';
import { setupApp } from './setup-app';

/*Создаем экземпляр приложения Express.*/
const app = express();
/*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
setupApp(app);
/*Указываем порт для экземпляра приложения Express.*/
const PORT = process.env.PORT || 5001;
/*Запускаем экземпляр приложения Express.*/
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
