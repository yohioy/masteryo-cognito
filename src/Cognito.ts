global.fetch = require('node-fetch').default

import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoAccessToken,
    ICognitoUserPoolData,
    ICognitoUserAttributeData,
    ISignUpResult,
    IAuthenticationCallback,
    IAuthenticationDetailsData,
    ICognitoUserData
} from 'amazon-cognito-identity-js';

export type TOptions = {
    UserPoolId: string;
    ClientId: string;
}

export {
    ICognitoUserPoolData,
    ICognitoUserAttributeData
}

export class Cognito {
    private readonly poolData: ICognitoUserPoolData;
    private readonly userPool: CognitoUserPool;

    constructor(options: TOptions) {

        this.poolData = {
            UserPoolId: options.UserPoolId,
            ClientId: options.ClientId,
        };
        this.userPool = new CognitoUserPool(this.poolData);
    }

    async signup(username: string, password: string, attributes: {}): Promise<ISignUpResult>{

        let attributeList: any = [];
        let item: ICognitoUserAttributeData;

        for (let [key, value] of Object.entries(attributes)) {
            item = {
                Name: `${key}`,
                Value: `${value}`
            };
            attributeList.push(new CognitoUserAttribute(item));
        }

        try {
            return await new Promise((resolve, reject) => this.userPool.signUp(username, password, attributeList, [], (err, result) => {
                if(err) {
                    reject(err);
                }
                resolve(result);
            }));
        } catch(e) {
            throw new Error(`Sign up Error: ${e.message}`);
        }
    }


    async authenticateUser (email: string, password: string): Promise<IAuthenticationCallback>{

        const authenticateData: IAuthenticationDetailsData = {
            Username: email,
            Password: password
        };
        const authenticationDetails = new AuthenticationDetails(authenticateData);

        const cognitoUserData: ICognitoUserData = {
            Username: email,
            Pool: this.userPool
        }
        const cognitoUser = new CognitoUser(cognitoUserData);

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
            throw new Error(`Auth Failed: ${e.message}`);
        }

    }


    async confirmRegistration(code: string, email: string): Promise<any> {

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
            throw new Error(`Confirm Registration Error: ${e.message}`);
        }
    }


    async getTokenPayload(token: string): Promise<object> {
        const cognitoAccessToken = new CognitoAccessToken({ AccessToken: token });
        return cognitoAccessToken.decodePayload();
    }

}
