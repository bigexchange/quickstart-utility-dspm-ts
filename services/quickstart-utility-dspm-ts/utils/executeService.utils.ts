import { executeHttpGet, ExecutionContext } from "@bigid/apps-infrastructure-node-js";
import { doCallToUrl, executeHttpPost, RequestMethod } from "@bigid/apps-infrastructure-node-js/lib/services";
import axios from 'axios';

//ENUMS

/**
 * This enum is used an argument to the {@link getParamValue} function.
 */
export enum ParamType {
    GLOBAL,
    ACTION
}

//INTERFACES

/**
 * This interface represents the structure of a param in the execution context
 * {@link ExecutionContext}
 */
export interface BigIdParam {
    paramName: string,
    paramValue: string
}

/**
 * This interface represents a BigID search query
 */
export interface BigIdQuery {
    field: string,
    value: any,
    operator: string
}

/**
 * This interface represents the format of a BigID policy that is returned from the BigID API. See link for policy format.
 * @link https://api.bigid.com/index-discovery.html#get-/compliance-rules
 */
export interface BigIdPolicy {
    id: string;
    name: string;
    status: string;
    type: string;
    action: string | null;
    allEnabledDs: boolean;
    description: string;
    category: string;
    is_enabled: boolean;
    findings: {
        violated: boolean;
        findingsAmt: number;
        calcDate: string;
    };
    complianceRuleCalc: {
        bigidQuery: string;
        maxFindings: string;
    };
    taskSettings: {
        includeLinkToInventory: boolean;
        includeLinkToCatalog?: boolean; //new field - the new fields are only in the updated bigid instances with dspm
        includeObjectsReport: boolean;
    };
    task: string;
    owner: string;
    displayName?: string; //new field
    tpaAdditionalParams?: any; //new field
    apps?: any; //new field
    presets?: any[]; //new field
    severity?: string; //new field
    actions?: any[]; //new field
}

/**
 * This interface represents the structure of a BigID Case object from the BigID API.
 */
export interface BigIdCase {
    caseStatus: string;
    caseLabel: string;
    policyLastTriggered: string;
    caseType: string;
    dataSourceName: string;
    dataSourceType: string;
    dataSourceOwner: string | null;
    assignee: string;
    policyName: string;
    severityLevel: string;
    policyOwner: string;
    policyType: string;
    compliance: string | null;
    numberOfAffectedObjects: number;
    policyDescription: string;
    caseStatusUpdateDates: {
        open: string;
    };
    created_at: string;
    updated_at: string;
    id: string;
    affectedObjects: BigIdObject[]; //This field does not come from the api call directy - it must be populated manually
    complianceStatus: string; //This field does not come from the api call directy - it must be populated manually
}

/**
 * This interface represents the structure of a BigID catalog object from the data-catolog API.
 */
export interface BigIdObject {
    fullyQualifiedName: string;
    scanner_type_group: string;
    total_pii_count: number;
    owner: string;
    id: string;
    has_duplicates: string;
    fileId: string;
    source: string;
    type: string;
    attribute_original_name: string[];
    attribute_details: {
        name: string;
        friendlyName: string;
        count: number;
        type: string[];
    }[];
    objectType: string;
    extendedObjectType: string;
    open_access: string;
    fullObjectName: string;
    objectName: string;
    objectId: string;
    containerName: string;
    containerId: string;
    subContainerName: string;
    subContainerId: string;
    detailedObjectType: string;
    hierarchyType: string;
    sizeInBytes: number;
    language: string;
    modified_date: string;
    created_date: string;
    last_opened: string;
    update_date: string;
    scanDate: string;
    catalogUpdateTime: string;
    location: string;
    was_scanned: boolean;
    tags: {
        tagId: string;
        valueId: string;
        tagName: string;
        tagValue: string;
        tagType: string;
        properties: {
            applicationType: string;
            hidden: boolean;
            isExplicit?: boolean;
            displayName?: string;
        };
    }[];
    object_owners_struct: any[];
    branchName: string;
    reporter: string;
    reported_date: string;
    comment: string;
    createdBy: string;
    lastUpdatedBy: string;
    lastAccessedBy: string;
    original_owner: string;
    original_created_date: string;
    original_last_opened: string;
    original_modified_date: string;
    messageLink: string;
    attribute: string[];
    application_name: string[];
    last_scanned: string;
    document_type: string;
    ownersList: string[];
    ds_owner: any[];
}

/**
 * This interface represents a data source from the BigID ds_connections API. (It is modeled from the response of
 * an s3-v2 data source)
 */
