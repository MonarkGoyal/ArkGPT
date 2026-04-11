param(
    [string]$FrontendUrl,
    [string]$BackendUrl,
    [switch]$AllowHttp
)

$ErrorActionPreference = "Stop"

function Write-Info([string]$Message) {
    Write-Host "[Verify] $Message"
}

function Add-Failure([System.Collections.Generic.List[string]]$Failures, [string]$Message) {
    $Failures.Add($Message) | Out-Null
    Write-Host "[Verify][FAIL] $Message"
}

function Add-Warning([System.Collections.Generic.List[string]]$Warnings, [string]$Message) {
    $Warnings.Add($Message) | Out-Null
    Write-Host "[Verify][WARN] $Message"
}

function Ensure-AbsoluteUrl([string]$Name, [string]$Value, [System.Collections.Generic.List[string]]$Failures) {
    if([string]::IsNullOrWhiteSpace($Value)) {
        Add-Failure $Failures "$Name is required."
        return $null
    }

    try {
        return [Uri]$Value
    } catch {
        Add-Failure $Failures "$Name is not a valid URL: $Value"
        return $null
    }
}

function Ensure-HttpsPolicy([string]$Name, [Uri]$UriValue, [bool]$AllowHttpValue, [System.Collections.Generic.List[string]]$Failures) {
    if(-not $UriValue) {
        return
    }

    if($AllowHttpValue) {
        return
    }

    if($UriValue.Scheme -ne "https") {
        Add-Failure $Failures "$Name must use https (received: $($UriValue.Scheme))."
    }
}

function Invoke-Request([string]$Method, [string]$Url, [hashtable]$Headers) {
    if($Headers) {
        return Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -UseBasicParsing -TimeoutSec 15
    }

    return Invoke-WebRequest -Method $Method -Uri $Url -UseBasicParsing -TimeoutSec 15
}

$failures = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

$frontend = Ensure-AbsoluteUrl -Name "FrontendUrl" -Value $FrontendUrl -Failures $failures
$backend = Ensure-AbsoluteUrl -Name "BackendUrl" -Value $BackendUrl -Failures $failures

Ensure-HttpsPolicy -Name "FrontendUrl" -UriValue $frontend -AllowHttpValue $AllowHttp.IsPresent -Failures $failures
Ensure-HttpsPolicy -Name "BackendUrl" -UriValue $backend -AllowHttpValue $AllowHttp.IsPresent -Failures $failures

if($failures.Count -gt 0) {
    Write-Host "[Verify] Aborting due to input validation errors."
    exit 1
}

$frontendBase = $frontend.AbsoluteUri.TrimEnd('/')
$backendBase = $backend.AbsoluteUri.TrimEnd('/')
$healthUrl = "$backendBase/health"
$corsProbeUrl = "$backendBase/api/chat"

Write-Info "Checking frontend: $frontendBase"
try {
    $frontendResponse = Invoke-Request -Method "GET" -Url $frontendBase -Headers $null
    if($frontendResponse.StatusCode -lt 200 -or $frontendResponse.StatusCode -ge 400) {
        Add-Failure $failures "Frontend returned status $($frontendResponse.StatusCode)."
    }
} catch {
    Add-Failure $failures "Frontend request failed: $($_.Exception.Message)"
}

Write-Info "Checking backend health: $healthUrl"
try {
    $healthResponse = Invoke-Request -Method "GET" -Url $healthUrl -Headers $null
    if($healthResponse.StatusCode -ne 200) {
        Add-Failure $failures "Backend health returned status $($healthResponse.StatusCode)."
    } else {
        try {
            $healthBody = $healthResponse.Content | ConvertFrom-Json
            if($healthBody.status -ne "ok") {
                Add-Failure $failures "Backend health status field is not 'ok'."
            }
        } catch {
            Add-Failure $failures "Backend health response is not valid JSON."
        }
    }

    $requiredHeaders = @(
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy"
    )

    foreach($headerName in $requiredHeaders) {
        if(-not $healthResponse.Headers[$headerName]) {
            Add-Failure $failures "Missing security header: $headerName"
        }
    }

    if($backend.Scheme -eq "https" -and -not $healthResponse.Headers["Strict-Transport-Security"]) {
        Add-Warning $warnings "Missing Strict-Transport-Security on HTTPS backend response."
    }
} catch {
    Add-Failure $failures "Backend health request failed: $($_.Exception.Message)"
}

Write-Info "Checking backend CORS behavior: $corsProbeUrl"
try {
    $originHeader = $frontend.GetLeftPart([System.UriPartial]::Authority)
    $corsHeaders = @{
        "Origin" = $originHeader
        "Access-Control-Request-Method" = "POST"
    }

    $corsResponse = Invoke-Request -Method "OPTIONS" -Url $corsProbeUrl -Headers $corsHeaders
    if($corsResponse.StatusCode -lt 200 -or $corsResponse.StatusCode -ge 400) {
        Add-Failure $failures "CORS preflight returned status $($corsResponse.StatusCode)."
    }

    $allowOrigin = $corsResponse.Headers["Access-Control-Allow-Origin"]
    if(-not $allowOrigin) {
        Add-Failure $failures "CORS preflight missing Access-Control-Allow-Origin header."
    } elseif($allowOrigin -ne "*" -and $allowOrigin -ne $originHeader) {
        Add-Failure $failures "CORS allow-origin mismatch. Expected '$originHeader' or '*', got '$allowOrigin'."
    }
} catch {
    Add-Failure $failures "CORS preflight failed: $($_.Exception.Message)"
}

Write-Host ""
if($warnings.Count -gt 0) {
    Write-Host "[Verify] Warnings:"
    foreach($warning in $warnings) {
        Write-Host " - $warning"
    }
}

if($failures.Count -gt 0) {
    Write-Host "[Verify] Completed with failures:"
    foreach($failure in $failures) {
        Write-Host " - $failure"
    }
    exit 1
}

Write-Host "[Verify] All checks passed."
exit 0
