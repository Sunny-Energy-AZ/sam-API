require('module-alias/register');

import chai from 'chai';
// tslint:disable-next-line: import-name
import spies from 'chai-spies';
chai.use(spies);
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { repositoryContext, testAppContext } from '../../mocks/app-context';
import { pvWattsBody } from '../../data/pv-watts-body';

import { App } from '@server';

chai.use(chaiHttp);
const expect = chai.expect;
let expressApp: Application;

before(async () => {
  await repositoryContext.store.connect();
  const app = new App(testAppContext);
  app.initializeMiddlewares();
  app.initializeControllers();
  app.initializeErrorHandling();
  expressApp = app.expressApp;
});

describe('POST /sam/pv-watts', () => {
  it('should return SAM calculation result', async () => {
    const res = await chai.request(expressApp).post(`/sam/pv-watts`).send(pvWattsBody);

    expect(res).to.have.status(200);
    expect(res.body).to.include.all.keys(
      'preSolarCost',
      'numOfSolarPanels',
      'increasedHomeValue',
      'estimated25YrsSavings',
      'systemSizeInKw',
      'tonsOfCO2Offset',
      'totalSystemPrice',
      'monthlyPaymentTerm',
      'netSystemPrice'
    );
    expect(res.body.preSolarCost).to.equal(79866);
    expect(res.body.numOfSolarPanels).to.equal(71);
    expect(res.body.increasedHomeValue).to.equal(0);
    expect(res.body.estimated25YrsSavings).to.equal(18844);
    expect(res.body.systemSizeInKw).to.equal('21.655');
    expect(res.body.tonsOfCO2Offset).to.equal(22);
    expect(res.body.totalSystemPrice).to.equal(56303.00000000001);
    expect(res.body.monthlyPaymentTerm).to.equal('242.10');
    expect(res.body.netSystemPrice).to.equal(41664);
  });

  it('should return validation error for wrong tilt angle', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, tiltAngle: 150 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'tiltAngle',
      message: 'Tilt angle must be provided and it must be in range [0, 90]'
    });
  });

  it('should return validation error for wrong Azimuth angle', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, azimuthAngle: 565 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'azimuthAngle',
      message: 'Azimuth angle must be provided and it must be in range [0, 360]'
    });
  });

  it('should return validation error for wrong AC-DC ratio', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, ratioACToDC: 'abc' });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'ratioACToDC',
      message: 'AC to DC ratio must be provided and it must be a positive number'
    });
  });

  it('should return validation error for wrong inverter efficiency', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, inverterEfficiency: 150 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'inverterEfficiency',
      message: 'Inverter efficiency must be provided and it must be in range [90, 99.5]'
    });
  });

  it('should return validation error for wrong ground coverage ratio', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, ratioGroundCoverage: 4 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'ratioGroundCoverage',
      message: 'Ground coverage ratio must be provided and it must be in range [0, 3]'
    });
  });

  it('should return validation error for wrong loss', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, loss: 150 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'loss',
      message: 'Loss in percentage must be provided and it must be in range [0, 100]'
    });
  });

  it('should return validation error for wrong module type', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, moduleType: 0.5 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'moduleType',
      message: 'Module type must be provided and it can only contain values [0, 1, 2]'
    });
  });

  it('should return validation error for wrong enable battery', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, enableBattery: -1 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'enableBattery',
      message: 'Enable battery flag can only contain values [0, 1]'
    });
  });

  it('should return validation error for wrong array type', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, arrayType: 5 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'arrayType',
      message: 'Array typr must be provided and it can only contain values [0, 1, 2, 3, 4]'
    });
  });

  it('should return validation error for wrong constant loss adjustment', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, constantLossAdjustment: 150 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'constantLossAdjustment',
      message: 'Constant loss adjustment must be provided and it must be in range [0, 100]'
    });
  });

  it('should return validation error for wrong panel power', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, solarModulePower: 'abc' });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'solarModulePower',
      message: 'Per solar module power must be provided and it must be a positive number'
    });
  });

  it('should return validation error for wrong zipcode', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, zipcode: null });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'zipcode',
      message: 'Provided zipcode is not valid'
    });
  });

  it('should return validation error for wrong latitude', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, lat: 150 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'lat',
      message: "Latitude must be provided ('lat'), and it must range bw -90 to 90"
    });
  });

  it('should return validation error for wrong longitude', async () => {
    const res = await chai
      .request(expressApp)
      .post(`/sam/pv-watts`)
      .send({ ...pvWattsBody, lon: -189 });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation failed. Please modify the request and try again.');
    expect(res.body.failures).to.deep.include({
      field: 'lon',
      message: "Longitude must be provided ('lon'), and it must range bw -180 to 180"
    });
  });
});
