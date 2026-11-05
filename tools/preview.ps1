# Náhledové snímky z kompozice + kontaktní sheet (out/_stills/<Name>_sheet.png).
# Použití: .\tools\preview.ps1 -Comp WatermelonShort -Name watermelon-status -Frames 60,300,600
param(
	[Parameter(Mandatory)] [string]$Comp,
	[Parameter(Mandatory)] [string]$Name,
	[Parameter(Mandatory)] [int[]]$Frames,
	[int]$Width = 300
)
$root = Split-Path $PSScriptRoot -Parent
$stills = Join-Path $root 'out\_stills'
New-Item -ItemType Directory -Force $stills | Out-Null
Push-Location (Join-Path $root 'remotion')
foreach ($f in $Frames) {
	npx remotion still src/index.ts $Comp "..\out\_stills\${Name}_$f.png" "--props=public/$Name.timeline.json" "--frame=$f" --overwrite 2>&1 |
		Select-String -Pattern 'rror|TS\d+' | Select-Object -First 3
}
Pop-Location
$inputs = @()
foreach ($f in $Frames) { $inputs += '-i'; $inputs += (Join-Path $stills "${Name}_$f.png") }
$n = $Frames.Count
$fc = ((0..($n - 1) | ForEach-Object { "[$_]scale=${Width}:-1[s$_]" }) -join ';') + ';' + ((0..($n - 1) | ForEach-Object { "[s$_]" }) -join '') + "hstack=$n"
ffmpeg -y -loglevel error @inputs -filter_complex $fc (Join-Path $stills "${Name}_sheet.png")
Write-Output (Join-Path $stills "${Name}_sheet.png")
