Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\blue-car-card.jpg").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# In media_1794237982346_2fd4f6a0.jpg, the inner picture has rounded corners:
# Let's inspect where the inner picture is
# The card has title at top "Real-Time Facility Status", then the photo is from y ~ 65 to ~ 290
# Let's crop just the photo rectangle
$rPhoto = New-Object System.Drawing.Rectangle(40, 70, 425, 215)
$bmp = New-Object System.Drawing.Bitmap($rPhoto.Width, $rPhoto.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rPhoto.Width, $rPhoto.Height)), $rPhoto, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\blue-car-photo.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Also let's crop just the car itself:
$rCarOnly = New-Object System.Drawing.Rectangle(90, 100, 260, 120)
$bmpCar = New-Object System.Drawing.Bitmap($rCarOnly.Width, $rCarOnly.Height)
$gCar = [System.Drawing.Graphics]::FromImage($bmpCar)
$gCar.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rCarOnly.Width, $rCarOnly.Height)), $rCarOnly, [System.Drawing.GraphicsUnit]::Pixel)
$bmpCar.Save((Resolve-Path "public\images").Path + "\blue-car-only.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$gCar.Dispose()
$bmpCar.Dispose()
$img.Dispose()
Write-Output "Cropped blue-car-photo.png and blue-car-only.png"
