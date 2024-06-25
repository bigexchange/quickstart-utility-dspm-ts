import { ExecutionContext } from "@bigid/apps-infrastructure-node-js";
import { BigIdCase, getBigIdCases } from "../utils/executeService.utils";
import { getLogger } from "log4js";

/**
 * Gets filtered DSPM cases from BigID and prints them to the console in JSON format.
 * @param executionContext A container for the call to the BigID API.
 * @param dataSourceList (Optional) A list of data sources to filter the request. All data sources
 */
export async function printBigIdCasesAsJSON(executionContext: ExecutionContext, dataSourceList?: Array<string>): Promise<void> {
    const cases: BigIdCase[] = await getBigIdCases(executionContext, dataSourceList);
    getLogger().log(JSON.stringify(cases));
}