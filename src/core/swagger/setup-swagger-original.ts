import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { rootPath } from '../../setup-app';

/*Создаем объект, описывающий опции документации Swagger.*/
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Uber API',
      version: '1.0.0',
      description: 'uber API',
    },
  },

  /*Указываем откуда брать документацию для Swagger. В данном случае все файлы .yml в папке "src".*/
  apis: ['./src/**/*.swagger.yml'],
};

/*Генерируем документацию API в формате Swagger.*/
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/*Создаем функцию "setupSwagger()" для инициализации документации Swagger.*/
export const setupSwagger = (app: Express) => {
  app.use(rootPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
