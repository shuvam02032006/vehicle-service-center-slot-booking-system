Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\hero-reference.jpg").Path)
Write-Output "Hero reference dimensions: $($img.Width) x $($img.Height)"
$img.Dispose()
