Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's inspect the bounding box of the hero card in the dashboard
# Left sidebar ends around x=170
# Banner card is around x=185 to 1010, y=55 to 175
Write-Output "Image size: $($img.Width) x $($img.Height)"

# Crop the banner card area
# Let's find exactly where the banner borders are
$rBanner = New-Object System.Drawing.Rectangle(185, 55, 825, 125)
$bmp = New-Object System.Drawing.Bitmap($rBanner.Width, $rBanner.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rBanner.Width, $rBanner.Height)), $rBanner, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\banner-card-raw.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Saved banner-card-raw.png"
