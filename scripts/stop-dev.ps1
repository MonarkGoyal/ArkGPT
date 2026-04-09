$ErrorActionPreference = "Stop"

function Write-Info([string]$Message) {
    Write-Host "[ArkGPT] $Message"
}

$targets = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
    Where-Object {
        $_.CommandLine -match "server\.js" -or
        $_.CommandLine -match "vite\\bin\\vite\.js"
    }

if(-not $targets) {
    Write-Info "No ArkGPT node processes found."
    exit 0
}

foreach($proc in $targets) {
    try {
        Stop-Process -Id $proc.ProcessId -Force
        Write-Info "Stopped PID $($proc.ProcessId)."
    } catch {
        Write-Info "Failed to stop PID $($proc.ProcessId)."
    }
}

Write-Info "Shutdown complete."
