import express from 'express';
import bodyParser from 'body-parser';
import * as authApi from './api/auth';
import * as userApi from './api/user';
import { validateRequest } from './api/validation';
import * as validators from './validation/validators';

console.log('Server initializing...');

const app = express();
app.use(bodyParser.json());

app.post('/session', validators.logInValidator, [validateRequest, authApi.logIn, authApi.createSession]);
app.delete('/session', validators.logOutValidator, [validateRequest, authApi.logOut]);
app.put('/session', validators.refreshSessionValidator, [validateRequest, authApi.refreshSession, authApi.createSession]);
app.post('/user', validators.registerValidator, [validateRequest, userApi.register, authApi.logIn, authApi.createSession]);
app.get('/user', [authApi.authenticateUser, userApi.getUserDetails]);
app.put('/user', validators.updateUserValidator, [validateRequest, authApi.authenticateUser, userApi.updateUserDetails]);
app.put('/user/password', validators.updatePasswordValidator, [validateRequest, authApi.authenticateUser, userApi.updatePassword, authApi.createSession]);

const port = 3000;
app.listen(port, () => console.log('Server listening on port', port));