export interface DsConnection {
    _id: string;
    name: string;
    type: string;
    enabled: string;
    isFromDiscoveryApp: boolean;
    discoveryAppType: string;
    authStrategy: string;
    authenticationProperties: {
        '@authenticationType': string;
        roleResourceName: string;
        roleSessionName: string;
    };
    resourceProperties: {
        resourceEntry: string;
    };
    containerizedFilterType: string;
    containerizedFilter: {
        '@containerizedFilterType': string;
        specificNameFilters: {
            containerUseCase: {
                name: string;
                useCase: string;
            }
        }
    };
    classification_is_enabled: boolean;
    ner_classification_is_enabled: boolean;
    is_idsor_supported: boolean;
    customFields: {
        field_name: string;
        field_type: string;
        field_value: string;
    }[];
    owners_v2: any[];
    enumerationSamplingDropDown: string;
    enumerationSamplingProperties: {
        '@enumerationSamplingType': string;
    };
    contentSamplingDropDown: string;
    contentSamplingProperties: {
        '@contentSamplingType': string;
        percentage: number;
    };
    differentialType: string;
    differentialFilter: {
        '@differentialType': string;
    };
    security_tier: string;
    structured_clustering_enabled: boolean;
    tags: {
        valueId: string;
        tagId: string;
    }[];
    numberOfParsingThreads: string;
    typeRequestProperties: {
        '@requestType': string;
    };
    dsAclScanEnabled: string;
    metadataAclScanEnabled: string;
    ocrParameters: {
        enabledOcr: boolean;
        ocrLanguage: any[];
        ocrTimeout: number;
    };
    created_at: string;
    updated_at: string;
    connectionStatusTest: {
        is_success: boolean;
        last_connection: string;
        num_of_object: number;
    };
    scanWindowName: any[];
    scanner_group: string;
    stopOnEnumerationFailure: boolean;
    defaultScanId: string;
    defaultScanProfileId: string;
    connectionStatusScan: {
        is_success: boolean;
        last_connection: string;
        num_of_object: number;
    };
    last_scan_at: number;
    last_sub_scan_id: string;
    id: string;
    shouldPrintSensitiveData: boolean;
    is_certificate: boolean;
}

/**
 * This interface represents a Tag object from the BigID API.
 */
export interface bigIdTag {
    tagId: string;
    valueId: string;
    tagName: string;
    tagValue: string;
    isMutuallyExclusive: boolean;
    properties: {
        applicationType: string;
        hidden: boolean;
    }
}

/**
 * A fake file interface from the fake API
 */
export interface APIFile {
    id: string;
    path: string;
}

/**
 * This interface represents a response from the backup file endpoint of the fake API.
 */
export interface BackupFileResponse {
    backups_created: any[];
    backups_found: any[];
    num_created: number;
    num_found: number;
}

/**
 * A simple mapping from a BigIdObject to an APIFile
 * @param object A BigID Object.
 * @returns A mapped APIFile object.
 */
export function mapObjectToFile(object: BigIdObject): APIFile {
    return({
        id: object.id,
        path: object.fullyQualifiedName
    });
}

/**
 * This function 'backs up' a list of objects to the fake API.
 * @param executionContext A container for the call to the BigID API.
 * @param objects A list of BigID catalog objects.
 * @returns A BackupFileResponse from the fake API.
 */
export async function backupFilesInFakeAPI(executionContext: ExecutionContext, objects: BigIdObject[]): Promise<BackupFileResponse> {
    const apiToken: string = getStringActionParam(executionContext, "API Token");
    const apiBaseURL: string = getStringActionParam(executionContext, "API Base URL");
    let resp: BackupFileResponse | null = null;
    const fileMap = objects.map((obj) => mapObjectToFile(obj))
    await axios.post(
        apiBaseURL+"files/",
        {
            data: fileMap
        },
        {
            headers: {
                Accept: 'application/json',
                Authorization: "Token "+apiToken
            }
        }
    ).then((response) => {
        resp = response.data;
    }).catch((error: Error) => {
        throw new Error("Error accessing fake API. Message: "+ error);
    })
    if(!resp) {
        throw new Error("There was a problem getting file list from fake API");
    }
    return resp;
}

/**
 * This function calls the BigID DSPM API to retrieve a list of open cases by data source type and policy name.
 * @param executionContext A container for the call to the BigID API.
 * @param dataSourceList A list of data sources to filter the request. All data sources
 * will be retrieved if undefined.
 * @param policyName The name of the policy to filter DSPM cases by.
 * @returns An array of {@link BigIdCase} objects.
 */
