import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await setupServer();
  } catch (e) {
    console.log('Error during setup', e);
  }
};

bootstrap();
