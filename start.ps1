param (
    [switch]$install
)

if ($install) {
    Write-Host "Installing Server dependencies..." -ForegroundColor Cyan
    Set-Location server
    uv sync
    Set-Location ..

    Write-Host "Installing Client dependencies..." -ForegroundColor Cyan
    Set-Location client
    npm install
    Set-Location ..
    
    Write-Host "Done installing! Run '.\start.ps1' to start the apps." -ForegroundColor Green
    exit
}

Write-Host "Starting Quantale Server and Client..." -ForegroundColor Cyan

# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd server; uv run python app/main.py`""

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd client; npm run dev`""

Write-Host "Both servers are spinning up in separate windows!" -ForegroundColor Green
