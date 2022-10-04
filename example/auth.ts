import { Cognito } from '../dist'
require('dotenv').config();

const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, EMAIL, PASSWORD } = process.env;

const options: any = {
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_CLIENT_ID
};

const cognito = new Cognito(options);

const signin = async () => {
    const user = {
        email: EMAIL,
        password: PASSWORD
    };

    const response = await cognito.authenticateUser(user.email, user.password);
    console.log(response);
}

console.log(signin());
