import { Cognito } from '../dist'
import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';
require('dotenv').config();

const signup = async () => {
    const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, USER_EMAIL, USER_PASSWORD } = process.env;

    const options: ICognitoUserPoolData  = {
        UserPoolId: String(COGNITO_USER_POOL_ID),
        ClientId: String(COGNITO_CLIENT_ID)
    };

    const cognito = new Cognito(options);

    const user = {
        email: String(USER_EMAIL),
        password: String(USER_PASSWORD)
    };

    const cognitoUserAttributes = {
        given_name: "Joe",
        family_name: "Blogs",
        email: String(USER_EMAIL),
    };

    const response = await cognito.signup(user.email, user.password, cognitoUserAttributes);
    console.log(response);
}

console.log(signup());