export async function getBigIdCases(executionContext: ExecutionContext, dataSourceList: Array<string> | undefined, policyName?: string): Promise<BigIdCase[]> {
    var cases = new Array<BigIdCase>();
    var url: string = "actionable-insights/all-cases?requireTotalCount=true";
    var queryFilter: BigIdQuery[] = [{
        field: "caseStatus",
        value: "open",
        operator: "equal"
    }];
    if(dataSourceList) {
        queryFilter.push({
            field: "dataSourceType",
            value: dataSourceList,
            operator: "in"
        });
    }
    if(policyName) {
        queryFilter.push({
            field: "policyName",
            value: [policyName],
            operator: "in"
        });
    }
    url += `&filter=${encodeURIComponent(JSON.stringify(queryFilter))}`;
    await executeHttpGet(executionContext, url)
        .then(async (response) => {
            if (response.data.data.totalCount === 0) throw new Error(`No BigID cases were found. Please ensure you selected valid data sources. Data sources: ${dataSourceList}.`);
            var dsCache = new Map<string, DsConnection>();
            for (let bigIdCase of response.data.data.cases as BigIdCase[]) {
                bigIdCase.complianceStatus = (await getCompliancePolicy(executionContext, bigIdCase.policyName)).status;
                bigIdCase.affectedObjects = await getAffectedObjects(executionContext, bigIdCase);
                if (bigIdCase.numberOfAffectedObjects && bigIdCase.numberOfAffectedObjects > 0 && bigIdCase.affectedObjects && bigIdCase.affectedObjects.length > 0) {
                    const dsName: string = bigIdCase.affectedObjects[0].source;
                    var dataSource: DsConnection;
                    //cache data sources to reduce run time
                    if (dsCache.has(dsName)) {
                        dataSource = dsCache.get(dsName) as DsConnection; //this is ok because i am checking that the cache has the ds
                    }
                    else {
                        dataSource = await getDataSource(executionContext, dsName);
                        dsCache.set(dsName, dataSource);
                    }
                    cases.push(bigIdCase);
                }
                else {
                    throw new Error(`Open case has no affected objects: ${bigIdCase.caseLabel}`)
                }
            }
        }).catch((error) => {
            throw new Error(`Failed to fetch cases from BigID. ${error}.`)
        })
    return cases;
}

/**
 * This function takes a list of DSPM Cases and remediates all of the cases with no affected objects.
 * @param executionContext A container for the call to the BigID API.
 * @param cases A list of BigID DSPM cases.
 * @param remediationMessage The message describing the reason for remediation.
 * @returns The number of remediated cases.
 */
export async function remediateCasesWithNoAffectedObjects(executionContext: ExecutionContext, cases: BigIdCase[], remediationMessage: string): Promise<number> {
    //first, update the affected objects as they may have changed
    let noAffectedObjects: BigIdCase[] = [];
    for(let bigIdCase of cases) {
        bigIdCase.affectedObjects = await getAffectedObjects(executionContext, bigIdCase);
        if(bigIdCase.affectedObjects.length === 0)
            noAffectedObjects.push(bigIdCase)
    }

    //now, remediate the cases with no affected objects
    return await batchUpdateCaseStatusInBigId(executionContext, noAffectedObjects, "remediated", remediationMessage);
}

/**
 * This function gets a list of affected objects for a {@link BigIdCase} from the BigID API.
 * @param executionContext A container for the call to the BigID API.
 * @param bigIdCase A {@link BigIdCase} object.
 * @returns The affected objects of the {@link BigIdCase case} as an array of {@link BigIdObject} objects
 */
export async function getAffectedObjects(executionContext: ExecutionContext, bigIdCase: BigIdCase): Promise<BigIdObject[]> {
    var affectedObjects = new Array<BigIdObject>();
    const queryFilter = `SYSTEM = \"${bigIdCase.dataSourceName}\" AND policy IN (\"${bigIdCase.policyName}\")`;
    //request affected objects with filters: SYSTEM=bigIdCase.dataSourceName AND policy IN (bigIdCase.policyName)
    const url: string = `data-catalog/?format=json&requireTotalCount=true&filter=${encodeURIComponent(queryFilter)}`;
    await executeHttpGet(executionContext, url).then((response) => {
        for (let affectedObject of response.data.results as BigIdObject[]) {
            affectedObjects.push(affectedObject);
        }
    }).catch((error) => {
        throw new Error(`Failed to fetch affected objects from BigID. API Status: ${error}.`);
    });
    return affectedObjects;
}

