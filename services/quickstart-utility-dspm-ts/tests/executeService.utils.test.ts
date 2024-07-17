jest.mock('@bigid/apps-infrastructure-node-js');
jest.mock("@bigid/apps-infrastructure-node-js/lib/services");
jest.mock("axios");

import { BigIdCase, BigIdPolicy, DsConnection, ParamType, backupFilesInFakeAPI, getAffectedObjects, getBigIdCases, getCompliancePolicy, getDataSource, getParamValue, getStringActionParam, getStringParam, getTagIdsByNameAndValue, mapObjectToFile, remediateCasesWithNoAffectedObjects, setTags, setTagsOnObjects, tokenizeStringList, updateCaseStatusInBigId } from "../utils/executeService.utils";
import { fakeAllCasesResponse_200, fakeAllCasesResponse_200_noAffectedObjects, fakeBackupFileResponse, fakeBigIdCase, fakeBigIdObject, fakeComplianceRulesResponse_200, fakeComplianceRulesResponse_401, fakeComplianceRulesResponseBadName_200, fakeDataSourceResponse_200, fakeExecutionContextBackupFilesAllSources, fakeAllPairsResponse, fakeTagsResponse } from "../static/example_responses";
import { executeHttpGet } from "@bigid/apps-infrastructure-node-js";
import { doCallToUrl, executeHttpPost, RequestMethod } from "@bigid/apps-infrastructure-node-js/lib/services";
import axios from "axios";

let mockedExecuteHttpGet = executeHttpGet as jest.Mock;
let mockedExecuteHttpPost = executeHttpPost as jest.Mock;
let mockedAxiosPost = axios.post as jest.Mock;
let mockedDoCallToUrl = doCallToUrl as jest.Mock;

