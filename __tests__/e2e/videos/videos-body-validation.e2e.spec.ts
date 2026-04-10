import express from 'express';
import request from 'supertest';
import { rootPath, setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import {
  VideoCreateInputDto,
  VideoUpdateInputDto,
} from '../../../src/videos/dto/video-input.dto';
import { availableResolution } from '../../../src/videos/types/video';

/*Описываем тестовый набор.*/
describe('Video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestCreateVideoData: VideoCreateInputDto = {
    title: 'Video Title 001',
    author: 'John',
    availableResolutions: [availableResolution.P1440],
  };

  const correctTestUpdateVideoData: VideoUpdateInputDto = {
    title: 'Video Title 002',
    author: 'Johny',
    availableResolutions: [availableResolution.P1440],
    canBeDownloaded: true,
    minAgeRestriction: null,
    publicationDate: new Date(Date.now() + 864e5).toISOString(),
  };

  beforeAll(async () => {
    await request(app)
      .delete(`${rootPath}/testing/all-data`)
      .expect(HttpStatus.NoContent);
  });

  /*Описываем тест, проверяющий отказ в добавлении видео с непрошедшими валидацию данными.*/
  it('should not create a video when an incorrect body passed; POST /hometask_01/api/videos', async () => {
    const invalidDataSet1 = await request(app)
      .post(`${rootPath}/videos`)
      .send({
        ...correctTestCreateVideoData,
        title: '   ',
        author: '    ',
        availableResolutions: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post(`${rootPath}/videos`)
      .send({
        ...correctTestCreateVideoData,
        title: 'Video Title 002',
        author: '    ',
        availableResolutions: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);

    const invalidDataSet3 = await request(app)
      .post(`${rootPath}/videos`)
      .send({
        ...correctTestCreateVideoData,
        title: '   ',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const videoListResponse = await request(app).get(`${rootPath}/videos`);
    expect(videoListResponse.body).toHaveLength(0);
  });

  /*Описываем тест, проверяющий отказ в изменении данных видео с непрошедшими валидацию данными.*/
  it('should not update a video when incorrect data passed; PUT /hometask_01/api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...correctTestCreateVideoData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`${rootPath}/videos/${createdVideoId}`)
      .send({
        ...correctTestUpdateVideoData,
        title: '   ',
        author: '    ',
        availableResolutions: [],
        canBeDownloaded: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${rootPath}/videos/${createdVideoId}`)
      .send({
        ...correctTestUpdateVideoData,
        availableResolutions: ['122D'],
        canBeDownloaded: '',
        minAgeRestriction: -10,
        publicationDate: true,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`${rootPath}/videos/${createdVideoId}`)
      .send({
        ...correctTestUpdateVideoData,
        title: '     ',
        publicationDate: false,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(2);

    const videoResponse = await request(app).get(
      `${rootPath}/videos/${createdVideoId}`,
    );

    expect(videoResponse.body).toMatchObject({
      ...correctTestCreateVideoData,
      id: createdVideoId,
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий отказ в изменении данных видео с непрошедшими валидацию данными о разрешениях видео.*/
  it('should not update a video when incorrect features passed; PUT /hometask_01/api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post(`${rootPath}/videos`)
      .send({ ...correctTestCreateVideoData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`${rootPath}/videos/${createdVideoId}`)
      .send({
        ...correctTestUpdateVideoData,
        availableResolutions: [
          availableResolution.P360,
          'invalid-resolution',
          availableResolution.P2160,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const videoResponse = await request(app).get(
      `${rootPath}/videos/${createdVideoId}`,
    );

    expect(videoResponse.body).toMatchObject({
      ...correctTestCreateVideoData,
      id: createdVideoId,
      createdAt: expect.any(String),
    });
  });
});