/**
 * This function takes an array of {@link BigIdCase BigID cases} and updates their case status one by one.
 * @param executionContext A container for the call to the BigID API.
 * @param bigIdCaseArray An array of {@link BigIdCase} objects with updated case status values.
 * @param caseStatus The new status of the case. Either "open", "acknowledged", "silenced", or "remediated".
 * @param message The remediation message.
 * @returns The number of updated cases.
 */
export async function batchUpdateCaseStatusInBigId(executionContext: ExecutionContext, bigIdCaseArray: BigIdCase[], caseStatus: string, message: string): Promise<number> {
    var totalUpdated: number = 0;
    for (const bigIdCase of bigIdCaseArray) {
        await updateCaseStatusInBigId(executionContext, bigIdCase.id, caseStatus, message);
        totalUpdated++;
    }
    return totalUpdated;
}

/**
 * This function makes a PATCH request to the BigID actionable insights API to update the status of a DSPM case.
 * @param executionContext A container for the call to the BigID API.
 * @param caseId The ID of the case to update.
 * @param caseStatus The new status of the case. Either "open", "acknowledged", "silenced", or "remediated".
 * @param message The remediation message.
 */
export async function updateCaseStatusInBigId(executionContext: ExecutionContext, caseId: string, caseStatus: string, message: string): Promise<void> {
    await doCallToUrl(executionContext.bigidToken, RequestMethod.PATCH, `${executionContext.bigidBaseUrl}actionable-insights/case-status/${caseId}`,
        {
            caseStatus: caseStatus,
            auditReason: message
        }
    ).then((response) => {
        if (response.status === 200) {
            return;
        }
        else {
            throw new Error(`Failed to retrieve case from BigID. Status: ${response.status}`);
        }
    }).catch((error) => {
        throw new Error(`Failed to update case status in BigId. Message: ${error}`);
    })
}

/**
 * This function makes a GET request to the BigID API 'compliance-rules' endpoint and returns the policy with the specified name.
 * @param policyName The name of the policy to retrieve as a string.
 * @returns A {@link BigIdPolicy} object.
 */
export async function getCompliancePolicy(executionContext: ExecutionContext, policyName: string): Promise<BigIdPolicy> {
    let policy: BigIdPolicy | null = null;
    await executeHttpGet(executionContext, `compliance-rules?name=${policyName}`)
        .then((response) => {
            if (response.data[0]) {
                policy = response.data[0] as BigIdPolicy;
            }
            else {
                throw new Error(`BigID API found no policies with name: ${policyName}.`);
            }
    }).catch((error) => {
        throw new Error(`Failed to fetch policies from BigID. API Status: ${error}.`)
    });
    if(policy === null) {
        throw new Error(`Something went wrong getting policy.`);
    }
    return policy;
}

/**
 * This function gets a data source from the BigID ds_connections API
 * @param executionContext A container for the call to the BigID API.
 * @param dataSourceName The name of the data source to retrieve.
 * @returns A {@link DsConnection} object.
 */
export async function getDataSource(executionContext: ExecutionContext, dataSourceName: string): Promise<DsConnection> {
    var dataSource: DsConnection | null = null;
    await executeHttpGet(executionContext, `ds_connections/${dataSourceName}`)
        .then((response) => {
        if (response.status === 200 && response.data.ds_connection) {
            dataSource = response.data.ds_connection as DsConnection;
        }
        else {
            throw new Error(`Bad response from BigID API. Status: ${response.status}.`);
        }
    })
    .catch((error) => {
        throw new Error(`Failed to get data source with name ${dataSourceName}. ${error}`);
    });
    if(dataSource === null) {
        throw new Error(`Unexpected error occured while getting data source.`);
    }
    return dataSource;
}

/**
 * This function looks up a BigID tag by its human-readable name and value. Throws an error if not found.
 * @param executionContext A container for the call to the BigID API.
 * @param tagName The human-readable name of the tag to assign.
 * @param tagValue The human-readable value of the tag to assign.
 * @returns A BigIdTag object, if found.
 */
export async function getTagIdsByNameAndValue(executionContext: ExecutionContext, tagName: string, tagValue: string): Promise<bigIdTag> {
    let outTag: bigIdTag | undefined = undefined;
    await executeHttpGet(executionContext, `data-catalog/tags/all-pairs?search=${tagName}`)
    .then((response) => {
        if(response.status === 200) {
            outTag = response.data.data.find((tag: bigIdTag) => tag.tagValue === tagValue);
        }
        else {
            throw new Error(`Bad response from BigID API. Status: ${response.status}.`);
        }
    }).catch((error) => {
        throw new Error(`Failed to get tag with name ${tagName}. ${error}`);
    })
    if(outTag === undefined) {
        throw new Error(`Tag with name ${tagName} and value ${tagValue} not found. Please ensure you selected the correct tag name and value.`);
    }
    return outTag;
}

