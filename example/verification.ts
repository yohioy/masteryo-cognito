import { Cognito, ICognitoUserPoolData } from '../dist'
require('dotenv').config();

const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, USER_EMAIL, USER_VERIFICATION_CODE } = process.env;

const options: ICognitoUserPoolData = {
    UserPoolId: String(COGNITO_USER_POOL_ID),
    ClientId: String(COGNITO_CLIENT_ID)
};

const cognito = new Cognito(options);

const verification = async () => {
    const user = {
        code: String(USER_VERIFICATION_CODE),
        email: String(USER_EMAIL)
    };

    const response = await cognito.confirmRegistration(user.code, user.email);
    console.log(response);
}

console.log(verification());
