Add-Type -AssemblyName System.Drawing

$p = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794243371552_69b1ed0b.jpg"
$img = [System.Drawing.Bitmap]::FromFile($p)

# The card rectangle:
# Top left corner: x=7, y=78
# Bottom right corner: x=1018, y=254
$r = New-Object System.Drawing.Rectangle(7, 78, 1011, 177)
$bmp = New-Object System.Drawing.Bitmap($r.Width, $r.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r.Width, $r.Height)), $r, [System.Drawing.GraphicsUnit]::Pixel)

$outPath = (Resolve-Path "public\images").Path + "\hero-banner-exact.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Saved hero-banner-exact.png ($($r.Width) x $($r.Height))"
