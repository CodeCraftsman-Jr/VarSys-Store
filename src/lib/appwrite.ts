// Appwrite Configuration
import { Client, Databases, Storage, Account } from 'appwrite';
import { analytics, createTrackedDatabases } from './analytics';

// Appwrite Configuration - VarSys Store Project (Cloud - Frankfurt)
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '695215eb000105cdf565';
const DATABASE_ID = 'varsys_store_db';
const COLLECTION_ID = 'app_updates';
const BUCKET_ID = 'app-updates';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

// Initialize analytics tracking
analytics.init({
    app: 'varsys-store',
    platform: 'web',
    apiUrl: import.meta.env.VITE_ANALYTICS_API_URL || 'https://usage-tracker-gamma.vercel.app/api',
});

// Create tracked databases (auto-tracks all reads/writes)
const rawDatabases = new Databases(client);
export const databases = createTrackedDatabases(rawDatabases);

export const storage = new Storage(client);
export const account = new Account(client);

export const config = {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID,
    bucketId: BUCKET_ID,
};

export default client;
