import express from 'express';
import bodyParser from 'body-parser';
import * as api from './requestHandlers';
import * as validators from '../validation/validators';

export const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.post('/session', validators.logInValidator, [api.validateRequest, api.logIn, api.createSession]);
app.delete('/session', validators.logOutValidator, [api.validateRequest, api.logOut]);
app.put('/session', validators.refreshSessionValidator, [api.validateRequest, api.refreshSession, api.createSession]);
app.post('/user', validators.registerValidator, [api.validateRequest, api.register, api.logIn, api.createSession]);
app.get('/user', [api.authenticateUser, api.getUserDetails]);
app.put('/user', validators.updateUserValidator, [api.validateRequest, api.authenticateUser, api.updateUserDetails]);
app.put('/user/password', validators.updatePasswordValidator, [api.validateRequest, api.authenticateUser, api.updatePassword, api.createSession]);
