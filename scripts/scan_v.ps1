Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\banner-text-region.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Scanning vertically at x=100 (inside text column) for dark pixels..."
for ($y = 0; $y -lt $img.Height; $y += 2) {
    $c = $img.GetPixel(100, $y)
    $brightness = [int]($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
    if ($brightness -lt 200) {
        Write-Output "y=$y : Brightness=$brightness (Text)"
    }
}

$img.Dispose()
