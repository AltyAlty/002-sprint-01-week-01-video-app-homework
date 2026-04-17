import { availableResolution, Video } from '../videos/types/video';

/*Моковая БД.*/
export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: 'Video Title 001',
      author: 'Author 001',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      /*Текущая дата + 1 день.*/
      publicationDate: new Date(Date.now() + 864e5).toISOString(),
      availableResolutions: [availableResolution.P144],
    },
    {
      id: 2,
      title: 'Video Title 002',
      author: 'Author 002',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 864e5).toISOString(),
      availableResolutions: [
        availableResolution.P720,
        availableResolution.P1080,
        availableResolution.P1440,
        availableResolution.P2160,
      ],
    },
    {
      id: 3,
      title: 'Video Title 003',
      author: 'Author 003',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 864e5).toISOString(),
      availableResolutions: [availableResolution.P360],
    },
  ],
};
