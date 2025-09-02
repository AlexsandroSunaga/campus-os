$root = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\api-node'; npm run dev"
Start-Sleep -Seconds 2
Set-Location "$root\web"
$env:VITE_API_BASE = "http://localhost:8014"
npm run dev
