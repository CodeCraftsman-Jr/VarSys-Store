# Quick Deploy Script for VarSys Store Download Site
# Choose your preferred hosting platform

Write-Host "VarSys Apps Download Center - Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Select deployment option:
1) Vercel (Recommended)
2) Netlify
3) Local Test Server
Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Deploying to Vercel..." -ForegroundColor Green
        cd "D:\VarSysProjects\VarSys Store"
        
        # Check if Vercel CLI is installed
        if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        vercel --prod
    }
    "2" {
        Write-Host "Deploying to Netlify..." -ForegroundColor Green
        cd "D:\VarSysProjects\VarSys Store"
        
        # Check if Netlify CLI is installed
        if (!(Get-Command netlify -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }
        
        netlify deploy --prod --dir .
    }
    "3" {
        Write-Host "Starting local test server..." -ForegroundColor Green
        cd "D:\VarSysProjects\VarSys Store"
        Write-Host "Server will start at http://localhost:8000" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        python -m http.server 8000
    }
    default {
        Write-Host "Invalid choice. Please run again and select 1, 2, or 3." -ForegroundColor Red
    }
}
