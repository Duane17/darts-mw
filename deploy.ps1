# build-deploy.ps1

Write-Host "Starting build process..." -ForegroundColor Cyan
pnpm build

Write-Host "Copying static assets to standalone folder..." -ForegroundColor Cyan
# xcopy /y /e /i /q ignores prompts and copies quietly
xcopy /y /e /i /q public .next\standalone\public
xcopy /y /e /i /q .next\static .next\standalone\.next\static

Write-Host "Zipping deployment package..." -ForegroundColor Cyan
if (Test-Path "../../deploy_package.zip") { Remove-Item "../../deploy_package.zip" }

Set-Location .next\standalone
Compress-Archive -Path * -DestinationPath ..\..\deploy_package.zip -Force

Set-Location ..\..
Write-Host "Done! Your package is ready at: deploy_package.zip" -ForegroundColor Green