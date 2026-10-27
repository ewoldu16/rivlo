param([ValidateSet('dev','build','start','typecheck','lint','test','test:e2e')][string]$Task='dev')
$runtime=Join-Path $PSScriptRoot '.tools\node-v24.22.0-win-x64'
if(Test-Path (Join-Path $runtime 'node.exe')){$env:PATH="$runtime;$env:PATH"}
Set-Location $PSScriptRoot
& npm.cmd run $Task
