import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import {
  videoCreateInputDtoValidation,
  videoUpdateInputDtoValidation,
} from '../validation/videoInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Video } from '../types/video';
import {
  VideoCreateInputDto,
  VideoUpdateInputDto,
} from '../dto/video-input.dto';
import { HttpStatus } from '../../core/types/http-statuses';

/*Создаем роутер из Express для работы с данными по видео.*/
export const videosRouter = Router({});

/*Конфигурируем роутер "videosRouter".*/
videosRouter
  /*GET-запрос для получения данных по всем видео.*/
  .get('', (req: Request, res: Response<Video[]>) => {
    res.status(HttpStatus.Ok).send(db.videos);
  })

  /*GET-запрос для поиска видео по id при помощи URI-параметров.*/
  .get(
    '/:id',
    (
      req: Request<{ id: string }, Video, {}, {}>,
      res: Response<Video | null | unknown>,
    ) => {
      /*Ищем видео в БД.*/
      const id = parseInt(req.params.id);
      const video = db.videos.find((v) => v.id === id);

      /*Если видео не было найдено, то сообщаем об этом клиенту.*/
      if (!video) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
          );

        return;
      }

      /*Если видео было найдено, то сообщаем об этом клиенту.*/
      res.status(HttpStatus.Ok).send(video);
    },
  )

  /*POST-запрос для добавления нового видео.*/
  .post('', (req: Request<{}, {}, VideoCreateInputDto>, res: Response) => {
    /*Проводим валидацию DTO для входных данных по новому видео.*/
    const errors = videoCreateInputDtoValidation(req.body);

    /*Если были ошибки валидации, то сообщаем об этом клиенту.*/
    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    /*Если ошибок валидации не было, то создаем объект с данными нового видео.*/
    const newVideo: Video = {
      /*Генерация случайного id.*/
      id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 864e5).toISOString(),
      availableResolutions: req.body.availableResolutions,
    };

    /*Добавляем новое видео в БД и сообщаем об этом клиенту.*/
    db.videos.push(newVideo);
    res.status(HttpStatus.Created).send(newVideo);
  })

  /*PUT-запрос для изменения данных видео по id при помощи URI-параметров.*/
  .put(
    '/:id',
    (
      req: Request<{ id: string }, {}, VideoUpdateInputDto, {}>,
      res: Response,
    ) => {
      /*Ищем видео в БД.*/
      const id = parseInt(req.params.id);
      const index = db.videos.findIndex((v) => v.id === id);

      /*Если видео не было найдено, то сообщаем об этом клиенту.*/
      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
          );

        return;
      }

      /*Если видео было найдено, то проводим валидацию DTO для входных данных для видео, которое нужно изменить.*/
      const errors = videoUpdateInputDtoValidation(
        req.body,
        Number(req.params.id),
      );

      /*Если были ошибки валидации, то сообщаем об этом клиенту.*/
      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      /*Если ошибок валидации не было, то обновляем данные видео в БД и сообщаем об этом клиенту.*/
      const video = db.videos[index];
      video.title = req.body.title;
      video.author = req.body.author;
      video.availableResolutions = req.body.availableResolutions;
      video.canBeDownloaded = req.body.canBeDownloaded;
      video.minAgeRestriction = req.body.minAgeRestriction;
      video.publicationDate = req.body.publicationDate;
      res.sendStatus(HttpStatus.NoContent);
    },
  )

  /*DELETE-запрос для удаления видео по id при помощи URI-параметров.*/
  .delete('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    /*Ищем видео в БД.*/
    const id = parseInt(req.params.id);
    const index = db.videos.findIndex((v) => v.id === id);

    /*Если видео не было найдено, то сообщаем об этом клиенту.*/
    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );

      return;
    }

    /*Если видео было найдено, то удаляем его из БД и сообщаем об этом клиенту.*/
    db.videos.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
