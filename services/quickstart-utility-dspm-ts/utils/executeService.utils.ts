import { executeHttpGet, ExecutionContext } from "@bigid/apps-infrastructure-node-js";

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
 * This function calls the BigID DSPM API to retrieve a list of open cases by data source type.
 * @param executionContext A container for the call to the BigID API.
 * @param dataSourceList (Optional) A list of data sources to filter the request. All data sources
 * will be retrieved if undefined.
 * @returns An array of {@link BigIdCase} objects.
 */
export async function getBigIdCases(executionContext: ExecutionContext, dataSourceList?: Array<string>): Promise<BigIdCase[]> {
    var cases = new Array<BigIdCase>();
    var url: string = "actionable-insights/all-cases?requireTotalCount=true";
    var queryFilter: BigIdQuery[] = [{
        field: "caseStatus",
        value: "open",
        operator: "equal"
    }];
    if (dataSourceList) {
        queryFilter.push({
            field: "dataSourceType",
            value: dataSourceList,
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
                if (bigIdCase.numberOfAffectedObjects && bigIdCase.numberOfAffectedObjects > 0) {
                    bigIdCase.affectedObjects = await getAffectedObjects(executionContext, bigIdCase);
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
 * This function gets a list of affected objects for a {@link BigIdCase} from the BigID API.
 * @param executionContext A container for the call to the BigID API.
 * @param bigIdCase A {@link BigIdCase} object.
 * @returns The affected objects of the {@link BigIdCase case} as an array of {@link BigIdObject} objects
 */
export async function getAffectedObjects(executionContext: ExecutionContext, bigIdCase: BigIdCase): Promise<BigIdObject[]> {
    var affectedObjects = new Array<BigIdObject>();
    const queryFilter = `SYSTEM = \"${bigIdCase.dataSourceName}\" AND policy IN (\"${bigIdCase.policyName}\")`;
    //request 32 affected objects with filters: SYSTEM=bigIdCase.dataSourceName AND policy IN (bigIdCase.policyName)
    const url: string = `data-catalog/?format=json&requireTotalCount=true&limit=32&filter=${encodeURIComponent(queryFilter)}`;
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