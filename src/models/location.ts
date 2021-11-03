import { LooseObject } from '@typings';
import { BaseModel } from './base-model';

export class Location extends BaseModel {
  type: string;
  lat?: number;
  lon?: number;
  coordinates?: number[];

  constructor(json?: any) {
    super(json);
    if (json) {
      this.type = json.type;
      this.lon = json.lon || json.coordinates[0];
      this.lat = json.lat || json.coordinates[1];
    }
  }

  public toSchema(): Location {
    this.coordinates = [this.lon, this.lat];
    delete this.lat;
    delete this.lon;
    return this;
  }

  public serialize(): LooseObject {
    return {
      type: this.type,
      lat: this.lat,
      lon: this.lon
    };
  }
}
