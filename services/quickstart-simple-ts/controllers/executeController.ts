import {
  ActionResponseDetails,
  appLogger,
  ExecutionContext,
  ExecutionProvider,
  StatusEnum,
} from '@bigid/apps-infrastructure-node-js';
import { Response } from "express";

export class ExecutionController extends ExecutionProvider {

  async executeAction(executionContext: ExecutionContext, res: Response): Promise<void> {
    const action = executionContext.actionName;
    const executionId = executionContext.executionId;

    try {
      switch (action) {

        case ("Test Action"):
          
          console.log('Test Action was called from a BigID server! Our ExecutionContext is '+ JSON.stringify(executionContext));
          this.generateSyncSuccessMessage(res, executionId, "Did nothing successfully!");
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
      appLogger.error(error);
      this.generateFailedResponse(res, executionId, error instanceof Error ? error.message : 'unknown error');
    }
  }
}

export const executionController = new ExecutionController();  