jest.mock("log4js");
jest.mock("../utils/executeService.utils");
jest.mock("@bigid/apps-infrastructure-node-js");

import { ActionResponseDetails, StatusEnum, updateActionStatusToBigID } from "@bigid/apps-infrastructure-node-js";
import { backupFilesAction, printBigIdCasesAsJSON } from "../services/executeService";
import { fakeBackupFileResponse, fakeBigIdCase, fakeBigIdObject, fakeExecutionContextBackupFilesAllSources, fakeExecutionContextGetDSPMCasesAllSources, fakeExecutionContextGetDSPMCasesSomeSources } from "../static/example_responses";
import { backupFilesInFakeAPI, getBigIdCases, getStringActionParam, remediateCasesWithNoAffectedObjects, setTagsOnObjects, tokenizeStringList } from "../utils/executeService.utils";
import { getLogger } from "log4js";

let mockedGetStringActionParam = getStringActionParam as jest.Mock;
let mockedTokenizeStringList = tokenizeStringList as jest.Mock;
let mockedGetBigIdCases = getBigIdCases as jest.Mock;
let mockedBackupFilesInFakeAPI = backupFilesInFakeAPI as jest.Mock;
let mockedSetTagsOnObjects = setTagsOnObjects as jest.Mock;
let mockedRemediateCasesWithNoAffectedObjects = remediateCasesWithNoAffectedObjects as jest.Mock;
let mockedUpdateActionStatusToBigID = updateActionStatusToBigID as jest.Mock;
let mockedGetLogger = getLogger as jest.Mock;
let mockedLoggerLog = jest.fn();

mockedGetLogger.mockReturnValue({log: mockedLoggerLog});
mockedTokenizeStringList.mockImplementation((list: string) => {return list.trim().split(/ *, */);})
mockedSetTagsOnObjects.mockImplementation((_ec, _tn, _bl, objs) => {return objs.length})

