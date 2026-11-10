Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\blue-car-card.jpg").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Let's inspect coordinates of the blue car in blue-car-card.jpg
# Scan for blue car pixels (strong blue, moderate red and green)
$minX = 9999; $maxX = 0; $minY = 9999; $maxY = 0;
for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $c = $img.GetPixel($x, $y)
        # Blue car color: Blue > 150, Blue > Red + 50, Blue > Green + 30
        if ($c.B -gt 140 -and $c.B -gt ($c.R + 40) -and $c.B -gt ($c.G + 20) -and $c.R -lt 100) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Blue pixels bounds: X=[$minX, $maxX], Y=[$minY, $maxY]"
$img.Dispose()
