Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

Write-Output "Checking where description line 1 ends (x=550..620, y=124)..."
for ($x = 550; $x -le 610; $x += 2) {
    $c = $img.GetPixel($x, 124)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