const executionContext = fakeExecutionContextBackupFilesAllSources;

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
        const result = await getBigIdCases(executionContext, dataSourceList, "A Policy");
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
        const result = await getBigIdCases(executionContext, dataSourceList, "A Policy");
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
        const result = await getBigIdCases(executionContext, dataSourceList, "A Policy");
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
        //set up tests for indirect call to getAffectedObjects
        const mockResponse = { status: 200, data: { results: [] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockResponse);
        
        const dataSourceList = ["s3-v2"];
        await expect(getBigIdCases(executionContext, dataSourceList, "A Policy")).rejects.toThrow("Open case has no affected objects: Passwords detected on s3-v2.");
    });
    test("should throw error when totalCount is 0", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce({data: {data: {totalCount: 0}}});
        
        const dataSourceList = ["s3-v2"];
        await expect(getBigIdCases(executionContext, dataSourceList, "A Policy")).rejects.toThrow(`No BigID cases were found. Please ensure you selected valid data sources. Data sources: ${dataSourceList}.`);
    });
    test("failed executeHttpGet request should be caught and thrown", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockRejectedValueOnce(new Error("axios error"));

        const dataSourceList = ["s3-v2"];
        //expectations
        await expect(getBigIdCases(executionContext, dataSourceList, "A Policy")).rejects.toThrow("axios error");
    });
    test("non 200 response should throw an error", async () => {
        //Order of axios calls: getBigIdCases, getCompliancePolicy, getAffectedObjects, getDataSource
        //set up tests for getBigIdCases
        mockedExecuteHttpGet.mockResolvedValueOnce(fakeComplianceRulesResponse_401);

        const dataSourceList = ["s3-v2"];
        //expectations
        await expect(getBigIdCases(executionContext, dataSourceList, "A Policy")).rejects.toThrow("Failed to fetch cases from BigID. TypeError: Cannot read properties of null (reading 'data').");
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
describe("Testing mapObjectToFile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should map object to file", () => {
        const object = fakeBigIdObject;
        const file = mapObjectToFile(object);
        expect(file).toStrictEqual({
            id: object.id,
            path: object.fullyQualifiedName
        });
    });
});
describe("Testing backupFilesInFakeAPI", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should contact API and return response", async () => {
        const objects = [fakeBigIdObject];
        mockedAxiosPost.mockResolvedValueOnce({data: fakeBackupFileResponse});
        const resp = await backupFilesInFakeAPI(executionContext, objects);
        expect(mockedAxiosPost).toHaveBeenCalledWith(
            "api.gabe.org/files/",
            {
                data: [{
                    id: objects[0].id,
                    path: objects[0].fullyQualifiedName
                }]
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Token abc123gabewoloz"
                }
            }
        )
        expect(resp).toStrictEqual(fakeBackupFileResponse);
    });
    test("should catch and throw axios error", async () => {
        const objects = [fakeBigIdObject];
        mockedAxiosPost.mockRejectedValueOnce(new Error("wahh"));
        await expect(backupFilesInFakeAPI(executionContext, objects)).rejects.toThrow("Error accessing fake API. Message: Error: wahh");
    });
    test("should catch and throw null error", async () => {
        const objects = [fakeBigIdObject];
        mockedAxiosPost.mockResolvedValueOnce({});
        await expect(backupFilesInFakeAPI(executionContext, objects)).rejects.toThrow("There was a problem getting file list from fake API");
    });
});
describe("Testing updateCaseStatusInBigId", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return if status is 200", async () => {
        const mockUpdateCaseSatusResponse = { status: 200 };
        mockedDoCallToUrl.mockResolvedValueOnce(mockUpdateCaseSatusResponse);
        
        await updateCaseStatusInBigId(executionContext, "id", "open", "beeb");
        expect(mockedDoCallToUrl).toHaveBeenCalledWith(
            executionContext.bigidToken,
            RequestMethod.PATCH,
            `${executionContext.bigidBaseUrl}actionable-insights/case-status/id`,
            {
                caseStatus: "open",
                auditReason: "beeb"
            }
        );
    });
    test("should err if status is not 200", async () => {
        const mockUpdateCaseSatusResponse = { status: 418 };
        mockedDoCallToUrl.mockResolvedValueOnce(mockUpdateCaseSatusResponse);
        
        await expect(updateCaseStatusInBigId(executionContext, "id", "open", "beeb")).rejects.toThrow("Failed to retrieve case from BigID. Status: 418");
    });
    test("should catch and throw axios error", async () => {
        mockedDoCallToUrl.mockRejectedValueOnce(new Error("I'm a teapot"));
        
        await expect(updateCaseStatusInBigId(executionContext, "id", "open", "beeb")).rejects.toThrow("Failed to update case status in BigId. Message: Error: I'm a teapot");
    });
});
describe("Testing remediateCasesWithNoAffectedObjects", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return 0 when there are affected objects on the case", async () => {
        const cases = [fakeBigIdCase];

        //first indirectly mock getAffectedObjects
        const mockAffectedObjectsResponse = { status: 200, data: { results: [fakeBigIdObject] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockAffectedObjectsResponse);

        //now indirectly mock batchUpdateCaseStatusInBigId
        //so we also indiretly mock updateCaseStatusInBigId
        const mockUpdateCaseSatusResponse = { status: 200 };
        mockedDoCallToUrl.mockResolvedValueOnce(mockUpdateCaseSatusResponse);

        const num = await remediateCasesWithNoAffectedObjects(executionContext, cases, "be gone with you!");
        expect(num).toBe(0);
    });
    test("should return 1 when there are no affected objects on the case", async () => {
        const cases = [fakeBigIdCase];

        //first indirectly mock getAffectedObjects
        const mockAffectedObjectsResponse = { status: 200, data: { results: [] } };
        mockedExecuteHttpGet.mockResolvedValueOnce(mockAffectedObjectsResponse);

        //now indirectly mock batchUpdateCaseStatusInBigId
        //so we also indiretly mock updateCaseStatusInBigId
        const mockUpdateCaseSatusResponse = { status: 200 };
        mockedDoCallToUrl.mockResolvedValueOnce(mockUpdateCaseSatusResponse);

        const num = await remediateCasesWithNoAffectedObjects(executionContext, cases, "be gone with you!");
        expect(num).toBe(1);
    });
});
describe("Testing getTagIdsByNameAndValue", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return a matching tag object if tag is found", async () => {
        const response = fakeAllPairsResponse;
        mockedExecuteHttpGet.mockResolvedValueOnce({status: 200, data: response});
        
        const tag = await getTagIdsByNameAndValue(executionContext, "hasBackup", "False");
        expect(tag).toBe(response.data[0]);
    });
    test("should err if status is not 200", async () => {
        mockedExecuteHttpGet.mockResolvedValueOnce({status: 418});
        
        await expect(getTagIdsByNameAndValue(executionContext, "hasBackup", "False")).rejects.toThrow("Bad response from BigID API. Status: 418");
    });
    test("should catch and throw axios error", async () => {
        mockedExecuteHttpGet.mockRejectedValueOnce(new Error("nahhh"));
        
        await expect(getTagIdsByNameAndValue(executionContext, "hasBackup", "False")).rejects.toThrow("Failed to get tag with name hasBackup. Error: nahhh");
    });
    test("should throw error if tag was not found/undefined", async () => {
        const response = fakeAllPairsResponse;
        mockedExecuteHttpGet.mockResolvedValueOnce({status: 200, data: response});
        
        await expect(getTagIdsByNameAndValue(executionContext, "bing", "bong")).rejects.toThrow("Tag with name bing and value bong not found. Please ensure you selected the correct tag name and value.");
    });
});
describe("Testing setTags", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return modified count", async () => {
        const response = fakeTagsResponse;
        mockedExecuteHttpPost.mockResolvedValueOnce({status: 201, data: response});

        const modifiedCount = await setTags(executionContext, "id123abc", "value123abc", "source", "fullname");
        expect(modifiedCount).toBe(1);
    });
    test("should throw error if bad status", async () => {
        mockedExecuteHttpPost.mockResolvedValueOnce({status: 418, data: {data: {errors: []}}});

        await expect(setTags(executionContext, "id123abc", "value123abc", "source", "fullname")).rejects.toThrow("Failed to update tags for object fullname. Bad response from BigID API. Status: 418. Errors: [].");
    });
});
describe("Testing setTagsOnObjects", () => {
    const executionContext = fakeExecutionContextBackupFilesAllSources;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return modified count", async () => {
        //first we must indirectly mock getTagIdsByNameAndValue
        const response_get = fakeAllPairsResponse;
        mockedExecuteHttpGet.mockResolvedValueOnce({status: 200, data: response_get});

        //now me indirectly mock setTags
        const response_set = fakeTagsResponse;
        mockedExecuteHttpPost.mockResolvedValueOnce({status: 201, data: response_set});

        const count = await setTagsOnObjects(executionContext, "hasBackup", "False", [fakeBigIdObject]);
        expect(count).toBe(1);
    });
});