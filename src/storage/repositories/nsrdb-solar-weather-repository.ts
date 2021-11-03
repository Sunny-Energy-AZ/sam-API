import { ModelFactory, NSRDBSolarWeather } from '@models';
import { LooseObject } from '@typings';
import { BaseRepository } from './base-repository';
import { CONSTANTS } from './constant';
import { RepositoryContext } from './repository-context';

export class NSRDBSolarWeatherRepository extends BaseRepository<NSRDBSolarWeather> {
  constructor(context: RepositoryContext) {
    super(context);
  }

  public async getNearestWeatherData(lat: string, lon: string): Promise<LooseObject> {
    const geospatialQuery = {
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          }
        }
      }
    };

    const queryOptions = {
      skip: 0,
      limit: 1
    };

    const [result] = await this.context.store.getAll<NSRDBSolarWeather>(
      {
        ...geospatialQuery
      },
      queryOptions,
      this.modelFactory()
    );

    return result.serialize();
  }

  protected modelFactory(): ModelFactory<NSRDBSolarWeather> {
    return {
      getType() {
        return CONSTANTS.REPOSITORY_TYPE.NSRDB_SOLAR_WEATHER;
      },
      create(json: any) {
        return new NSRDBSolarWeather(json);
      }
    };
  }
}
