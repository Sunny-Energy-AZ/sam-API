import { AppContext } from '@typings';
import { check, ValidationChain } from 'express-validator';

const pvWattsValidator = (appContext: AppContext): ValidationChain[] => [
  check('isBatteryEnabled').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_ENABLE_BATTERY'),

  check('batteryChemistryEnum').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_ARRAY_TYPE')
];

export default pvWattsValidator;
