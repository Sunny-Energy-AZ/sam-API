import { LooseObject } from '@typings';

export class BaseModel implements LooseObject {
  _id?: string;
  constructor(json: any) {
    if (json && json._id) {
      this._id = json._id;
    }
  }
}
