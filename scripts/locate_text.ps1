Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's inspect the banner region from x=186..650, y=58..186
# Badge area: y=68..85, x=195..350
# Let's crop a detailed view of the text area
$rText = New-Object System.Drawing.Rectangle(190, 60, 450, 120)
$bmp = New-Object System.Drawing.Bitmap($rText.Width, $rText.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rText.Width, $rText.Height)), $rText, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path "public\images").Path + "\banner-text-region.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

# Also let's inspect the exact background colors around the badge and description
# Background is a very soft light-blue to white gradient:
# At y=75, x=190:
$c1 = $img.GetPixel(195, 75)
Write-Output "At x=195, y=75 (before badge): R=$($c1.R), G=$($c1.G), B=$($c1.B)"

# Background at y=130 (description area), x=195:
$c2 = $img.GetPixel(195, 130)
Write-Output "At x=195, y=130 (description start): R=$($c2.R), G=$($c2.G), B=$($c2.B)"

$c3 = $img.GetPixel(550, 130)
Write-Output "At x=550, y=130 (description end): R=$($c3.R), G=$($c3.G), B=$($c3.B)"

$img.Dispose()
Write-Output "banner-text-region.png saved."
