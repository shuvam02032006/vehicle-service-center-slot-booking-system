Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\hero-reference.jpg").Path)
$r = New-Object System.Drawing.Rectangle(625, 68, 387, 128)
$bmp = New-Object System.Drawing.Bitmap($r.Width, $r.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r.Width, $r.Height)), $r, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\banner-car-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Cropped banner-car-full.png successfully!"
