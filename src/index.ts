import express from 'express';
import bodyParser from 'body-parser';
import * as api from './api';

const app = express();
app.use(bodyParser.json());
app.post('/register', [api.register, api.logIn]);
app.post('/logIn', api.logIn);
app.get('/user', [api.authenticateUser, api.getUser]);
app.post('/user', [api.authenticateUser, api.updateUser]);
app.listen(3000);
