Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's inspect what is at x=590..650
# The SUV is around x=565..820.
# The car bumper is around x=565 at y=100..150!
# Notice: the word "System" was at y=25..60! The car bumper is at y=85..160!
# So the word "System" was only in the sky above the bumper!
Write-Output "Checking car bumper height at x=565..585:"
for ($y = 70; $y -le 160; $y += 10) {
    $c = $img.GetPixel(575, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
