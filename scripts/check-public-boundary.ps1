$ErrorActionPreference = "Stop"

$patterns = @(
  "state transition",
  "fraud detection",
  "risk engine",
  "internal endpoint",
  "localhost:3001",
  "private key",
  "secret key"
)

$files = Get-ChildItem -Recurse -File | Where-Object {
  $_.FullName -notmatch "\\.git\\" -and
  $_.FullName -notmatch "\\node_modules\\" -and
  $_.FullName -notmatch "\\scripts\\" -and
  $_.Name -notin @("README.md", "LICENSE")
}

$violations = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file.FullName -Raw
  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      $violations.Add("$($file.FullName) matched '$pattern'")
    }
  }
}

if ($violations.Count -gt 0) {
  Write-Host "Public boundary check failed." -ForegroundColor Red
  $violations | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
  exit 1
}

Write-Host "Public boundary check passed." -ForegroundColor Green
