import express, { Express, Request, Response } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';
import { HttpStatus } from './core/types/http-statuses';
import { setupSwagger } from './core/swagger/setup-swagger';

export const rootPath = '/hometask_01/api';

/*Создаем функцию "setupApp()" для конфигурирования экземпляров приложения Express.*/
export const setupApp = (app: Express) => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());

  /*GET-запрос для получения главной страницы.*/
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello World!');
  });

  /*Подключаем роутеры.*/
  app.use(`${rootPath}/videos`, videosRouter);
  app.use(`${rootPath}/testing`, testingRouter);

  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
