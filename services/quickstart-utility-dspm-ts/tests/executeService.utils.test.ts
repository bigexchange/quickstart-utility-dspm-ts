jest.mock('@bigid/apps-infrastructure-node-js');

import { BigIdCase, BigIdPolicy, DsConnection, ParamType, getAffectedObjects, getBigIdCases, getCompliancePolicy, getDataSource, getParamValue, getStringActionParam, getStringParam, tokenizeStringList } from "../utils/executeService.utils";
import { fakeAllCasesResponse_200, fakeAllCasesResponse_200_noAffectedObjects, fakeBigIdCase, fakeBigIdObject, fakeComplianceRulesResponse_200, fakeComplianceRulesResponse_401, fakeComplianceRulesResponseBadName_200, fakeDataSourceResponse_200, fakeExecutionContextGetDSPMCasesAllSources } from "../static/example_responses";
import { executeHttpGet } from "@bigid/apps-infrastructure-node-js";

let mockedExecuteHttpGet = executeHttpGet as jest.Mock;

const executionContext = fakeExecutionContextGetDSPMCasesAllSources;

describe("Testing getParamValue", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("valid action param should return string", () => {
        const value = getParamValue(executionContext, "Data Source Types", ParamType.ACTION);
        expect(value).toBe("all");
    });
    test("invalid action param should return undefined", () => {
        const value = getParamValue(executionContext, "gabesw", ParamType.ACTION);
        expect(value).toBeUndefined();
    });
    test("valid global param should return string", () => {
        const value = getParamValue(executionContext, "EXAMPLE_PARAM", ParamType.GLOBAL);
        expect(value).toBe("woloz");
    });
    test("invalid global param should return undefined", () => {
        const value = getParamValue(executionContext, "gwoloz", ParamType.GLOBAL);
        expect(value).toBeUndefined();
    });
});
describe("Testing getStringParam", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("valid action param should return string", () => {
        const value = getStringParam(executionContext, "Data Source Types", ParamType.ACTION);
        expect(value).toBe("all");
    });
    test("invalid action param should return empty string", () => {
        const value = getStringParam(executionContext, "gabesw", ParamType.ACTION);
        expect(value).toBe("");
    });
    test("valid global param should return string", () => {
        const value = getStringParam(executionContext, "EXAMPLE_PARAM", ParamType.GLOBAL);
        expect(value).toBe("woloz");
    });
    test("invalid global param should return expty string", () => {
        const value = getStringParam(executionContext, "gwoloz", ParamType.GLOBAL);
        expect(value).toBe("");
    });
});
describe("Testing getStringActionParam", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("Get Data Sources from action params should return s3-v2", () => {
        expect(getStringActionParam(executionContext, "Data Source Types")).toBe("all");
    });
    test("Get invalid param from action params should return en empty string", () => {
        expect(getStringActionParam(executionContext, "Foobar")).toBe("");
    });
});
describe("Testing tokenizeStringList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("spam  ,   ham,   eggs,foo ,bar should return an array of strings with each item in the list", () => {
        const stringArr = "spam  ,   ham,   eggs,foo ,bar";
        expect(tokenizeStringList(stringArr)).toEqual(["spam", "ham", "eggs", "foo", "bar"]);
    });
});
describe("Testing getAffectedObjects", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockBigIdCase = fakeBigIdCase;
    test('should return the affected objects when the response is successful', async () => {
        const mockResponse = { status: 200, data: { results: ['mockedObject1', 'mockedObject2'] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        const result = await getAffectedObjects(executionContext, mockBigIdCase);
        expect(result).toEqual(mockResponse.data.results);
    });
    test('should throw an error when the status is not 200', async () => {
        const mockResponse = { status: 404, data: 'Not Found' };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        await expect(getAffectedObjects(executionContext, mockBigIdCase)).rejects.toThrow(`Failed to fetch affected objects from BigID. API Status: TypeError: response.data.results is not iterable.`);
    });
    test('should throw an error when axios request fails', async () => {
        mockedExecuteHttpGet.mockRejectedValueOnce(new Error('Network Error'));
        await expect(getAffectedObjects(executionContext, mockBigIdCase)).rejects.toThrow('Network Error');
    });
});
describe("Testing getBigIdCases", () => {
    let hasSpy: jest.SpyInstance, setSpy: jest.SpyInstance, getSpy: jest.SpyInstance;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(() => {
        hasSpy = jest.spyOn(Map.prototype, "has");
        setSpy = jest.spyOn(Map.prototype, "set");
        getSpy = jest.spyOn(Map.prototype, "get");
    });
    afterAll(() => {
        hasSpy.mockRestore();
        setSpy.mockRestore();
        getSpy.mockRestore();
    });
    test("testing sucessful response with data sources", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeAllCasesResponse_200);
        //set up tests for indirect call to getCompliancePolicy
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_200);
        //set up tests for indirect call to getAffectedObjects
        const mockResponse = { status: 200, data: { results: [fakeBigIdObject] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        //set up tests for indirect call to getDataSource
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeDataSourceResponse_200);
        
        const dataSourceList = ["s3-v2"];
        const result = await getBigIdCases(executionContext, dataSourceList);
        //expectations
        let expectedCaseResponse = fakeAllCasesResponse_200.data.data.cases[0] as BigIdCase;
        expect(result).toEqual([expectedCaseResponse]);
        expect(setSpy).toHaveBeenCalled();
        expect(hasSpy).toHaveLastReturnedWith(false);
        expect(getSpy).not.toHaveBeenCalled();
    });
    test("testing sucessful response with ds in cache", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeAllCasesResponse_200);
        //set up tests for indirect call to getCompliancePolicy
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_200);
        //set up tests for indirect call to getAffectedObjects
        const mockResponse = { status: 200, data: { results: [fakeBigIdObject] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        //set up tests for indirect call to getDataSource
        //mockedExecuteHttpGet.mockResolvedValueOnce(fakeDataSourceResponse_200);
        //mock the has and get calls to dsCache
        hasSpy.mockReturnValueOnce(true);
        getSpy.mockReturnValueOnce({});

        const dataSourceList = ["s3-v2"];
        const result = await getBigIdCases(executionContext, dataSourceList);
        //expectations
        let expectedCaseResponse = fakeAllCasesResponse_200.data.data.cases[0] as BigIdCase;
        expect(result).toEqual([expectedCaseResponse]);
    });
    test("testing sucessful response with no resourceProperties or authenticationProperties fields", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeAllCasesResponse_200);
        //set up tests for indirect call to getCompliancePolicy
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_200);
        //set up tests for indirect call to getAffectedObjects
        const mockResponse = { status: 200, data: { results: [fakeBigIdObject] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        //set up tests for indirect call to getDataSource
        let dataSourceResponse = structuredClone(fakeDataSourceResponse_200);
        dataSourceResponse.data.ds_connection.resourceProperties = null as any;
        dataSourceResponse.data.ds_connection.authenticationProperties = null as any;
        mockedExecuteHttpGet.mockResolvedValueOnce(dataSourceResponse);
        
        const dataSourceList = ["s3-v2"];
        const result = await getBigIdCases(executionContext, dataSourceList);
        //expectations
        let expectedCaseResponse = fakeAllCasesResponse_200.data.data.cases[0] as BigIdCase;
        expect(result).toEqual([expectedCaseResponse]);
        expect(setSpy).toHaveBeenCalled();
        expect(hasSpy).toHaveLastReturnedWith(false);
        expect(getSpy).not.toHaveBeenCalled();
    });
    test("should throw error when no affected objects", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeAllCasesResponse_200_noAffectedObjects);
        //set up tests for indirect call to getCompliancePolicy
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_200);
        
        const dataSourceList = ["s3-v2"];
        await expect(getBigIdCases(executionContext, dataSourceList)).rejects.toThrow("Open case has no affected objects: Passwords detected on s3-v2.");
    });
    test("should throw error when totalCount is 0", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce({data: {data: {totalCount: 0}}});
        
        const dataSourceList = ["s3-v2"];
        await expect(getBigIdCases(executionContext, dataSourceList)).rejects.toThrow(`No BigID cases were found. Please ensure you selected valid data sources. Data sources: ${dataSourceList}.`);
    });
    test("failed executeHttpGet request should be caught and thrown", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockRejectedValueOnce(new Error("axios error"));

        const dataSourceList = ["s3-v2"];
        //expectations
        await expect(getBigIdCases(executionContext, dataSourceList)).rejects.toThrow("axios error");
    });
    test("non 200 response should throw an error", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_401);

        const dataSourceList = ["s3-v2"];
        //expectations
        await expect(getBigIdCases(executionContext, dataSourceList)).rejects.toThrow("Failed to fetch cases from BigID. TypeError: Cannot read properties of null (reading 'data').");
    });
});
describe("Testing getCompliancePolicy", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("testing with 200 response", async () => {
        const mockedExecuteHttpGetResponse = fakeComplianceRulesResponse_200;
        mockedExecuteHttpGet.mockResolvedValueOnce(mockedExecuteHttpGetResponse);
        const response = await getCompliancePolicy(executionContext, "policyName");
        expect(response).toEqual(mockedExecuteHttpGetResponse.data[0] as any as BigIdPolicy);
    });
    test("testing with 200 response and invalid policy name", async () => {
        const mockedExecuteHttpGetResponse = fakeComplianceRulesResponseBadName_200;
        mockedExecuteHttpGet.mockResolvedValueOnce(mockedExecuteHttpGetResponse);
        await expect(getCompliancePolicy(executionContext, "gabesPolicy")).rejects.toThrow("BigID API found no policies with name: gabesPolicy.");
    });
    test("testing with 401 response and invalid policy name", async () => {
        const mockedExecuteHttpGetResponse = fakeComplianceRulesResponse_401;
        mockedExecuteHttpGet.mockResolvedValueOnce(mockedExecuteHttpGetResponse);
        await expect(getCompliancePolicy(executionContext, "gabesPolicy")).rejects.toThrow("Failed to fetch policies from BigID. API Status: TypeError: Cannot read properties of null (reading '0').");
    });
    test("should throw error with null policy", async () => {
        mockedExecuteHttpGet.mockImplementationOnce(() => ({
            then: jest.fn().mockReturnThis(),
            catch: jest.fn()
        }));
        await expect(getCompliancePolicy(executionContext, "gabesPolicy")).rejects.toThrow("Something went wrong getting policy.");
    });
});
describe("Testing getDataSource", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("testing with 200 response", async () => {
        const mockedExecuteHttpGetResponse = fakeDataSourceResponse_200;
        mockedExecuteHttpGet.mockResolvedValueOnce(mockedExecuteHttpGetResponse);
        const response = await getDataSource(executionContext, "name");
        expect(mockedExecuteHttpGet).toHaveBeenCalled();
        expect(response).toEqual(mockedExecuteHttpGetResponse.data.ds_connection as DsConnection);
    });
    test("testing with 400 error", async () => {
        const mockedExecuteHttpGetResponse = {
            status: 400,
            data: {}
        };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockedExecuteHttpGetResponse);
        await expect(getDataSource(executionContext, "gabe")).rejects.toThrow("Bad response from BigID API. Status: 400.");
    });
    test("testing with unknown error", async () => {
        mockedExecuteHttpGet.mockRejectedValueOnce("ramalamadingdong");
        await expect(getDataSource(executionContext, "gabe")).rejects.toThrow("Failed to get data source with name gabe. ramalamadingdong");
    });
    test("should throw error if dataSource is null", async () => {
        mockedExecuteHttpGet.mockImplementationOnce(() => ({
            then: jest.fn().mockReturnThis(),
            catch: jest.fn()
        }));
        await expect(getDataSource(executionContext, "gabe")).rejects.toThrow("Unexpected error occured while getting data source.");
    });
});