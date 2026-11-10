Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794238102534_1d31a217.jpg"
Copy-Item $src "public\images\sidebar-reference.jpg" -Force

$img = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\sidebar-reference.jpg").Path)
# Building is from y=330 to height
$cropHeight = $img.Height - 330
$r = New-Object System.Drawing.Rectangle(0, 330, $img.Width, $cropHeight)
$bmp = New-Object System.Drawing.Bitmap($r.Width, $r.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r.Width, $r.Height)), $r, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\sidebar-building-hd.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

# Also crop the top logo area (0 to 65)
$rLogo = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 75)
$bmpLogo = New-Object System.Drawing.Bitmap($rLogo.Width, $rLogo.Height)
$gLogo = [System.Drawing.Graphics]::FromImage($bmpLogo)
$gLogo.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rLogo.Width, $rLogo.Height)), $rLogo, [System.Drawing.GraphicsUnit]::Pixel)
$bmpLogo.Save((Resolve-Path "public\images").Path + "\sidebar-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$gLogo.Dispose()
$bmpLogo.Dispose()

$img.Dispose()
Write-Host "Sidebar reference and assets cropped successfully!"
