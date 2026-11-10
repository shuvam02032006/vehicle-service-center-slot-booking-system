Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public\images\sidebar-reference.jpg").Path)

# Sample colors along the vertical center
Write-Output "Sampling colors from top to bottom:"
for ($y = 10; $y -lt $img.Height; $y += 30) {
    $c = $img.GetPixel(95, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$img.Dispose()
