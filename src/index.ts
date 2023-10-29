import express from 'express';
import bodyParser from 'body-parser';
import * as api from './api';

console.log('Server initializing...');

const app = express();
app.use(bodyParser.json());

app.post('/session', [api.logIn, api.createSession]);
app.delete('/session', api.logOut);
app.put('/session', api.refreshSession);
app.post('/user', [api.register, api.logIn, api.createSession]);
app.get('/user', [api.authenticateUser, api.getUserDetails]);
app.put('/user', [api.authenticateUser, api.updateUserDetails]);
app.put('/user/password', [api.authenticateUser, api.updatePassword, api.createSession]);

const port = 3000;
app.listen(port, () => console.log('Server listening on port', port));
