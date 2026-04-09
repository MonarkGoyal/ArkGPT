param(
    [switch]$SkipPortCleanup,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Info([string]$Message) {
    Write-Host "[ArkGPT] $Message"
}

function Start-TerminalProcess([string]$WorkingDir, [string]$Command, [string]$Label) {
    if($DryRun) {
        Write-Info "[DryRun] Would start $Label in $WorkingDir with command: $Command"
        return
    }

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "Set-Location '$WorkingDir'; $Command"
    ) | Out-Null

    Write-Info "$Label started in a new terminal window."
}

function Get-ListeningPidsForPort([int]$Port) {
    $rows = netstat -ano | Select-String ":$Port"
    if(-not $rows) {
        return @()
    }

    $pids = @()
    foreach($row in $rows) {
        $text = ($row.ToString() -replace "\s+", " ").Trim()
        if($text -match "LISTENING ([0-9]+)$") {
            $pids += [int]$Matches[1]
        }
    }

    return $pids | Select-Object -Unique
}

if(-not $SkipPortCleanup) {
    $backendPids = Get-ListeningPidsForPort -Port 8080
    foreach($procId in $backendPids) {
        try {
            if($DryRun) {
                Write-Info "[DryRun] Would stop process on 8080 (PID: $procId)."
            } else {
                Stop-Process -Id $procId -Force
                Write-Info "Stopped stale process on 8080 (PID: $procId)."
            }
        } catch {
            Write-Info "Could not stop PID $procId. Continuing."
        }
    }
}

$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if($mongoService) {
    if($mongoService.Status -ne "Running") {
        Write-Info "MongoDB service is installed but not running. Start it if you want persistent thread history."
    } else {
        Write-Info "MongoDB service is running."
    }
} else {
    Write-Info "MongoDB service not found. App will use in-memory thread history fallback."
}

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendDir = Join-Path $root "Backend"
$frontendDir = Join-Path $root "Frontend"

Start-TerminalProcess -WorkingDir $backendDir -Command "node server.js" -Label "Backend"
Start-TerminalProcess -WorkingDir $frontendDir -Command "npm run dev -- --host 0.0.0.0" -Label "Frontend"

Write-Info "Startup complete. Open http://localhost:5173 in your browser."
