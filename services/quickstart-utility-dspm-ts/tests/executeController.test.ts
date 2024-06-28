jest.mock("../services/executeService");
jest.mock("log4js");

import { fakeExecutionContextBadAction, fakeExecutionContextGetDSPMCasesAllSources } from "../static/example_responses";
import { executionController } from "../controllers/executeController";
import { mockResponse } from "../static/example_responses";
import { getLogger } from "log4js";
import { printBigIdCasesAsJSON } from "../services/executeService";
import { ActionResponseDetails, StatusEnum } from "@bigid/apps-infrastructure-node-js";

let mockedPrintBigIdCasesAsJSON = printBigIdCasesAsJSON as jest.Mock;
let mockedGetLogger = getLogger as jest.Mock;
let mockedLoggerError = jest.fn();

mockedGetLogger.mockReturnValue({error: mockedLoggerError});

describe("Testing Action Switch...", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should execute \"Get DSPM Cases\" action", async () => {
        const executionContext = fakeExecutionContextGetDSPMCasesAllSources;
        await executionController.executeAction(executionContext, mockResponse());
        expect(mockedPrintBigIdCasesAsJSON).toHaveBeenCalledTimes(1);
    });
    test("should trigger default branch", async () => {
        let res = mockResponse();
        const executionContext = fakeExecutionContextBadAction;
        await executionController.executeAction(executionContext, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ActionResponseDetails("1111", StatusEnum.ERROR, 0, "Got unresolved action = foo"));
    });
    test("should catch known error", async () => {
        let res = mockResponse();
        const executionContext = fakeExecutionContextGetDSPMCasesAllSources;
        let failSpy = jest.spyOn(executionController, "generateFailedResponse");
        mockedPrintBigIdCasesAsJSON.mockRejectedValueOnce(new Error("eek"));
        await executionController.executeAction(executionContext, res);
        expect(mockedLoggerError).toHaveBeenCalledWith(new Error("eek"));
        expect(failSpy).toHaveBeenCalledWith(res, "1111", "eek");
    });
    test("should catch unknown error", async () => {
        let res = mockResponse();
        const executionContext = fakeExecutionContextGetDSPMCasesAllSources;
        let failSpy = jest.spyOn(executionController, "generateFailedResponse");
        mockedPrintBigIdCasesAsJSON.mockRejectedValueOnce("eek");
        await executionController.executeAction(executionContext, res);
        expect(mockedLoggerError).toHaveBeenCalledWith("eek");
        expect(failSpy).toHaveBeenCalledWith(res, "1111", "unknown error");
    });
});