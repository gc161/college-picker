
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const poolData = {
    UserPoolId: "us-east-1_0TLHCBOvs",
    ClientId: "5q1939qqtbtqafn2lspgv4bglu"
};


export const cognitoAuth = new CognitoUserPool(poolData);