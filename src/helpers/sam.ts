import { awsS3Service } from '@services';
import { AppContext } from '@typings';
import axios from 'axios';
import config from 'config';
import csvParse from 'csv-parse';
import fs from 'fs';
import { SAM } from 'node-sam-local-test';
import path from 'path';
import { CONTROLLER_CONSTANTS } from './controller-constant';

export const ensureWeatherFileOnS3AndDownloadLocally = async (
  ctx: AppContext,
  zipcode: string,
  lat: number,
  lon: number
): Promise<string> => {
  const fileName = `weather_data_${zipcode}.csv`;
  const localFilePath = path.join(__dirname, `../../public/solar_resource/${fileName}`);

  if (fs.existsSync(localFilePath)) {
    return Promise.resolve(localFilePath);
  }

  const AWS_BUCKET_NAME: string = config.get('aws.bucketName');

  if (await awsS3Service.fileExistsOnAWSS3(AWS_BUCKET_NAME, fileName)) {
    await awsS3Service.downloadFileFromAWSS3(AWS_BUCKET_NAME, fileName, localFilePath);

    return Promise.resolve(localFilePath);
  }

  const latLonObj = await getLatLonFromZipcode(zipcode, lat, lon);

  let weatherFileResponseBody = await getWeatherDataFromNSRDB(latLonObj.lt, latLonObj.ln);

  if (!weatherFileResponseBody) {
    return Promise.reject(new Error('weather data not found'));
  }

  const weatherDataRecords: [][] = await new Promise((resolve, reject) => {
    try {
      csvParse(weatherFileResponseBody, { delimiter: ',', relax_column_count: true }, (parseWeatherDataErr, records) => {
        if (parseWeatherDataErr) {
          reject(parseWeatherDataErr);
          return;
        }
        resolve(records);
      });
    } catch (err) {
      reject(err);
    }
  });

  const output = [];
  output[0] = weatherDataRecords[0].slice(0, 9).join(',');
  output[1] = weatherDataRecords[1].slice(0, 9).join(',');
  for (let i = 2; i < weatherDataRecords.length; i += 1) {
    output[i] = weatherDataRecords[i].join(',');
  }

  const outputData = output.join('\n');

  await awsS3Service.writeFileOnAWSS3(outputData, AWS_BUCKET_NAME, fileName);

  fs.writeFileSync(localFilePath, outputData);

  return Promise.resolve(localFilePath);
};

export const getWeatherDataFromNSRDB = async (lat: number, lon: number) => {
  try {
    const NREL_API_KEY: string = config.get('nrelAPIKey');
    const NREL_EMAIL_ID: string = config.get('nrelEmailID');

    const nrelSolarURL = new URL(CONTROLLER_CONSTANTS.NREL_NSRDB_SOLAR_URL);
    nrelSolarURL.searchParams.append('api_key', encodeURIComponent(NREL_API_KEY));
    nrelSolarURL.searchParams.append('lat', lat.toString());
    nrelSolarURL.searchParams.append('lon', lon.toString());

    let weatherFileURL = null;
    let weatherFileResponseBody = null;

    const { data: body } = await axios.get(nrelSolarURL.toString());
    if (body && body.outputs && body.outputs.length > 0) {
      const weatherData = body.outputs[0];
      if (weatherData && weatherData.links && weatherData.links.length > 0) {
        for (const linkData of weatherData.links) {
          if (linkData.year.startsWith('tmy')) {
            weatherFileURL = linkData.link.replace('yourapikey', encodeURIComponent(NREL_API_KEY));
            weatherFileURL = weatherFileURL.replace('youremail', encodeURIComponent(NREL_EMAIL_ID));
            break;
          }
        }
      }
    }

    if (weatherFileURL) {
      const resp = await axios.get(weatherFileURL);
      weatherFileResponseBody = resp.data;
    }

    return weatherFileResponseBody;
  } catch (err) {
    return null;
  }
};

export const getLatLonFromZipcode = async (zipcode: string, lat: number, lon: number) => {
  let lt = 0;
  let ln = 0;

  const GOOGLE_GEO_CODING_KEY: string = config.get('googleAPIs.geoCodingKey');

  const goodleGeocodeURL = new URL(CONTROLLER_CONSTANTS.GOOGLE_GEOCODE_URL);
  goodleGeocodeURL.searchParams.append('address', encodeURIComponent(zipcode));
  goodleGeocodeURL.searchParams.append('key', encodeURIComponent(GOOGLE_GEO_CODING_KEY));

  const { data: googleGeocodeResponse } = await axios.get(goodleGeocodeURL.toString());
  if (googleGeocodeResponse && googleGeocodeResponse.results && googleGeocodeResponse.results.length > 0) {
    const geometry = googleGeocodeResponse.results[0].geometry;
    if (geometry && geometry.location) {
      lt = geometry.location.lat;
      ln = geometry.location.lng;
    }
  }

  if (lt === 0 || ln === 0) {
    lt = lat;
    ln = lon;
  }

  return {
    lt,
    ln
  };
};

export const getEnergyConsumption = (
  localFilePath: string,
  solarModulePower: number,
  tiltAngle: number,
  azimuthAngle: number,
  ratioACToDC: number,
  inverterEfficiency: number,
  ratioGroundCoverage: number,
  loss: number,
  moduleType: number,
  enableBattery: number,
  arrayType: number,
  constantLossAdjustment: number
) => {
  const sam = new SAM();
  const pvWatts = sam.pvWattsV5();

  pvWatts.setSolarWeatherDataFilePath(localFilePath);
  pvWatts.setSystemCapacityInKW(solarModulePower);
  pvWatts.setTiltInDegree(tiltAngle);
  pvWatts.setAzimuthInDegree(azimuthAngle);
  pvWatts.setDCToACRatio(ratioACToDC);
  pvWatts.setInverterEfficiencyAtRatedPowerInPercentage(inverterEfficiency);
  pvWatts.setGroundCoverageRatio(ratioGroundCoverage);
  pvWatts.setLossesInPercentage(loss);
  pvWatts.setModuleType(moduleType);
  pvWatts.setEnableBattery(enableBattery);
  pvWatts.setArrayType(arrayType);
  pvWatts.setConstantLossAdjustmentInPercentage(constantLossAdjustment);

  return pvWatts.run();
};
