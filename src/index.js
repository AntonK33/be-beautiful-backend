import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import 'dotenv/config';

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await setupServer();
  } catch (e) {
    console.log('Error during setup', e);
  }
};

bootstrap();
