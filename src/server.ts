import { app } from './api/app';

console.log('Server initializing...');
const port = 3000;

app.listen(port, () => {
  console.log('Server listening on port', port);
});
