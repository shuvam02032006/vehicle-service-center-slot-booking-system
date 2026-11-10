Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's find where the text "Slot Booking System" completely ends in hero-banner-exact.png
# Let's scan horizontally at y=30..60 from x=450 to 600
for ($x = 480; $x -le 600; $x += 5) {
    $c = $img.GetPixel($x, 45)
    Write-Output "x=$x, y=45: R=$($c.R), G=$($c.G), B=$($c.B)"
}
$img.Dispose()
