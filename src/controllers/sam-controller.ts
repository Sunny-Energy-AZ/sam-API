import { SAMHelper, Validation } from '@helpers';
import { AppContext, Errors, ValidationFailure } from '@typings';
import { pvWattsValidator } from '@validators';
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
    this.router.post(`${this.basePath}/pv-watts`, pvWattsValidator, this.getPVWattEnergyProduction);
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
}
