import { LooseObject } from '@typings';
import { BaseModel } from './base-model';
import { Location } from './location';

export class NSRDBSolarWeather extends BaseModel {
  loc: Location;
  locationId: string;
  s3File: string;

  constructor(json?: any) {
    super(json);
    if (json) {
      this.loc = new Location(json.loc);
      this.locationId = json.locationId;
      this.s3File = json.s3File;
    }
  }

  public toSchema(): NSRDBSolarWeather {
    this.loc = this.loc.toSchema();
    return this;
  }

  public serialize(): LooseObject {
    return {
      loc: this.loc.serialize(),
      locationId: this.locationId,
      s3File: this.s3File
    };
  }
}
