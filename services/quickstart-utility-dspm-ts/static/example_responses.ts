import { ExecutionContext } from "@bigid/apps-infrastructure-node-js";
import { Response } from "express";
import { BigIdCase, BigIdObject } from "../utils/executeService.utils";

/**
 * A mock executionContext for testing.
 */
export const fakeExecutionContextGetDSPMCasesAllSources: ExecutionContext = {
    "actionName": "Get DSPM Cases",
    "executionId": "1111",
    "globalParams": [{
        "paramName": "EXAMPLE_PARAM",
        "paramValue": "woloz"
    }],
    "actionParams": [{
        "paramName": "Data Source Types",
        "paramValue": "all"
    }],
    "bigidToken": "3333",
    "bigidBaseUrl": "https://bigidapi/api/v1/",
    "tpaId": "4444"
} as any as ExecutionContext;

/**
 * A mock executionContext for testing.
 */
export const fakeExecutionContextGetDSPMCasesSomeSources: ExecutionContext = {
    "actionName": "Get DSPM Cases",
    "executionId": "1111",
    "globalParams": [{
        "paramName": "EXAMPLE_PARAM",
        "paramValue": "woloz"
    }],
    "actionParams": [{
        "paramName": "Data Source Types",
        "paramValue": "s3-v2, hooha"
    }],
    "bigidToken": "3333",
    "bigidBaseUrl": "https://bigidapi/api/v1/",
    "tpaId": "4444"
} as any as ExecutionContext;

export const fakeExecutionContextBadAction: ExecutionContext = {
    "actionName": "foo",
    "executionId": "1111",
    "globalParams": [{
        "paramName": "EXAMPLE_PARAM",
        "paramValue": "woloz"
    }],
    "actionParams": [{
        "paramName": "Sample Selection Parameter",
        "paramValue": "True"
    },
    {
        "paramName": "Sample Input Parameter",
        "paramValue": "woloz"
    }],
    "bigidToken": "3333",
    "bigidBaseUrl": "https://bigidapi/api/v1/",
    "tpaId": "4444"
} as any as ExecutionContext;

export const mockResponse = () => {
    const res = {} as Response;
    // replace the following () => res
    // with your function stub/mock of choice
    // making sure they still return `res`
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
};


/**
 * A fake BigID DSPM case, without the manually added fields
 */
export const fakeBigIdCase = {
    caseStatus: 'open',
    caseLabel: 'GDPR - Personal Sensitive detected on s3-v2',
    policyLastTriggered: '2023-06-21T17:27:55.980Z',
    caseType: 'dataSourcePolicyCase',
    dataSourceName: 's3 west documents',
    dataSourceType: 's3-v2',
    dataSourceOwner: "gabesw16",
    assignee: 'bigidadmin',
    policyName: 'GDPR - Personal Sensitive',
    severityLevel: 'medium',
    policyOwner: 'bigidadmin',
    policyType: 'catalog',
    compliance: 'GDPR',
    numberOfAffectedObjects: 49,
    policyDescription: "The EU's General Data Protection Regulation (GDPR) defines 'personal data' as information relating to an identified or identifiable natural person. This includes such personal sensitive information as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.",
    caseStatusUpdateDates: { open: '2023-06-21T08:30:29.075Z' },
    created_at: '2023-06-21T08:30:29.076Z',
    updated_at: '2023-06-22T08:00:08.970Z',
    id: '9999a999999aa9999a99a999'
} as any as BigIdCase;

/**
 * A fake BigID object for testing.
 */
