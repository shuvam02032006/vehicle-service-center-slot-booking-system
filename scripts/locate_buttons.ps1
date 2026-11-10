Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Image size: $($img.Width) x $($img.Height)"
# Find the blue button "Book Service Slot"
# Blue color: B > 200, R < 50
$bMinX = 9999; $bMaxX = 0; $bMinY = 9999; $bMaxY = 0;
for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt ($img.Width / 2); $x++) {
        $c = $img.GetPixel($x, $y)
        if ($c.B -gt 210 -and $c.R -lt 40 -and $c.G -lt 140) {
            if ($x -lt $bMinX) { $bMinX = $x }
            if ($x -gt $bMaxX) { $bMaxX = $x }
            if ($y -lt $bMinY) { $bMinY = $y }
            if ($y -gt $bMaxY) { $bMaxY = $y }
        }
    }
}
Write-Output "Book Service Slot button bounds: X=[$bMinX, $bMaxX], Y=[$bMinY, $bMaxY]"

# Find Mutex Simulation button outline (blue outline)
# Scanning to the right of bMaxX
$mMinX = 9999; $mMaxX = 0; $mMinY = 9999; $mMaxY = 0;
for ($y = $bMinY; $y -le $bMaxY; $y++) {
    for ($x = ($bMaxX + 5); $x -le ($bMaxX + 250); $x++) {
        $c = $img.GetPixel($x, $y)
        if ($c.B -gt 200 -and $c.R -lt 50) {
            if ($x -lt $mMinX) { $mMinX = $x }
            if ($x -gt $mMaxX) { $mMaxX = $x }
            if ($y -lt $mMinY) { $mMinY = $y }
            if ($y -gt $mMaxY) { $mMaxY = $y }
        }
    }
}
Write-Output "Mutex Simulation button bounds: X=[$mMinX, $mMaxX], Y=[$mMinY, $mMaxY]"

$img.Dispose()
