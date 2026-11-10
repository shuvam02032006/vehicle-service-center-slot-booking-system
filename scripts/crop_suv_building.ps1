Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Width is 1011, Height is 177
# The text and buttons end around x=480.
# The car and landscape start around x=520, and go to x=1011.
$cropX = 500
$cropW = $img.Width - $cropX
$r = New-Object System.Drawing.Rectangle($cropX, 0, $cropW, $img.Height)

$bmp = New-Object System.Drawing.Bitmap($r.Width, $r.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r.Width, $r.Height)), $r, [System.Drawing.GraphicsUnit]::Pixel)

# Now, let's create a smooth alpha fade on the left 70 pixels so it transitions seamlessly into white
for ($x = 0; $x -lt 70; $x++) {
    $alpha = $x / 70.0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Interpolate with pure white (or adjust alpha)
        $newR = [int]($c.R * $alpha + 255 * (1 - $alpha))
        $newG = [int]($c.G * $alpha + 255 * (1 - $alpha))
        $newB = [int]($c.B * $alpha + 255 * (1 - $alpha))
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $newR, $newG, $newB))
    }
}

$outPath = (Resolve-Path "public\images").Path + "\hero-suv-building.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Cropped hero-suv-building.png ($cropW x 177) with seamless left fade!"
