Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\sidebar-reference.jpg").Path)
Write-Output "Image size: $($img.Width) x $($img.Height)"
$img.Dispose()
