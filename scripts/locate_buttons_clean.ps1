Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-banner-exact.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

$bMinX = 9999; $bMaxX = 0; $bMinY = 9999; $bMaxY = 0;
for ($y = 80; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt 300; $x++) {
        $c = $img.GetPixel($x, $y)
        if ($c.B -gt 210 -and $c.R -lt 40 -and $c.G -lt 140) {
            if ($x -lt $bMinX) { $bMinX = $x }
            if ($x -gt $bMaxX) { $bMaxX = $x }
            if ($y -lt $bMinY) { $bMinY = $y }
            if ($y -gt $bMaxY) { $bMaxY = $y }
        }
    }
}
Write-Output "Button 1: X=[$bMinX, $bMaxX], Y=[$bMinY, $bMaxY]"

$mMinX = 9999; $mMaxX = 0; $mMinY = 9999; $mMaxY = 0;
for ($y = $bMinY; $y -le $bMaxY; $y++) {
    for ($x = ($bMaxX + 5); $x -le ($bMaxX + 250); $x++) {
        $c = $img.GetPixel($x, $y)
        if ($c.B -gt 180 -and $c.R -lt 50) {
            if ($x -lt $mMinX) { $mMinX = $x }
            if ($x -gt $mMaxX) { $mMaxX = $x }
            if ($y -lt $mMinY) { $mMinY = $y }
            if ($y -gt $mMaxY) { $mMaxY = $y }
        }
    }
}
Write-Output "Button 2: X=[$mMinX, $mMaxX], Y=[$mMinY, $mMaxY]"

$img.Dispose()
