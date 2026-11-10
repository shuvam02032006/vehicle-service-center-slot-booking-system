Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\sidebar-reference.jpg").Path
$img = [System.Drawing.Image]::FromFile($src)

# 1. Precise Logo crop: y=10 to y=60, width=190
$rLogo = New-Object System.Drawing.Rectangle(15, 12, 160, 48)
$bmpLogo = New-Object System.Drawing.Bitmap($rLogo.Width, $rLogo.Height)
$gLogo = [System.Drawing.Graphics]::FromImage($bmpLogo)
$gLogo.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gLogo.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gLogo.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gLogo.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rLogo.Width, $rLogo.Height)), $rLogo, [System.Drawing.GraphicsUnit]::Pixel)
$bmpLogo.Save((Resolve-Path "public\images").Path + "\sidebar-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$gLogo.Dispose()
$bmpLogo.Dispose()

# 2. Garage image crop: from y=365 to bottom
$cropTop = 365
$cropH = $img.Height - $cropTop
$rBldg = New-Object System.Drawing.Rectangle(0, $cropTop, $img.Width, $cropH)
$bmpBldg = New-Object System.Drawing.Bitmap($rBldg.Width, $rBldg.Height)
$gBldg = [System.Drawing.Graphics]::FromImage($bmpBldg)
$gBldg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gBldg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gBldg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gBldg.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rBldg.Width, $rBldg.Height)), $rBldg, [System.Drawing.GraphicsUnit]::Pixel)
$bmpBldg.Save((Resolve-Path "public\images").Path + "\sidebar-building-hd.png", [System.Drawing.Imaging.ImageFormat]::Png)
$gBldg.Dispose()
$bmpBldg.Dispose()

$img.Dispose()
Write-Output "Assets cropped successfully!"
