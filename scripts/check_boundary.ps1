Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\dashboard-banner-edited.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Checking around x=330..370 at y=73 (where badge ends and 'Updated' starts)..."
for ($x = 335; $x -le 370; $x++) {
    $c = $img.GetPixel($x, 73)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
