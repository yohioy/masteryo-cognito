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
    const cognitoUserAttributes = {
        given_name: "Joe",
        family_name: "Blogs",
        email: EMAIL,
    };

    await cognito.signup(user.email, user.password, cognitoUserAttributes);

}

console.log(signin());
