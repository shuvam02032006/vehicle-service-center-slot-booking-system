Add-Type -AssemblyName System.Drawing

$p = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794243371552_69b1ed0b.jpg"
$img = [System.Drawing.Bitmap]::FromFile($p)

# Find the bounding box of the rounded banner card inside the 1024x342 image
# The background outside is pure white or near white
# Let's inspect borders:
Write-Output "Scanning top border around y=50..100 at x=500..."
for ($y = 60; $y -le 100; $y += 2) {
    $c = $img.GetPixel(500, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Output "Scanning bottom border around y=240..300 at x=500..."
for ($y = 230; $y -le 270; $y += 2) {
    $c = $img.GetPixel(500, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Output "Scanning left border at y=170..."
for ($x = 0; $x -le 50; $x += 2) {
    $c = $img.GetPixel($x, 170)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Output "Scanning right border at y=170..."
for ($x = 1000; $x -le 1023; $x += 2) {
    $c = $img.GetPixel($x, 170)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
