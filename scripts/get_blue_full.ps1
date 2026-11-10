Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794237982346_2fd4f6a0.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's crop the blue car on lift workshop scene:
# In 507x442 image, the photo is from x=45 to 462, y=70 to 285 (417 x 215)
$r = New-Object System.Drawing.Rectangle(45, 70, 417, 215)
$bmp = New-Object System.Drawing.Bitmap($r.Width, $r.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r.Width, $r.Height)), $r, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\blue-car-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Saved blue-car-full.png"
