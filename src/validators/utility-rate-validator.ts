import { AppContext } from '@typings';
import { check, ValidationChain } from 'express-validator';

const utilityRateValidator = (appContext: AppContext): ValidationChain[] => [
  check('analysisPeriod').isInt({ min: 1 }).withMessage('VALIDATION_ERRORS.INVALID_ANALYSIS_PERIOD'),

  check('systemuseLifetimeOutput').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_SYSTEM_USE_LIFETIME_OUTPUT'),

  check('systemPower').isArray().withMessage('VALIDATION_ERRORS.INVALID_SYSTEM_POWER'),

  check('electricalLoad').isArray().withMessage('VALIDATION_ERRORS.INVALID_ELECTRICAL_LOAD'),

  check('inflationRate').isFloat().withMessage('VALIDATION_ERRORS.INVALID_INFLATION_RATE'),

  check('annualEnergyDegradation').isArray().withMessage('VALIDATION_ERRORS.INVALID_ANNUAL_ENERGY_DEGRADATION'),

  check('selectedMonthlyAccountOfExcessGeneration').isIn([0, 1, 2, 3, 4]).withMessage('VALIDATION_ERRORS.INVALID_MONTHLY_ACC'),

  check('yearEndSellRate').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_YEAR_END_SALE_RATE'),

  check('monthlyFixedCharge').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_MONTHLY_FIXED_CHARGE'),

  check('monthlyMinCharge').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_MONTHLY_MIN_CHARGE'),

  check('annualMinCharge').isFloat({ min: 0 }).withMessage('VALIDATION_ERRORS.INVALID_ANNUAL_MIN_CHARGE'),

  check('useNetMetering').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_NET_METERING'),

  check('enableTimeStepSellRates').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_TIME_STEP_ENABLED'),

  check('timeStepSellRates').custom(async (timeStepSellRates, { req }) => {
    const {
      isTimeStepSellRatesEnabled
    } = req.body

    if (isTimeStepSellRatesEnabled === 1) {
      if (!(timeStepSellRates && timeStepSellRates.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_TIME_STEP_RATES'),

  check('timeStepSellRates.*').optional().isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_TIME_STEP_RATES_VAL'),

  check('energyweekdayschedule').isArray().withMessage('VALIDATION_ERRORS.INVALID_ENERGY_WEEKDAY_SCHEDULE'),

  check('energyweekendschedule').isArray().withMessage('VALIDATION_ERRORS.INVALID_ENERGY_WEEKEND_SCHEDULE'),

  check('energyratestructure').isArray().withMessage('VALIDATION_ERRORS.INVALID_ENERGY_RATE_STRUCTURE'),

  check('enableDemandCharge').isIn([0, 1]).withMessage('VALIDATION_ERRORS.INVALID_DEMAND_CHARGE_ENABLED'),

  check('demandweekdayschedule').isArray().withMessage('VALIDATION_ERRORS.INVALID_DEMAND_WEEKDAY_SCHEDULE'),

  check('demandweekendschedule').isArray().withMessage('VALIDATION_ERRORS.INVALID_DEMAND_WEEKEND_SCHEDULE'),

  check('demandratestructure').custom(async (demandRateStructure, { req }) => {
    const {
      isDemandChargeEnabled
    } = req.body

    if (isDemandChargeEnabled === 1) {
      if (!(demandRateStructure && demandRateStructure.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_DEMAND_RATE_STRUCTURE'),

  check('flatdemandstructure').custom(async (flatDemandStructure, { req }) => {
    const {
      isDemandChargeEnabled
    } = req.body

    if (isDemandChargeEnabled === 1) {
      if (!(flatDemandStructure && flatDemandStructure.length > 0)) {
        return Promise.reject();
      }
    }
  }).withMessage('VALIDATION_ERRORS.INVALID_FLAT_DEMAND_STRUCTURE')
];

export default utilityRateValidator;
