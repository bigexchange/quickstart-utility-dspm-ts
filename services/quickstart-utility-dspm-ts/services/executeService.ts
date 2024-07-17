import { ActionResponseDetails, ExecutionContext, StatusEnum, updateActionStatusToBigID } from "@bigid/apps-infrastructure-node-js";
import { BackupFileResponse, backupFilesInFakeAPI, BigIdCase, getBigIdCases, getStringActionParam, remediateCasesWithNoAffectedObjects, setTagsOnObjects, tokenizeStringList } from "../utils/executeService.utils";
import { getLogger } from "log4js";

/**
 * Gets filtered DSPM cases from BigID bakcs the files up to
 * a fake API, then updates the case using tags.
 * @param executionContext A container for the call to the BigID API.
 */
export async function backupFilesAction(executionContext: ExecutionContext): Promise<string> {
    const dataSources: string = getStringActionParam(executionContext, "Data Source Types");
    const dataSourceList: Array<string> = tokenizeStringList(dataSources);
    const dataSourceSelector: string[] | undefined = (dataSourceList[0] === "all") ? undefined : dataSourceList;
    const policyName: string = getStringActionParam(executionContext, "Policy Name").trim();
    const tagName: string = getStringActionParam(executionContext, "Backup Tag").trim();
    const cases: BigIdCase[] = await getBigIdCases(executionContext, dataSourceSelector, policyName);
    const num_cases = cases.length;
    let total_response: BackupFileResponse = {
        backups_created: [],
        backups_found: [],
        num_created: 0,
        num_found: 0
    }
    let modifiedCount = 0;
    for(const [case_index, bigIDCase] of cases.entries()) {
        const objects = bigIDCase.affectedObjects;
        await updateActionStatusToBigID(executionContext, new ActionResponseDetails(
            executionContext.executionId,
            StatusEnum.IN_PROGRESS,
            ((case_index + 1) / num_cases),
            `Backing up files from case ${case_index + 1}/${num_cases}`
        ));
        await backupFilesInFakeAPI(executionContext, objects).then((response) => {
            total_response.backups_created = total_response.backups_created.concat(response.backups_created);
            total_response.backups_found = total_response.backups_found.concat(response.backups_found);
            total_response.num_created += response.num_created;
            total_response.num_found += response.num_found;
        }).catch((error) => {
            throw error;
        });
        modifiedCount += await setTagsOnObjects(executionContext, tagName, "True", objects);
    }

    //now, close cases with no more affected objects
    const numCasesRemediated = await remediateCasesWithNoAffectedObjects(executionContext, cases, "All affected objects were backed up.")

    let message = `${total_response.num_found} file(s) already backed up. ${total_response.num_created} file(s) backed up. ${modifiedCount} tag(s) updated. ${numCasesRemediated} case(s) remediated.`;
    await updateActionStatusToBigID(executionContext, new ActionResponseDetails(
        executionContext.executionId,
        StatusEnum.COMPLETED,
        1,
        message
    ));
    getLogger().log(message);
    return message;
}

/**
 * Gets filtered DSPM cases from BigID and prints them to the console in JSON format.
 * @param executionContext A container for the call to the BigID API.
 */
export async function printBigIdCasesAsJSON(executionContext: ExecutionContext): Promise<void> {
    const dataSources: string = getStringActionParam(executionContext, "Data Source Types");
    const dataSourceList: Array<string> = tokenizeStringList(dataSources);
    const dataSourceSelector: string[] | undefined = (dataSourceList[0] === "all") ? undefined : dataSourceList;
    const cases: BigIdCase[] = await getBigIdCases(executionContext, dataSourceSelector);
    getLogger().log(JSON.stringify(cases));
}