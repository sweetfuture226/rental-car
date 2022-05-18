import { app } from './server';
import logger from './utils/logger';
const db = require('./db/models');

let port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  logger(`Server is running on port ${port}`);
});

export default app;