/**
 * This function assigns a tag to a catalog object.
 * @param executionContext A container for the call to the BigID API.
 * @param tagId The alphanumerical ID for the tag to set.
 * @param valueId The alphanumerical value ID for the tag to set.
 * @param dsSource The name of the data source for the object to tag.
 * @param fullyQualifiedName The fully qualified name of the object to tag.
 * @returns the number of successfully tagged objects.
 */
export async function setTags(executionContext: ExecutionContext, tagId: string, valueId: string, dsSource: string, fullyQualifiedName: string): Promise<number> {
    let modifiedCount = -1;
    const body = {
        "data": [{
            "tags": [
                {
                "tagId": tagId,
                "valueId": valueId
                }
            ],
            "type": "OBJECT",
            "source": dsSource,
            "fullyQualifiedName": fullyQualifiedName
        }]
    };
    await executeHttpPost(executionContext, "data-catalog/manual-fields/tags",
       body 
    ).then((response) => {
        if (response.status === 201 && response.data.data.errors.length == 0) {
            modifiedCount = response.data.data.modified_count
        }
        else {
            throw new Error(`Bad response from BigID API. Status: ${response.status}. Errors: ${JSON.stringify(response.data.data.errors)}.`);
        }
    })
    .catch((error) => {
        throw new Error(`Failed to update tags for object ${fullyQualifiedName}. ${error.message}`);
    });
    return modifiedCount;
}

/**
 * This function assigns a tag to each object in the given list of catalog objects.
 * @param executionContext A container for the call to the BigID API.
 * @param tagName The human-readable name of the tag to assign.
 * @param tagValue The human-readable value of the tag to assign.
 * @param objects A list of BigIdObject objects to be tagged.
 * @returns the number of successfully tagged objects.
 */
export async function setTagsOnObjects(executionContext: ExecutionContext, tagName: string, tagValue: string, objects: BigIdObject[]): Promise<number> {
    const tag = await getTagIdsByNameAndValue(executionContext, tagName, tagValue);
    let modifiedCount = 0;
    for(const object of objects) {
        modifiedCount += await setTags(executionContext, tag.tagId, tag.valueId, object.source, object.fullyQualifiedName);
    }
    return modifiedCount;
}

/**
 * This function trims and tokenizes a string containing a comma separated list
 * @param list a string containing a comma separated list.
 * @returns an array of strings containing the tokens from list.
 */
export function tokenizeStringList(list: string): Array<string> {
    return list.trim().split(/ *, */);
}

/**
 * This is a lookup function that searches the {@link executionContext} for a parameter name and returns the corresponding parameter value.
 * @param executionContext A container for the call to the BigID API.
 * @param paramName The name of the parameter to look up.
 * @param type A {@link ParamType} object that determines whether to look up a global or an action param.
 * @returns The value of the corresponsing {@link paramName}, or undefined.
 */
export function getParamValue(executionContext: ExecutionContext, paramName: string, type: ParamType): string | undefined {
    const param = (type == ParamType.ACTION) ? (executionContext.actionParams as any as Array<BigIdParam>).find(par => par.paramName == paramName) : (executionContext.globalParams as any as Array<BigIdParam>).find(par => par.paramName == paramName);
    return param ? param.paramValue : undefined;
}

/**
 * This is a lookup function that searches the {@link executionContext} for a parameter name and returns the corresponding parameter value as a string by calling {@link getParamValue}.
 * @param executionContext A container for the call to the BigID API.
 * @param paramName The name of the parameter to look up.
 * @param type A {@link ParamType} object that determines whether to look up a global or an action param.
 * @returns The value of the corresponsing {@link paramName}, or an empty string if undefined.
 */
export function getStringParam(executionContext: ExecutionContext, paramName: string, type: ParamType): string {
    const param: string | undefined = getParamValue(executionContext, paramName, type);
    return (param != undefined) ? param : "";
}

/**
 * This is a lookup function that searches the {@link executionContext} for a action parameter name and returns the corresponding parameter value as a string.
 * @param executionContext A container for the call to the BigID API.
 * @param paramName The name of the parameter to look up.
 * @returns The value of the corresponsing {@link paramName}, or an empty string if undefined.
 */
export function getStringActionParam(executionContext: ExecutionContext, paramName: string): string {
    return getStringParam(executionContext, paramName, ParamType.ACTION);
}