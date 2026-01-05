# Quick Setup: Add build_type to Appwrite Database

## Option 1: Appwrite Console (Recommended)

1. **Login**: https://cloud.appwrite.io
2. **Navigate**: Databases → `varsys_store_db` → `app_updates` collection
3. **Add Attribute**:
   - Click "Add Attribute"
   - Select "Enum"
   - **Key**: `build_type`
   - **Elements**: Add two items:
     - `development`
     - `production`
   - **Default**: `production`
   - **Required**: ❌ No (uncheck - for backward compatibility)
   - **Array**: ❌ No
   - Click "Create"

4. **Wait**: Attribute will be created (takes a few seconds)

## Option 2: Using Node.js Script

Save as `add-build-type-attribute.js`:

```javascript
const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('695215eb000105cdf565')
  .setKey('YOUR_API_KEY_HERE');

const databases = new Databases(client);

async function addBuildTypeAttribute() {
  try {
    await databases.createEnumAttribute(
      'varsys_store_db',        // databaseId
      'app_updates',            // collectionId
      'build_type',             // key
      ['development', 'production'], // elements
      false,                    // required
      'production'              // default
    );
    console.log('✅ build_type attribute created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addBuildTypeAttribute();
```

Run:
```powershell
node add-build-type-attribute.js
```

## Option 3: Using MCP Appwrite Tools (If Available)

If MCP server is configured in VS Code:

```typescript
// AI can invoke this tool directly
mcp_appwrite-api_tables_db_create_enum_column({
  database_id: 'varsys_store_db',
  table_id: 'app_updates',
  key: 'build_type',
  elements: ['development', 'production'],
  default: 'production',
  required: false
})
```

## Verify Setup

After adding the attribute, verify in Appwrite Console:
1. Go to `app_updates` collection
2. Click "Attributes" tab
3. You should see `build_type` with:
   - Type: Enum
   - Elements: development, production
   - Default: production
   - Required: No

## Test Upload

Upload a test build:

```powershell
# Development build
node D:\VarSysProjects\scripts\upload-apk-to-appwrite.js `
  ".\test-app.apk" `
  "Test App" `
  "1.0.0" `
  1 `
  1 `
  "development" `
  "Test build" `
  false
```

Check in Appwrite Console:
- Documents tab → Find the uploaded document
- Verify `build_type: "development"` field exists

## Troubleshooting

**Error: "Attribute already exists"**
- Attribute was already created
- Check Attributes tab to confirm

**Error: "Invalid elements"**
- Ensure elements are exactly: `development` and `production`
- Case-sensitive!

**Error: "Unauthorized"**
- Check API key has write permissions
- Verify project ID is correct

## Done! 🎉

Once the attribute is added:
1. Upload builds with build_type parameter
2. Visit VarSys Store website
3. Use Development/Production filters
4. See builds organized by month
