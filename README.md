# VarSys Apps Download Center

A static website that displays all available app updates from Appwrite with download links.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Displays all three mobile apps: Joint Journey, CookSuite, TraQify
- 🖥️ Supports desktop apps (Windows, macOS)
- 📊 Shows version info, file size, release notes
- 🔄 Real-time data from Appwrite Cloud
- ⚡ Fast, static site - no backend needed

## Apps Displayed

1. **Joint Journey Mobile** - Personal finance and fitness tracking
2. **CookSuite Mobile** - Kitchen management and recipes
3. **TraQify Mobile** - Advanced analytics and tracking
4. **Desktop versions** - Windows/macOS apps (when available)

## Configuration

The site connects to Appwrite Cloud:
- Endpoint: `https://cloud.appwrite.io/v1`
- Project ID: `692edd5d002346df067e`
- Database: `traqify_db`
- Collection: `app_updates`

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Deploy:
   ```powershell
   cd D:\VarSysProjects\app-downloads-site
   vercel
   ```

3. Follow prompts to link/create project

### Option 2: Netlify

1. Install Netlify CLI:
   ```powershell
   npm install -g netlify-cli
   ```

2. Deploy:
   ```powershell
   cd D:\VarSysProjects\app-downloads-site
   netlify deploy --prod --dir .
   ```

### Option 3: GitHub Pages

1. Create a new GitHub repository
2. Push this folder to the repository
3. Enable GitHub Pages in repository settings
4. Set source to `main` branch, root directory

### Option 4: Simple HTTP Server (Testing)

```powershell
cd D:\VarSysProjects\app-downloads-site
python -m http.server 8000
# Or with Node.js
npx http-server
```

Then open: http://localhost:8000

## How It Works

1. The site fetches all active updates from the `app_updates` collection
2. Groups them by app name and shows the latest version for each
3. Displays app cards with metadata, version info, and download links
4. Download links point directly to Appwrite Storage files

## Updating Apps

To add new app versions:

1. Build the APK using EAS Build
2. Upload using the script:
   ```powershell
   node D:\VarSysProjects\scripts\upload-apk-to-appwrite.js `
     "path/to/app.apk" `
     "CookSuite Mobile" `
     "1.0.2" `
     3 `
     3 `
     "Bug fixes and new features" `
     false
   ```
3. The website will automatically show the new version

## Maintenance

- No maintenance required - it's a static site
- Updates appear automatically when added to Appwrite
- No server-side code or database to manage

## Customization

Edit `index.html` to:
- Change colors/styling
- Add/remove apps
- Modify metadata (icons, descriptions)
- Update branding

## Security

- Uses Appwrite's built-in permissions
- No API keys exposed (read-only public access)
- Download links are pre-signed Appwrite URLs
- No user authentication needed
