Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\banner-text-region.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)
# Note: banner-text-region is cropped from (190, 60) of media_1794236696412_b2298fab.jpg

# In this cropped image:
# Let's find the badge outline (blue outline around "OPERATING SYSTEMS PROJECT")
# In the badge, the border or fill has blue tint:
Write-Output "Scanning for badge in cropped image (y=5..30, x=0..200)..."
for ($y = 10; $y -le 25; $y += 3) {
    for ($x = 0; $x -le 250; $x += 10) {
        $c = $img.GetPixel($x, $y)
        if ($c.B -gt 230 -and $c.R -lt 210) {
            Write-Output "Blueish pixel at rel x=$x, y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
        }
    }
}

# Scan for "Updated : Nov 7, 2026"
# It has grey text color
Write-Output "Scanning for 'Updated' text..."
for ($x = 130; $x -le 250; $x += 5) {
    $c = $img.GetPixel($x, 17)
    if ($c.R -lt 150) {
        Write-Output "Dark/text pixel around x=$x, y=17 : R=$($c.R), G=$($c.G), B=$($c.B)"
    }
}

$img.Dispose()
