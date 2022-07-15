import { ManifestProvider } from '@bigid/apps-infrastructure-node-js';

class ManifestController extends ManifestProvider {
  getManifest(req: any, res: any): string {
    return JSON.stringify({
      "app_name": "Quickstart Simple - Typescript",
      "description": "A simple starter utility application. Made for easily getting started running scripts in BigID.",
      "category": "utility",
      "license_type":"FREE",
      "vendor": "BigID",
      "license_verification_key": "",
      "global_params": [],
      "actions": [
        {
          "action_id": "Test Action",
          "description": "Does nothing. ",
          "is_sync": true,
          "action_params": [
            {
              "param_name":"Sample Selection Parameter",
              "param_type":"String",
              "input_type": "singleSelection",
              "input_items": ["True","False"],
              "is_cleartext":true,
              "param_description":"Shows you how to do a selection",
              "default_value":"True",
              "param_priority":"primary",
              "is_mandatory":true
            },
            {
              "param_name": "Sample Input Parameter",
              "param_type": "String",
              "is_cleartext": true,
              "param_description": "Input whatever you want!",
              "default_value": "",
              "param_priority": "primary",
              "is_mandatory": true
            }
          ]
        }
      ]
    });
    
  }
}

export const manifestController = new ManifestController();