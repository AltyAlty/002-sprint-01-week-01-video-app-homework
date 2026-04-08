import { ValidationError } from '../../videos/types/validationError';

/*Создаем функцию "createErrorMessages()" для формирования объектов, содержащих массивы с сообщениями об ошибках
валидации.*/
export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
