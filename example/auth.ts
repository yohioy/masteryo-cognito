import { Cognito } from '../dist'
require('dotenv').config();

const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, USER_EMAIL, USER_PASSWORD } = process.env;

const options: any = {
    UserPoolId: String(COGNITO_USER_POOL_ID),
    ClientId: String(COGNITO_CLIENT_ID)
};

const cognito = new Cognito(options);

const signin = async () => {
    const user = {
        email: String(USER_EMAIL),
        password: String(USER_PASSWORD)
    };

    const response = await cognito.authenticateUser(user.email, user.password);
    console.log(response);
}

console.log(signin());