export const fakeBigIdObject = {
    fullyQualifiedName: 's3 west documents.bigid-presaleswest-sandbox-pub/documents/RFI/031518_wifi-rfi.pdf',
    scanner_type_group: 'unstructured',
    total_pii_count: 38,
    owner: 'Morris Williams, III',
    id: '6492b505fff133057d0893c7',
    has_duplicates: 'No',
    fileId: '031518_wifi-rfi.pdf',
    source: 's3 west documents',
    type: 's3-v2',
    attribute_original_name: ['classifier.Email', 'classifier.email #2'],
    attribute_details: [
        {
            name: 'classifier.Email',
            friendlyName: 'classifier.Email',
            count: 2,
            type: ['Prediction', 'Classification'],
        },
        {
            name: 'classifier.email #2',
            friendlyName: 'classifier.email #2',
            count: 2,
            type: ['Classification', 'Prediction'],
        },
    ],
    objectType: 'FILE',
    extendedObjectType: 'UNSTRUCTURED-LEAF_DATA_OBJECT',
    open_access: '',
    fullObjectName: 'bigid-presaleswest-sandbox-pub/documents/RFI/031518_wifi-rfi.pdf',
    objectName: '031518_wifi-rfi.pdf',
    objectId: '',
    containerName: 'bigid-presaleswest-sandbox-pub',
    containerId: '',
    subContainerName: 'documents/RFI/',
    subContainerId: '',
    detailedObjectType: 'UNSTRUCTURED',
    hierarchyType: 'LEAF_DATA_OBJECT',
    sizeInBytes: 499876,
    language: 'English',
    modified_date: '2022-06-07T00:56:25.000Z',
    created_date: '2018-03-15T16:03:16.000Z',
    last_opened: '',
    update_date: '',
    scanDate: '2023-06-21T08:30:05.793Z',
    catalogUpdateTime: '1687336205972',
    location: 'USA',
    was_scanned: true,
    tags: [
        {
            tagId: 'db6f55ed-c2e8-4b2c-b346-33125a263869',
            valueId: '1bd3e3fb-4226-4b51-8738-82e2def4ae55',
            tagName: 'system.sensitivityClassification.Sensitivity',
            tagValue: 'Low',
            tagType: 'OBJECT',
            properties: {
                applicationType: 'sensitivityClassification',
                hidden: false,
            },
        },
    ],
    object_owners_struct: [],
    branchName: '',
    reporter: '',
    reported_date: '',
    comment: '',
    createdBy: 'Morris Williams, III',
    lastUpdatedBy: '',
    lastAccessedBy: '',
    original_owner: 'Morris Williams, III',
    original_created_date: '2018-03-15 16:03:16.000',
    original_last_opened: '',
    original_modified_date: '2018-03-15 16:03:18.000',
    messageLink: '',
    attribute: ['classifier.Email', 'classifier.email #2'],
    application_name: [],
    last_scanned: '2023-06-21T08:30:05.793Z',
    document_type: 'RFI',
    ownersList: [],
    ds_owner: [],
} as any as BigIdObject;

/**
 * A mocked axios response from the BigID API endpoint
 * actionable-insights/all-cases with status 200
 */
export const fakeAllCasesResponse_200 = {
    status: 200,
    statusText: "OK",
    headers: undefined,
    config: undefined,
    data: {
        "status": "success",
        "statusCode": 200,
        "data": {
            "cases": [
                {
                    "caseStatus": "open",
                    "caseLabel": "Passwords detected on s3-v2",
                    "policyLastTriggered": "2023-07-10T20:45:39.947Z",
                    "caseType": "dataSourcePolicyCase",
                    "dataSourceName": "aws_883267841160_aws-controltower-s3-access-logs-883267841160-us-east-1_e2b45a43",
                    "dataSourceType": "s3-v2",
                    "dataSourceOwner": null,
                    "assignee": "bigid",
                    "policyName": "Passwords",
                    "severityLevel": "critical",
                    "policyOwner": "bigid",
                    "policyType": "catalog",
                    "compliance": "Passwords",
                    "numberOfAffectedObjects": 232,
                    "policyDescription": "Passwords such as cleartext passwords, common hashed passwords, and explicit passwords are private and confidential personal information. Passwords are the most common data stolen by hackers and should be kept in safe locations. This data risk is considered critical.",
                    "caseStatusUpdateDates": {
                        "open": "2023-07-08T08:00:22.022Z"
                    },
                    "created_at": "2023-07-08T08:00:22.022Z",
                    "updated_at": "2023-07-13T08:00:22.321Z",
                    "id": "9999a999999aa9999a99a999"
                }
            ],
            "totalCount": 1
        },
        "message": null
    }
};

