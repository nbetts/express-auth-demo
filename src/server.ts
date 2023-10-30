import express from 'express';
import bodyParser from 'body-parser';
import * as authApi from './api/auth';
import * as userApi from './api/user';
import { validateRequest } from './api/validation';
import * as validators from './validation/validators';

console.log('Server initializing...');
export const server = express();
const port = 3000;

server.use(bodyParser.json());
server.post('/session', validators.logInValidator, [validateRequest, authApi.logIn, authApi.createSession]);
server.delete('/session', validators.logOutValidator, [validateRequest, authApi.logOut]);
server.put('/session', validators.refreshSessionValidator, [validateRequest, authApi.refreshSession, authApi.createSession]);
server.post('/user', validators.registerValidator, [validateRequest, userApi.register, authApi.logIn, authApi.createSession]);
server.get('/user', [authApi.authenticateUser, userApi.getUserDetails]);
server.put('/user', validators.updateUserValidator, [validateRequest, authApi.authenticateUser, userApi.updateUserDetails]);
server.put('/user/password', validators.updatePasswordValidator, [validateRequest, authApi.authenticateUser, userApi.updatePassword, authApi.createSession]);
server.listen(port, () => console.log('Server listening on port', port));
