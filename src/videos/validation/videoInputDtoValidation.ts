import { availableResolution } from '../types/video';
import {
  VideoCreateInputDto,
  VideoUpdateInputDto,
} from '../dto/video-input.dto';
import { ValidationError } from '../types/validationError';
import { db } from '../../db/in-memory.db';

/*Функция для валидации DTO для входных данных для создания нового видео.*/
export const videoCreateInputDtoValidation = (
  data: VideoCreateInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  /*Валидация поля "title".*/
  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length < 1 ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }

  /*Валидация поля "author".*/
  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim().length < 1 ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }

  /*Валидация поля "availableResolutions".*/
  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'availableResolutions must be array',
    });
  } else if (data.availableResolutions.length < 1) {
    errors.push({
      field: 'availableResolutions',
      message: 'Invalid availableResolutions',
    });
  } else if (data.availableResolutions.length) {
    const existingResolutions = Object.values(availableResolution);

    if (data.availableResolutions.length > existingResolutions.length) {
      errors.push({
        field: 'availableResolutions',
        message: 'Invalid availableResolutions',
      });
    }

    for (const video of data.availableResolutions) {
      if (!existingResolutions.includes(video)) {
        errors.push({
          field: 'resolutions',
          message: 'Invalid available resolution:' + video,
        });

        break;
      }
    }
  }

  return errors;
};

/*Функция для валидации DTO для входных данных для изменения видео.*/
export const videoUpdateInputDtoValidation = (
  data: VideoUpdateInputDto,
  id: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  /*Валидация поля "title".*/
  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length < 1 ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }

  /*Валидация поля "author".*/
  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim().length < 1 ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }

  /*Валидация поля "availableResolutions".*/
  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'availableResolutions must be array',
    });
  } else if (data.availableResolutions.length < 1) {
    errors.push({
      field: 'availableResolutions',
      message: 'Invalid availableResolutions',
    });
  } else if (data.availableResolutions.length) {
    const existingResolutions = Object.values(availableResolution);

    if (data.availableResolutions.length > existingResolutions.length) {
      errors.push({
        field: 'availableResolutions',
        message: 'Invalid availableResolutions',
      });
    }

    for (const video of data.availableResolutions) {
      if (!existingResolutions.includes(video)) {
        errors.push({
          field: 'resolutions',
          message: 'Invalid available resolution:' + video,
        });

        break;
      }
    }
  }

  /*Валидация поля "canBeDownloaded".*/
  if (!data.canBeDownloaded || typeof data.canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'Invalid canBeDownloaded',
    });
  }

  /*Валидация поля "minAgeRestriction".*/
  if (
    (data.minAgeRestriction !== null &&
      typeof data.minAgeRestriction !== 'number') ||
    (typeof data.minAgeRestriction === 'number' &&
      (data.minAgeRestriction < 1 || data.minAgeRestriction > 18))
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'Invalid minAgeRestriction',
    });
  }

  /*Валидация поля "publicationDate".*/
  const createdAt = new Date(db.videos.find((v) => v.id === id)!.createdAt);
  const publicationDate = new Date(data.publicationDate);

  if (
    !data.publicationDate ||
    typeof data.publicationDate !== 'string' ||
    isNaN(publicationDate.getTime()) ||
    createdAt > publicationDate
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'Invalid publicationDate',
    });
  }

  return errors;
};
