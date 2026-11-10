Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Create a copy where we inpaint the text "Slot Booking System" from the sky
$cleanBmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$gClean = [System.Drawing.Graphics]::FromImage($cleanBmp)
$gClean.DrawImage($img, 0, 0, $img.Width, $img.Height)

# Inpaint any blue text pixels in x: 450 to 592, y: 18 to 68
for ($x = 450; $x -le 592; $x++) {
    $cTop = $img.GetPixel($x, 18)
    $cBot = $img.GetPixel($x, 70)
    for ($y = 19; $y -le 69; $y++) {
        $factor = ($y - 18) / (70 - 18)
        $r = [int]($cTop.R * (1 - $factor) + $cBot.R * $factor)
        $gCol = [int]($cTop.G * (1 - $factor) + $cBot.G * $factor)
        $b = [int]($cTop.B * (1 - $factor) + $cBot.B * $factor)
        $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Now crop the SUV and building starting from x=530 to 1011 (width = 481, height = 177)
$cropX = 530
$cropW = $cleanBmp.Width - $cropX
$rCrop = New-Object System.Drawing.Rectangle($cropX, 0, $cropW, $cleanBmp.Height)

$suvBmp = New-Object System.Drawing.Bitmap($rCrop.Width, $rCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gSuv = [System.Drawing.Graphics]::FromImage($suvBmp)
$gSuv.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSuv.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$gSuv.DrawImage($cleanBmp, (New-Object System.Drawing.Rectangle(0, 0, $rCrop.Width, $rCrop.Height)), $rCrop, [System.Drawing.GraphicsUnit]::Pixel)

# Smooth transition on the leftmost 45 pixels
for ($x = 0; $x -lt 45; $x++) {
    $alpha = $x / 45.0
    for ($y = 0; $y -lt $suvBmp.Height; $y++) {
        $c = $suvBmp.GetPixel($x, $y)
        $newR = [int]($c.R * $alpha + 255 * (1 - $alpha))
        $newG = [int]($c.G * $alpha + 255 * (1 - $alpha))
        $newB = [int]($c.B * $alpha + 255 * (1 - $alpha))
        $suvBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $newR, $newG, $newB))
    }
}

# Save clean hero-suv-building.png
$outPath = (Resolve-Path "public\images").Path + "\hero-suv-building.png"
$suvBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gSuv.Dispose()
$suvBmp.Dispose()
$gClean.Dispose()
$cleanBmp.Dispose()
$img.Dispose()

Write-Output "Cleaned and regenerated hero-suv-building.png without any text artifacts!"
