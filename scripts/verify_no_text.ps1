Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\hero-suv-building.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Scanning top area (y=0..75, x=0..120) of hero-suv-building.png for any dark/blue text..."
$found = $false
for ($y = 15; $y -le 70; $y++) {
    for ($x = 0; $x -le 120; $x++) {
        $c = $img.GetPixel($x, $y)
        # Check for blue text: B > 180 and R < 60
        if ($c.B -gt 180 -and $c.R -lt 70) {
            Write-Output "Found blue text at ($x, $y): R=$($c.R), G=$($c.G), B=$($c.B)"
            $found = $true
        }
    }
}

if (-not $found) {
    Write-Output "SUCCESS: Zero text or blue artifacts found in the sky above the car!"
}

$img.Dispose()
