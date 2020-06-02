import { Cognito } from '../dist'

const options: any = {
    UserPoolId: '',
    ClientId: ''
};
const cognito = new Cognito(options);

const signin = async () => {
    const user = {
        email: "",
        password:""
    };

    const response = await cognito.authenticateUser(user.email, user.password);
    console.log(response);
}

console.log(signin());
