Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Search around x=180..200, y=50..70 for the top-left rounded corner of the white/light-blue banner card
# And x=1000..1020, y=170..200 for the bottom-right
# Let's inspect rows and columns
for ($y = 50; $y -le 75; $y += 5) {
    $c = $img.GetPixel(250, $y)
    Write-Output "y=$y at x=250 : R=$($c.R), G=$($c.G), B=$($c.B)"
}

for ($y = 165; $y -le 195; $y += 5) {
    $c = $img.GetPixel(250, $y)
    Write-Output "y=$y at x=250 : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
