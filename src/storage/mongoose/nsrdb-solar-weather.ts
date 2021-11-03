import { model, Schema } from 'mongoose';

const NSRDBSolarWeatherSchema: Schema = new Schema(
  {
    loc: {
      type: { type: Schema.Types.String, required: true },
      coordinates: [{ type: Schema.Types.Number, required: true }]
    },
    locationId: { type: String, required: true },
    s3File: { type: String, required: true }
  },
  {
    collection: 'nsrdb_solar_weather',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

NSRDBSolarWeatherSchema.index({ loc: '2dsphere' });
const NSRDBSolarWeather = model('NSRDBSolarWeather', NSRDBSolarWeatherSchema);
export default NSRDBSolarWeather;