/**
 * A mocked axios response from the BigID API endpoint
 * actionable-insights/all-cases with status 200
 */
export const fakeAllCasesResponse_200_noAffectedObjects = {
    status: 200,
    statusText: "OK",
    headers: undefined,
    config: undefined,
    data: {
        "status": "success",
        "statusCode": 200,
        "data": {
            "cases": [
                {
                    "caseStatus": "open",
                    "caseLabel": "Passwords detected on s3-v2",
                    "policyLastTriggered": "2023-07-10T20:45:39.947Z",
                    "caseType": "dataSourcePolicyCase",
                    "dataSourceName": "aws_883267841160_aws-controltower-s3-access-logs-883267841160-us-east-1_e2b45a43",
                    "dataSourceType": "s3-v2",
                    "dataSourceOwner": null,
                    "assignee": "bigid",
                    "policyName": "Passwords",
                    "severityLevel": "critical",
                    "policyOwner": "bigid",
                    "policyType": "catalog",
                    "compliance": "Passwords",
                    "numberOfAffectedObjects": 0,
                    "policyDescription": "Passwords such as cleartext passwords, common hashed passwords, and explicit passwords are private and confidential personal information. Passwords are the most common data stolen by hackers and should be kept in safe locations. This data risk is considered critical.",
                    "caseStatusUpdateDates": {
                        "open": "2023-07-08T08:00:22.022Z"
                    },
                    "created_at": "2023-07-08T08:00:22.022Z",
                    "updated_at": "2023-07-13T08:00:22.321Z",
                    "id": "9999a999999aa9999a99a999"
                }
            ],
            "totalCount": 1
        },
        "message": null
    }
};

/**
 * A mocked response from the BigID API endpoint
 * /compliance-rules?name={rule_name} with status 200
 */
export const fakeComplianceRulesResponse_200 = {
    status: 200,
    statusText: "OK",
    headers: undefined,
    config: undefined,
    data: [
        {
            "task": "99a999a9a99a9a99aa999a99",
            "taskSettings": {
                "includeLinkToInventory": false,
                "includeObjectsReport": true
            },
            "findings": {
                "violated": true,
                "findingsAmt": 266,
                "calcDate": "2023-07-10T20:45:39.947Z"
            },
            "name": "Passwords",
            "complianceRuleCalc": {
                "bigidQuery": "field IN (\"classifier.Cleartext Password near Term\", \"classifier.Common Hashed Passwords\", \"classifier.Explicit Password\", \"classifier.Explicit Password (Narrow)\")",
                "maxFindings": "1"
            },
            "is_enabled": true,
            "displayName": "Passwords",
            "status": "VIOLATED",
            "owner": "bigid",
            "presets": [],
            "action": null,
            "type": "catalog",
            "id": "9999aa99a99a9a99a999aa99",
            "description": "Passwords such as cleartext passwords, common hashed passwords, and explicit passwords are private and confidential personal information. Passwords are the most common data stolen by hackers and should be kept in safe locations. This data risk is considered critical.",
            "actions": [],
            "severity": "critical",
            "category": "Passwords"
        }
    ]
};

/**
 * A mocked response from the BigID API endpoint
 * /compliance-rules?name={rule_name} with status 200 where
 * rule_name is not a real rule
 */
export const fakeComplianceRulesResponseBadName_200 = {
    status: 200,
    statusText: "OK",
    headers: undefined,
    config: undefined,
    data: []
};

/**
 * A mocked response from the BigID API endpoint
 * /compliance-rules?name={rule_name} with status 401
 */
