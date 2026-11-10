Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

for ($x = 175; $x -le 200; $x += 2) {
    $c = $img.GetPixel($x, 100)
    Write-Output "x=$x at y=100 : R=$($c.R), G=$($c.G), B=$($c.B)"
}

for ($x = 1000; $x -le 1023; $x += 2) {
    $c = $img.GetPixel($x, 100)
    Write-Output "x=$x at y=100 : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
