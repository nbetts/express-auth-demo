import express from 'express';
import bodyParser from 'body-parser';
import * as api from './api';

const port = 3000;
const app = express();
app.use(bodyParser.json());
app.post('/register', [api.register, api.logIn]);
app.post('/logIn', api.logIn);
app.get('/user', [api.authenticateUser, api.getUserDetails]);
app.post('/user', [api.authenticateUser, api.updateUserDetails]);
app.listen(port, () => console.log('Server listening on port', port));
