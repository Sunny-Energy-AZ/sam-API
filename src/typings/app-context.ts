import { Logger } from '@typings';
import { Repositories } from '@storage';

export type AppContext = {
  logger: Logger;
  NSRDBSolarWeatherRepository: Repositories.NSRDBSolarWeatherRepository;
};
