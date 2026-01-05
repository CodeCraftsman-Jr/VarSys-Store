import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('695215eb000105cdf565')
    .setKey('standard_6c65af6cb4e7a5ed0811647909fde8b3e46d828a6b95eaf3058d45871886c5064ececae5f9a652adc6b7ec34f5fd542ae9e9a32b441c8b6d237cc35ab61af67037ee29bd030450bb2be6ff87f5046dd40767880bd4cf5fbb6924b3a2a9138947ff0345e295d188f4c36e93194552e8c1c90c4e4aea63fcc10ac37604194ad779');

const databases = new Databases(client);

async function checkAndFixApps() {
    try {
        console.log('📊 Checking all apps in database...\n');
        
        // Get all apps (no filter)
        const response = await databases.listDocuments(
            'varsys_store_db',
            'apps',
            [Query.limit(100)]
        );
        
        console.log(`Total apps: ${response.documents.length}\n`);
        
        const inactiveApps = [];
        
        response.documents.forEach(app => {
            const status = app.is_active ? '✅ Active' : '❌ Inactive';
            console.log(`${status} - ${app.app_name}`);
            if (!app.is_active) {
                inactiveApps.push(app);
            }
        });
        
        if (inactiveApps.length > 0) {
            console.log(`\n⚠️  Found ${inactiveApps.length} inactive apps. Activating them...\n`);
            
            for (const app of inactiveApps) {
                await databases.updateDocument(
                    'varsys_store_db',
                    'apps',
                    app.$id,
                    { is_active: true }
                );
                console.log(`✅ Activated: ${app.app_name}`);
            }
            
            console.log('\n🎉 All apps are now active!');
        } else {
            console.log('\n✅ All apps are already active!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAndFixApps();