describe("Testing backupFilesAction...", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should run and then log (all data sources)", async () => {
        const executionContext = fakeExecutionContextBackupFilesAllSources;
        let fakeCase = fakeBigIdCase;
        fakeCase.affectedObjects = [fakeBigIdObject];
        const cases = [fakeCase, fakeCase];
        mockedGetStringActionParam
            .mockReturnValueOnce("all")
            .mockReturnValueOnce("A Policy")
            .mockReturnValueOnce("hasBackup");
        mockedGetBigIdCases.mockResolvedValueOnce(cases);
        mockedBackupFilesInFakeAPI.mockResolvedValueOnce(fakeBackupFileResponse).mockResolvedValueOnce(fakeBackupFileResponse);
        mockedRemediateCasesWithNoAffectedObjects.mockImplementationOnce((_ec, cases, _st) => {return cases.length})
        await backupFilesAction(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledTimes(3);
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("all");
        expect(mockedGetBigIdCases).toHaveBeenCalledWith(executionContext, undefined, "A Policy");
        expect(mockedBackupFilesInFakeAPI).toHaveBeenCalledWith(executionContext, fakeCase.affectedObjects);
        expect(mockedSetTagsOnObjects).toHaveBeenCalledWith(executionContext, "hasBackup", "True", fakeCase.affectedObjects);
        expect(mockedRemediateCasesWithNoAffectedObjects).toHaveBeenCalledWith(executionContext, cases, "All affected objects were backed up.");
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(1, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.IN_PROGRESS,
                (1/2),
                "Backing up files from case 1/2"
            )
        );
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(2, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.IN_PROGRESS,
                (2/2),
                "Backing up files from case 2/2"
            )
        );
        const msg = "4 file(s) already backed up. 2 file(s) backed up. 2 tag(s) updated. 2 case(s) remediated."
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(3, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.COMPLETED,
                1,
                msg
            )
        );
        expect(mockedLoggerLog).toHaveBeenCalledWith(msg);
    });
    test("should run and then log (some data sources)", async () => {
        const executionContext = fakeExecutionContextBackupFilesAllSources;
        let fakeCase = fakeBigIdCase;
        fakeCase.affectedObjects = [fakeBigIdObject];
        const cases = [fakeCase, fakeCase];
        mockedGetStringActionParam
            .mockReturnValueOnce("s3-v2")
            .mockReturnValueOnce("A Policy")
            .mockReturnValueOnce("hasBackup");
        mockedGetBigIdCases.mockResolvedValueOnce(cases);
        mockedBackupFilesInFakeAPI.mockResolvedValueOnce(fakeBackupFileResponse).mockResolvedValueOnce(fakeBackupFileResponse);
        mockedRemediateCasesWithNoAffectedObjects.mockImplementationOnce((_ec, cases, _st) => {return cases.length})
        await backupFilesAction(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledTimes(3);
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("s3-v2");
        expect(mockedGetBigIdCases).toHaveBeenCalledWith(executionContext, ["s3-v2"], "A Policy");
        expect(mockedBackupFilesInFakeAPI).toHaveBeenCalledWith(executionContext, fakeCase.affectedObjects);
        expect(mockedSetTagsOnObjects).toHaveBeenCalledWith(executionContext, "hasBackup", "True", fakeCase.affectedObjects);
        expect(mockedRemediateCasesWithNoAffectedObjects).toHaveBeenCalledWith(executionContext, cases, "All affected objects were backed up.");
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(1, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.IN_PROGRESS,
                (1/2),
                "Backing up files from case 1/2"
            )
        );
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(2, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.IN_PROGRESS,
                (2/2),
                "Backing up files from case 2/2"
            )
        );
        const msg = "4 file(s) already backed up. 2 file(s) backed up. 2 tag(s) updated. 2 case(s) remediated."
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(3, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.COMPLETED,
                1,
                msg
            )
        );
        expect(mockedLoggerLog).toHaveBeenCalledWith(msg);
    });
    test("should catch an error backing up files", async () => {
        const executionContext = fakeExecutionContextBackupFilesAllSources;
        let fakeCase = fakeBigIdCase;
        fakeCase.affectedObjects = [fakeBigIdObject];
        const cases = [fakeCase, fakeCase];
        mockedGetStringActionParam
            .mockReturnValueOnce("all")
            .mockReturnValueOnce("A Policy")
            .mockReturnValueOnce("hasBackup");
        mockedGetBigIdCases.mockResolvedValueOnce(cases);
        mockedBackupFilesInFakeAPI.mockRejectedValueOnce(new Error("ruh roh"));
        await expect(backupFilesAction(executionContext)).rejects.toThrow("ruh roh");
        expect(mockedGetStringActionParam).toHaveBeenCalledTimes(3);
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("all");
        expect(mockedGetBigIdCases).toHaveBeenCalledWith(executionContext, undefined, "A Policy");
        expect(mockedBackupFilesInFakeAPI).toHaveBeenCalledWith(executionContext, fakeCase.affectedObjects);
        expect(mockedUpdateActionStatusToBigID).toHaveBeenNthCalledWith(1, executionContext, 
            new ActionResponseDetails(
                executionContext.executionId,
                StatusEnum.IN_PROGRESS,
                (1/2),
                "Backing up files from case 1/2"
            )
        );
    });
});

describe("Testing printBigIdCasesAsJSON...", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should run and then log (all data sources)", async () => {
        const executionContext = fakeExecutionContextGetDSPMCasesAllSources;
        mockedGetStringActionParam.mockReturnValueOnce("all");
        mockedGetBigIdCases.mockResolvedValueOnce({yay: "ahh"});
        await printBigIdCasesAsJSON(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledWith(executionContext, "Data Source Types");
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("all");
        expect(getBigIdCases).toHaveBeenCalledWith(executionContext, undefined);
        expect(mockedLoggerLog).toHaveBeenCalledWith("{\"yay\":\"ahh\"}");
    });
    test("should run and then log (select data sources)", async () => {
        const executionContext = fakeExecutionContextGetDSPMCasesSomeSources;
        mockedGetStringActionParam.mockReturnValueOnce("s3-v2");
        mockedGetBigIdCases.mockResolvedValueOnce({yay: "ahh"});
        await printBigIdCasesAsJSON(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledWith(executionContext, "Data Source Types");
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("s3-v2");
        expect(getBigIdCases).toHaveBeenCalledWith(executionContext, ["s3-v2"]);
        expect(mockedLoggerLog).toHaveBeenCalledWith("{\"yay\":\"ahh\"}");
    });
});