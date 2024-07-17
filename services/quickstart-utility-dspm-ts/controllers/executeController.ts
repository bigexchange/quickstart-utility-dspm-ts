import {
  ActionResponseDetails,
  ExecutionContext,
  ExecutionProvider,
  StatusEnum,
} from '@bigid/apps-infrastructure-node-js';
import { backupFilesAction, printBigIdCasesAsJSON } from '../services/executeService';
import { Response } from "express";

import { getLogger } from "log4js";

export class ExecutionController extends ExecutionProvider {

  async executeAction(executionContext: ExecutionContext, res: Response): Promise<void> {
    const action = executionContext.actionName;
    const executionId = executionContext.executionId;

    try {
      switch (action) {

        case ("Backup files (DSPM)"):
          const msg = await backupFilesAction(executionContext);
          this.generateSyncSuccessMessage(res, executionId, msg);
          break;

        case ("Get DSPM Cases"):
          await printBigIdCasesAsJSON(executionContext);
          this.generateSyncSuccessMessage(res, executionId, "Printed cases as JSON successfully!");
          break;

        default:
          res.status(200)
            .json(
              new ActionResponseDetails(
                executionId,
                StatusEnum.ERROR,
                0,
                `Got unresolved action = ${action}`));
      }
    } catch (error) {
      getLogger().error(error);
      this.generateFailedResponse(res, executionId, error instanceof Error ? error.message : 'unknown error');
    }
  }
}

export const executionController = new ExecutionController();  