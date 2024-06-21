import { ExecutionContext } from "@bigid/apps-infrastructure-node-js";

export async function executeTestAction(executionContext: ExecutionContext) {
    console.log('Test Action was called from a BigID server! Our ExecutionContext is '+ JSON.stringify(executionContext));
}