import { AppContext } from '@typings';
import { check, ValidationChain } from 'express-validator';

const battWattsValidator = (appContext: AppContext): ValidationChain[] => [
  check('enableBattery').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_ENABLE_BATTERY'),

  check('batteryChemistry').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_BATTERY_CHEMISTRY'),

  check('batteryCapacityInkWh').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_BATTERY_CAPACITY'),

  check('batteryPowerInkW').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_BATTERY_POWER'),

  check('batteryDispatch').isIn([0, 1, 4]).withMessage('VALIDATION_ERRORS.INVALID_BATTERY_DISPATCH'),

  check('chargeFromPV').custom(async (chargeFromPV, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(chargeFromPV && chargeFromPV.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_CHARGE_FROM_PV'),

  check('chargeFromGrid').custom(async (chargeFromGrid, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(chargeFromGrid && chargeFromGrid.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_CHARGE_FROM_GRID'),

  check('discharge').custom(async (discharge, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(discharge && discharge.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_DISCHARGE'),

  check('chargeFromGridPercenrage').custom(async (chargeFromGridPercenrage, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(chargeFromGridPercenrage && chargeFromGridPercenrage.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_CHARGE_FROM_GRID_PERCENT'),

  check('setDischargePercentage').custom(async (setDischargePercentage, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(setDischargePercentage && setDischargePercentage.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_DISCHARGE_PERCENT'),

  check('manualDispatchWeekday').custom(async (manualDispatchWeekday, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(manualDispatchWeekday && manualDispatchWeekday.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_MANUAL_DISPATCH_WEEKDAY'),

  check('manualDispatchWeekend').custom(async (manualDispatchWeekend, { req }) => {
    const {
      batteryDispatch,
      enableBattery
    } = req.body

    if (enableBattery === 1 && batteryDispatch === 4) {
      if (!(manualDispatchWeekend && manualDispatchWeekend.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_MANUAL_DISPATCH_WEEKEND'),

  check('dcArrayPowerInW').isArray({ min: 1 }).withMessage('VALIDATION_ERRORS.INVALID_DC_ARRAY_POWER'),

  check('hourlyEnergyInW').isArray({ min: 1 }).withMessage('VALIDATION_ERRORS.INVALID_HOURLY_ENERGY'),

  check('inverterModel').isIn([0, 1, 2, 3, 4]).withMessage('VALIDATION_ERRORS.INVALID_INVERTER_MODEL'),

  check('efficiency').isFloat({ min: 90, max: 99.5 }).withMessage('VALIDATION_ERRORS.INVALID_INVERTER_EFFICIENCY'),

  check('electricityLoad').isArray({ min: 1 }).withMessage('VALIDATION_ERRORS.INVALID_ELECTRICAL_LOAD'),
];

export default battWattsValidator;
