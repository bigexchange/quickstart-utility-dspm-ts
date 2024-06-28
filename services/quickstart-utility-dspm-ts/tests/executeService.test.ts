jest.mock("log4js");
jest.mock("../utils/executeService.utils");

import { printBigIdCasesAsJSON } from "../services/executeService";
import { fakeExecutionContextGetDSPMCasesAllSources, fakeExecutionContextGetDSPMCasesSomeSources } from "../static/example_responses";
import { getBigIdCases, getStringActionParam, tokenizeStringList } from "../utils/executeService.utils";
import { getLogger } from "log4js";

let mockedGetStringActionParam = getStringActionParam as jest.Mock;
let mockedTokenizeStringList = tokenizeStringList as jest.Mock;
let mockedGetBigIdCases = getBigIdCases as jest.Mock;
let mockedGetLogger = getLogger as jest.Mock;
let mockedLoggerLog = jest.fn();

mockedGetLogger.mockReturnValue({log: mockedLoggerLog});

mockedGetStringActionParam.mockImplementation((executionContext) => {return executionContext.actionParams[0].paramValue});
mockedTokenizeStringList.mockImplementation((list) => {return list.trim().split(/ *, */);})

describe("Testing printBigIdCasesAsJSON...", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should run and then log (all data sources)", async () => {
        const executionContext = fakeExecutionContextGetDSPMCasesAllSources;
        mockedGetBigIdCases.mockResolvedValueOnce({yay: "ahh"});
        await printBigIdCasesAsJSON(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledWith(executionContext, "Data Source Types");
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("all");
        expect(getBigIdCases).toHaveBeenCalledWith(executionContext, undefined);
        expect(mockedLoggerLog).toHaveBeenCalledWith("{\"yay\":\"ahh\"}");
    });
    test("should run and then log (select data sources)", async () => {
        const executionContext = fakeExecutionContextGetDSPMCasesSomeSources;
        mockedGetBigIdCases.mockResolvedValueOnce({yay: "ahh"});
        await printBigIdCasesAsJSON(executionContext);
        expect(mockedGetStringActionParam).toHaveBeenCalledWith(executionContext, "Data Source Types");
        expect(mockedTokenizeStringList).toHaveBeenCalledWith("s3-v2, hooha");
        expect(getBigIdCases).toHaveBeenCalledWith(executionContext, ["s3-v2", "hooha"]);
        expect(mockedLoggerLog).toHaveBeenCalledWith("{\"yay\":\"ahh\"}");
    });
});