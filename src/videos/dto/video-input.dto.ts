import { availableResolution } from '../types/video';

/*DTO для входных данных для создания нового видео.*/
export type VideoCreateInputDto = {
  title: string;
  author: string;
  availableResolutions: availableResolution[];
};

/*DTO для входных данных для изменения видео.*/
export type VideoUpdateInputDto = {
  title: string;
  author: string;
  availableResolutions: availableResolution[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
