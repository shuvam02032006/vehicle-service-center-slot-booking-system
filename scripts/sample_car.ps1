Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\blue-car-full.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Image size: $($img.Width) x $($img.Height)"
# In 417 x 215:
# Car body: from x=55 to x=325, y=30 to y=155
# Lift posts: around x=70 and x=305
# Mechanic: around x=330 to x=395
Write-Output "Car region sampled."
$img.Dispose()
