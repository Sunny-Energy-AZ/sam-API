import { SAMHelper, Validation } from '@helpers';
import { AppContext, Errors, ValidationFailure } from '@typings';
import { battWattsValidator, pvWattsValidator } from '@validators';
import { NextFunction, Request, Response, Router } from 'express';
import { BaseController } from './base-controller';

export class SAMController extends BaseController {
  public basePath: string = '/sam';
  public router: Router = Router();

  constructor(ctx: AppContext) {
    super(ctx);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.basePath}/pv-watts`, pvWattsValidator(this.appContext), this.getPVWattEnergyProduction);
    this.router.post(`${this.basePath}/batt-watts`, battWattsValidator(this.appContext), this.getBattWattEnergyStorage);
    this.router.post(`${this.basePath}/utility-rates`, battWattsValidator(this.appContext), this.getUtilityRate);
  }

  private getPVWattEnergyProduction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const failures: ValidationFailure[] = Validation.extractValidationErrors(req);
      if (failures.length > 0) {
        const valError = new Errors.ValidationError(res.__('DEFAULT_ERRORS.VALIDATION_FAILED'), failures);
        return next(valError);
      }

      const {
        solarModulePower,
        tiltAngle,
        azimuthAngle,
        ratioACToDC,
        inverterEfficiency,
        ratioGroundCoverage,
        loss,
        moduleType,
        enableBattery,
        arrayType,
        zipcode,
        lat,
        lon,
        constantLossAdjustment
      } = req.body;

      const localFilePath = await SAMHelper.ensureWeatherFileOnS3AndDownloadLocally(this.appContext, zipcode, lat, lon);

      const pvWattsResp = SAMHelper.getEnergyConsumption(
        localFilePath,
        solarModulePower,
        tiltAngle,
        azimuthAngle,
        ratioACToDC,
        inverterEfficiency,
        ratioGroundCoverage,
        loss,
        moduleType,
        enableBattery,
        arrayType,
        constantLossAdjustment
      );

      res.status(200).json(pvWattsResp);
    } catch (err) {
      next(err);
    }
  }

  private getBattWattEnergyStorage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const failures: ValidationFailure[] = Validation.extractValidationErrors(req);
      if (failures.length > 0) {
        const valError = new Errors.ValidationError(res.__('DEFAULT_ERRORS.VALIDATION_FAILED'), failures);
        return next(valError);
      }

      const {
        enableBattery,
        batteryChemistry,
        batteryCapacityInkWh,
        batteryPowerInkW,
        batteryDispatch,
        chargeFromPV,
        chargeFromGrid,
        discharge,
        chargeFromGridPercenrage,
        setDischargePercentage,
        manualDispatchWeekday,
        manualDispatchWeekend,
        dcArrayPowerInW,
        hourlyEnergyInW,
        inverterModel,
        efficiency,
        electricityLoad
      } = req.body;

      const battWattResp = SAMHelper.getBatteryWattDataForFirstYear(
        enableBattery,
        batteryChemistry,
        batteryCapacityInkWh,
        batteryPowerInkW,
        batteryDispatch,
        chargeFromPV,
        chargeFromGrid,
        discharge,
        chargeFromGridPercenrage,
        setDischargePercentage,
        manualDispatchWeekday,
        manualDispatchWeekend,
        dcArrayPowerInW,
        hourlyEnergyInW,
        inverterModel,
        efficiency,
        electricityLoad
      );

      res.status(200).json(battWattResp);
    } catch (err) {
      next(err);
    }
  }

  private getUtilityRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const failures: ValidationFailure[] = Validation.extractValidationErrors(req);
      if (failures.length > 0) {
        const valError = new Errors.ValidationError(res.__('DEFAULT_ERRORS.VALIDATION_FAILED'), failures);
        return next(valError);
      }

      const {
        analysisPeriod,
        systemuseLifetimeOutput,
        inflationRate,
        annualEnergyDegradation,
        enableTimeStepSellRates,
        systemPower,
        electricalLoad,
        selectedMonthlyAccountOfExcessGeneration,
        yearEndSellRate,
        monthlyFixedCharge,
        monthlyMinCharge,
        annualMinCharge,
        useNetMetering,
        energyweekdayschedule,
        energyweekendschedule,
        energyratestructure,
        enableDemandCharge,
        demandweekdayschedule,
        demandweekendschedule,
        demandratestructure,
        flatdemandstructure
      } = req.body;

      const utilityRate = SAMHelper.getElectricityRateFor1stYear(
        analysisPeriod,
        systemuseLifetimeOutput,
        inflationRate,
        annualEnergyDegradation,
        enableTimeStepSellRates,
        systemPower,
        electricalLoad,
        selectedMonthlyAccountOfExcessGeneration,
        yearEndSellRate,
        monthlyFixedCharge,
        monthlyMinCharge,
        annualMinCharge,
        useNetMetering,
        energyweekdayschedule,
        energyweekendschedule,
        energyratestructure,
        enableDemandCharge,
        demandweekdayschedule,
        demandweekendschedule,
        demandratestructure,
        flatdemandstructure
      );

      res.status(200).json(utilityRate);
    } catch (err) {
      next(err);
    }
  }
}
