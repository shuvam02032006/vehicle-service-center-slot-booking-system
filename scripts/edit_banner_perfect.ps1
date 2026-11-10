Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)

$outBmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)

# 1. Remove project badge: x=194..350, y=65..83
# Interpolate smoothly from y=64 (top) to y=84 (bottom)
for ($x = 194; $x -le 350; $x++) {
    $cTop = $img.GetPixel($x, 64)
    $cBot = $img.GetPixel($x, 84)
    for ($y = 65; $y -le 83; $y++) {
        $factor = ($y - 64) / (84 - 64)
        $r = [int]($cTop.R * (1 - $factor) + $cBot.R * $factor)
        $gCol = [int]($cTop.G * (1 - $factor) + $cBot.G * $factor)
        $b = [int]($cTop.B * (1 - $factor) + $cBot.B * $factor)
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# 2. Remove description: x=194..573, y=115..144
# Interpolate smoothly from y=113 (top) to y=146 (bottom)
for ($x = 194; $x -le 573; $x++) {
    $cTop = $img.GetPixel($x, 113)
    $cBot = $img.GetPixel($x, 146)
    for ($y = 114; $y -le 145; $y++) {
        $factor = ($y - 113) / (146 - 113)
        $r = [int]($cTop.R * (1 - $factor) + $cBot.R * $factor)
        $gCol = [int]($cTop.G * (1 - $factor) + $cBot.G * $factor)
        $b = [int]($cTop.B * (1 - $factor) + $cBot.B * $factor)
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Save full image in public/images
$outFullJpg = (Resolve-Path "public\images").Path + "\AutoPulse_Dashboard_Edited.jpg"
$outBmp.Save($outFullJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$outFullPng = (Resolve-Path "public\images").Path + "\AutoPulse_Dashboard_Edited.png"
$outBmp.Save($outFullPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Crop the exact Hero Banner (x=186..1012, y=58..186) -> 826 x 128
$rBanner = New-Object System.Drawing.Rectangle(186, 58, 826, 128)
$bannerBmp = New-Object System.Drawing.Bitmap($rBanner.Width, $rBanner.Height)
$gBanner = [System.Drawing.Graphics]::FromImage($bannerBmp)
$gBanner.DrawImage($outBmp, (New-Object System.Drawing.Rectangle(0, 0, $rBanner.Width, $rBanner.Height)), $rBanner, [System.Drawing.GraphicsUnit]::Pixel)

$bannerJpg = (Resolve-Path "public\images").Path + "\AutoPulse_Hero_Banner_Edited.jpg"
$bannerBmp.Save($bannerJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$bannerPng = (Resolve-Path "public\images").Path + "\AutoPulse_Hero_Banner_Edited.png"
$bannerBmp.Save($bannerPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Save into the Artifacts directory
$artifactDir = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571"
Copy-Item $outFullJpg (Join-Path $artifactDir "AutoPulse_Dashboard_Edited.jpg") -Force
Copy-Item $outFullPng (Join-Path $artifactDir "AutoPulse_Dashboard_Edited.png") -Force
Copy-Item $bannerJpg (Join-Path $artifactDir "AutoPulse_Hero_Banner_Edited.jpg") -Force
Copy-Item $bannerPng (Join-Path $artifactDir "AutoPulse_Hero_Banner_Edited.png") -Force

$gBanner.Dispose()
$bannerBmp.Dispose()
$g.Dispose()
$outBmp.Dispose()
$img.Dispose()

Write-Output "Exact pixel-level image editing completed successfully!"
