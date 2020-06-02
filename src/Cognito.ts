global.fetch = require('node-fetch').default

import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoAccessToken
} from 'amazon-cognito-identity-js';

export interface IOptions {
    UserPoolId: string;
    ClientId: string;
}

export class Cognito {
    private readonly poolData;
    private readonly userPool;

    constructor(options: IOptions) {

        this.poolData = {
            UserPoolId: options.UserPoolId,
            ClientId: options.ClientId
        };
        this.userPool = new CognitoUserPool(this.poolData);
    }

    async signup(username: string, password: string, attributes: {}): Promise<any>{

        let attributeList: any = [];

        for (let [key, value] of Object.entries(attributes)) {
            let item = {
                Name: `${key}`,
                Value: `${value}`
            };
            attributeList.push(new CognitoUserAttribute(item));
        }

        try {
            const cognitoSignupResponse = await new Promise((resolve, reject) => this.userPool.signUp(username, password, attributeList, null, (err, result) => {
                if(err) {
                    reject(err);
                }
                resolve(result);
            }));
            return cognitoSignupResponse;
        } catch(e) {
            throw new Error(`Sign up Error: ${e}`);
        }
    }


    async authenticateUser (email: string, password: string) {

        const authenticateData = {
            Username: email,
            Password: password
        };
        const authenticationDetails = new AuthenticationDetails(authenticateData);

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        let authenticatedUserResult;
        try {
            authenticatedUserResult = await new Promise((resolve, reject) => cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    let tokenData = {
                        accessToken: result.getAccessToken().getJwtToken(),
                        sub: result.getAccessToken().decodePayload().sub
                    };
                    resolve(tokenData);
                },
                onFailure: (err) => {
                    reject(err);
                }
            }));
            return authenticatedUserResult;
        } catch(e) {
            throw new Error(`Auth Failed: ${e}`);
        }

    }


    async confirmRegistration(code: string, email: string) {

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            await new Promise((resolve, reject) => cognitoUser.confirmRegistration(code, false, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }));

        } catch(e) {
            throw new Error(`Confirm Registration Error: ${e}`);
        }
    }


    async getTokenPayload(token: string) {
        const cognitoAccessToken = new CognitoAccessToken({ AccessToken: token });
        return cognitoAccessToken.decodePayload();
    }

}
