// Appwrite Configuration
import { Client, Databases, Storage, Account } from 'appwrite';

// Appwrite Configuration - Cloud
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '692edd5d002346df067e';
const DATABASE_ID = 'traqify_db';
const COLLECTION_ID = 'app_updates';
const BUCKET_ID = 'app-updates';

// Admin User ID - Only this user can access admin features
const ADMIN_USER_ID = '6752f839003c62f26d03';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export const config = {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID,
    bucketId: BUCKET_ID,
    adminUserId: ADMIN_USER_ID,
};

export default client;
