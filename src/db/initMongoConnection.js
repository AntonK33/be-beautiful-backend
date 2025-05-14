import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection() {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`
    );
    // await mongoose.connect(
    //   `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    // );
    console.log('Database pre-connected');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
  }
}
