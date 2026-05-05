Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "[auto-sync] Starting post-commit sync..."

if (Get-Command graphify -ErrorAction SilentlyContinue) {
  try {
    Write-Host "[auto-sync] Refreshing Graphify graph..."
    graphify update .
  } catch {
    Write-Warning "[auto-sync] Graphify update failed: $($_.Exception.Message)"
  }
}

Write-Host "[auto-sync] Pushing latest commit to origin..."
git push origin HEAD
if ($LASTEXITCODE -ne 0) {
  throw "[auto-sync] git push failed with exit code $LASTEXITCODE"
}

if (Get-Command vercel.cmd -ErrorAction SilentlyContinue) {
  Write-Host "[auto-sync] Deploying latest commit to Vercel production..."
  vercel.cmd --prod --yes
  if ($LASTEXITCODE -ne 0) {
    throw "[auto-sync] Vercel deployment failed with exit code $LASTEXITCODE"
  }
} else {
  Write-Warning "[auto-sync] vercel.cmd not found. Skipping deployment."
}

Write-Host "[auto-sync] Post-commit sync complete."