export const fakeComplianceRulesResponse_401 = {
    status: 401,
    statusText: "Unautherized",
    headers: undefined,
    config: undefined,
    data: null
};

/**
 * A mocked response from the BigID API endpoint
 * /ds_connections/{dataSourceName} with status 200
 */
export const fakeDataSourceResponse_200 = {
    status: 200,
    statusText: "OK",
    headers: undefined,
    config: undefined,
    data: {
        "ds_connection": {
            "_id": "99a99a9a999a9aaaa99a9999",
            "name": "aws_s3_cur_123456789012_redshift",
            "type": "s3-v2",
            "enabled": "yes",
            "isFromDiscoveryApp": true,
            "discoveryAppType": "aws",
            "authStrategy": "roleAuthentication",
            "authenticationProperties": {
                "@authenticationType": "roleAuthentication",
                "roleResourceName": "arn:aws:iam::123456789012:role/BigID-DataDiscovery-app-dev",
                "roleSessionName": "bigid-scanner"
            },
            "resourceProperties": {
                "resourceEntry": "us-east-1"
            },
            "containerizedFilterType": "containerizedSpecificNameFilter",
            "containerizedFilter": {
                "@containerizedFilterType": "containerizedSpecificNameFilter",
                "specificNameFilters": {
                    "containerUseCase": {
                        "name": "cur-123456789012-redshift",
                        "useCase": "INCLUDE"
                    }
                }
            },
            "classification_is_enabled": true,
            "ner_classification_is_enabled": false,
            "is_idsor_supported": true,
            "customFields": [
                {
                    "field_name": "Autodiscovery Resource ID",
                    "field_type": "clear",
                    "field_value": "arn:aws:s3:::cur-123456789012-redshift"
                }
            ],
            "owners_v2": [],
            "enumerationSamplingDropDown": "enumerationNoneSampling",
            "enumerationSamplingProperties": {
                "@enumerationSamplingType": "enumerationNoneSampling"
            },
            "contentSamplingDropDown": "samplePercentage",
            "contentSamplingProperties": {
                "@contentSamplingType": "samplePercentage",
                "percentage": 10
            },
            "differentialType": "differentialNoneFilter",
            "differentialFilter": {
                "@differentialType": "differentialNoneFilter"
            },
            "security_tier": "1",
            "structured_clustering_enabled": false,
            "tags": [
                {
                    "valueId": "a99aaa9a-999a-999a-9999-a9a9a99aaa99",
                    "tagId": "9a9aa9aa-9a99-9a9a-a99a-aa99aa99aaa9"
                }
            ],
            "numberOfParsingThreads": "7",
            "typeRequestProperties": {
                "@requestType": "unstructureRequestProperties"
            },
            "dsAclScanEnabled": "false",
            "metadataAclScanEnabled": "false",
            "ocrParameters": {
                "enabledOcr": false,
                "ocrLanguage": [],
                "ocrTimeout": 60
            },
            "created_at": "2023-07-05T14:28:44.876Z",
            "updated_at": "2023-07-13T21:57:00.139Z",
            "connectionStatusTest": {
                "is_success": true,
                "last_connection": "2023-07-05T16:07:07.307Z",
                "num_of_object": 0
            },
            "scanWindowName": [],
            "scanner_group": "default",
            "stopOnEnumerationFailure": false,
            "defaultScanId": "64a58cb4fd2626e5ada6a924",
            "defaultScanProfileId": "64a58cb4fd2626e5ada6a873",
            "connectionStatusScan": {
                "is_success": true,
                "last_connection": "2023-07-13T21:57:00.137Z",
                "num_of_object": 0
            },
            "last_scan_at": 1688736634487,
            "last_sub_scan_id": "64a8137aa9b933dde06b0fa4",
            "id": "aws_s3_cur_123456789012_redshift",
            "shouldPrintSensitiveData": false,
            "is_certificate": false
        }
    }
};