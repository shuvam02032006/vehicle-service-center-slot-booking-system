Add-Type -AssemblyName System.Drawing

$p = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($p)
Write-Output "Size: $($img.Width) x $($img.Height)"
Write-Output "Top-left (0,0): $($img.GetPixel(0,0))"
Write-Output "Center-left (0, 88): $($img.GetPixel(0, 88))"
Write-Output "Center (500, 88): $($img.GetPixel(500, 88))"
Write-Output "Center-right (1010, 88): $($img.GetPixel(1010, 88))"
$img.Dispose()
