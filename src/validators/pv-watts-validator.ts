import { AppContext } from '@typings';
import { check, ValidationChain } from 'express-validator';

const pvWattsValidator = (appContext: AppContext): ValidationChain[] => [
  check('tiltAngle').isFloat({ min: 0, max: 90 }).withMessage('VALIDATION_ERRORS.INVALID_TILT_ANGLE'),

  check('azimuthAngle').isFloat({ min: 0, max: 360 }).withMessage('VALIDATION_ERRORS.INVALID_AZIMUTH_ANGLE'),

  check('ratioACToDC').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_RATIO_AC_TO_DC'),

  check('inverterEfficiency').isFloat({ min: 90, max: 99.5 }).withMessage('VALIDATION_ERRORS.INVALID_INVERTER_EFFICIENCY'),

  check('ratioGroundCoverage').isFloat({ min: 0, max: 3 }).withMessage('VALIDATION_ERRORS.INVALID_RATIO_GROUND_COVERAGE'),

  check('loss').isFloat({ min: 0, max: 100 }).withMessage('VALIDATION_ERRORS.INVALID_LOSS'),

  check('moduleType').isIn([0, 1, 2]).withMessage('VALIDATION_ERRORS.INVALID_MODULE_TYPE'),

  check('enableBattery').optional().isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_ENABLE_BATTERY'),

  check('arrayType').isIn([0, 1, 2, 3, 4]).withMessage('VALIDATION_ERRORS.INVALID_ARRAY_TYPE'),

  check('constantLossAdjustment')
    .isFloat({ min: 0, max: 100 })
    .withMessage('VALIDATION_ERRORS.INVALID_CONSTANT_LOSS_ADJUSTMENT'),

  check('solarModulePower').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_SOLAR_MODULE_POWER'),

  check('zipcode')
    .isString()
    .custom((val) => {
      const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val || '');
      if (!isValidZip) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('VALIDATION_ERRORS.INVALID_ZIPCODE'),

  check('lat').isFloat({ min: -90, max: 90 }).withMessage('VALIDATION_ERRORS.INVALID_LATITUDE'),

  check('lon').isFloat({ min: -180, max: 180 }).withMessage('VALIDATION_ERRORS.INVALID_LONGITUDE'),
];

export default pvWattsValidator;
