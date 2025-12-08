// Appwrite Configuration
import { Client, Databases, Storage, Account } from 'appwrite';

// Appwrite Configuration - Cloud
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '692edd5d002346df067e';
const DATABASE_ID = 'traqify_db';
const COLLECTION_ID = 'app_updates';
const BUCKET_ID = 'app-updates';

// Admin User IDs - Only these users can access admin features
const ADMIN_USER_IDS = [
    '6752f839003c62f26d03',
    '6936583b000b3647252e'
];

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
    adminUserIds: ADMIN_USER_IDS,
};

export default client;
