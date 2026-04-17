import express from 'express';
import request from 'supertest';
import { rootPath, setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VideoCreateInputDto, VideoUpdateInputDto } from '../../../src/videos/dto/video-input.dto';
import { availableResolution } from '../../../src/videos/types/video';

/*Описываем тестовый набор.*/
describe('Videos API', () => {
  /*Создание экземпляра приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);

  /*Подготавливаем тестовые данные.*/
  const testCreateVideoData: VideoCreateInputDto = {
    title: 'Video Title 001',
    author: 'John',
    availableResolutions: [availableResolution.P1440],
  };

  /*Перед запуском тестов, очищаем БД с данными по видео.*/
  beforeAll(async () => await request(app).delete(`${rootPath}/testing/all-data`).expect(HttpStatus.NoContent));

  /*Описываем тест, проверяющий добавление нового видео в БД.*/
  it('should create a video; POST /hometask_01/api/videos', async () => {
    const newVideo: VideoCreateInputDto = {
      ...testCreateVideoData,
      title: 'Video Title 002',
    };

    await request(app).post(`${rootPath}/videos`).send(newVideo).expect(HttpStatus.Created);
  });

  /*Описываем тест, проверяющий получение данных по всем видео из БД.*/
  it('should return a list of videos; GET /hometask_01/api/videos', async () => {
    await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...testCreateVideoData, title: 'Video Title 003' })
      .expect(HttpStatus.Created);

    await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...testCreateVideoData, title: 'Video Title 004' })
      .expect(HttpStatus.Created);

    const videosListResponse = await request(app).get(`${rootPath}/videos`).expect(HttpStatus.Ok);
    expect(videosListResponse.body).toBeInstanceOf(Array);
    expect(videosListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  /*Описываем тест, проверяющий получение данных по видео по ID из БД.*/
  it('should return a video by id; GET /hometask_01/api/videos/:id', async () => {
    const createResponse = await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...testCreateVideoData, title: 'Video Title 005' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app).get(`${rootPath}/videos/${createResponse.body.id}`).expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий изменение данных по видео по ID в БД.*/
  it('should update a video; PUT /hometask_01/api/videos/:id', async () => {
    const createResponse = await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...testCreateVideoData, title: 'Video Title 006' })
      .expect(HttpStatus.Created);

    const testUpdateVideoData: VideoUpdateInputDto = {
      title: 'Video Title 007',
      author: 'Johny',
      availableResolutions: [availableResolution.P1440],
      canBeDownloaded: true,
      minAgeRestriction: null,
      publicationDate: new Date(Date.now() + 864e5).toISOString(),
    };

    await request(app)
      .put(`${rootPath}/videos/${createResponse.body.id}`)
      .send(testUpdateVideoData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(`${rootPath}/videos/${createResponse.body.id}`);

    expect(videoResponse.body).toEqual({
      ...testUpdateVideoData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий удаление видео по ID в БД.*/
  it('should delete a video by id; DELETE /hometask_01/api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...testCreateVideoData, title: 'Video Title 008' })
      .expect(HttpStatus.Created);

    await request(app).delete(`${rootPath}/videos/${createdVideoId}`).expect(HttpStatus.NoContent);
    const videoResponse = await request(app).get(`${rootPath}/videos/${createdVideoId}`);
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
});
