Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\banner-car.png").Path)
Write-Output "banner-car dimensions: $($img.Width) x $($img.Height)"
$img.Dispose()
