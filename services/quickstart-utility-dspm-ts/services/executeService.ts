import { ExecutionContext } from "@bigid/apps-infrastructure-node-js";
import { BigIdCase, getBigIdCases, getStringActionParam, tokenizeStringList } from "../utils/executeService.utils";
import { getLogger } from "log4js";

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