Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)
$outBmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)

# Global coordinates:
# 1. Badge removal area:
# Badge is in x: 194 to 345, y: 66 to 82.
# Let's inspect the exact boundaries of the badge
# Above badge: y=63..65 is pure background
# Below badge: y=84..86 is pure background
# For each x in 194..345, we interpolate between y=64 and y=85
for ($x = 194; $x -le 345; $x++) {
    $cTop = $img.GetPixel($x, 64)
    $cBot = $img.GetPixel($x, 85)
    for ($y = 65; $y -le 84; $y++) {
        $factor = ($y - 64) / (85 - 64)
        $r = [int]($cTop.R * (1 - $factor) + $cBot.R * $factor)
        $gCol = [int]($cTop.G * (1 - $factor) + $cBot.G * $factor)
        $b = [int]($cTop.B * (1 - $factor) + $cBot.B * $factor)
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# 2. Description removal area:
# Description is in y: 114 to 143.
# In x: from 195 to 580 (where the two lines of description text end, before the car/building).
# Let's find exactly where text ends by scanning from x=195 to 580
# Above description: y=111 is background below heading
# Below description: y=147 is background above buttons
for ($x = 194; $x -le 580; $x++) {
    $cTop = $img.GetPixel($x, 112)
    $cBot = $img.GetPixel($x, 146)
    for ($y = 113; $y -le 145; $y++) {
        $factor = ($y - 112) / (146 - 112)
        $r = [int]($cTop.R * (1 - $factor) + $cBot.R * $factor)
        $gCol = [int]($cTop.G * (1 - $factor) + $cBot.G * $factor)
        $b = [int]($cTop.B * (1 - $factor) + $cBot.B * $factor)
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

# Save full edited image
$outPath1 = (Resolve-Path "public\images").Path + "\dashboard-banner-edited.png"
$outBmp.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)

# Also save JPEG matching original
$outPathJpg = (Resolve-Path "public\images").Path + "\dashboard-banner-edited.jpg"
$outBmp.Save($outPathJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Also crop the exact banner region from this edited image (x=186..1012, y=58..186)
$rBanner = New-Object System.Drawing.Rectangle(186, 58, 826, 128)
$bannerBmp = New-Object System.Drawing.Bitmap($rBanner.Width, $rBanner.Height)
$gBanner = [System.Drawing.Graphics]::FromImage($bannerBmp)
$gBanner.DrawImage($outBmp, (New-Object System.Drawing.Rectangle(0, 0, $rBanner.Width, $rBanner.Height)), $rBanner, [System.Drawing.GraphicsUnit]::Pixel)
$bannerPath = (Resolve-Path "public\images").Path + "\banner-exact-edited.png"
$bannerBmp.Save($bannerPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Also copy both to artifacts directory so user can download/view
$artifactDir = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571"
Copy-Item $outPath1 (Join-Path $artifactDir "AutoPulse_Dashboard_Edited.png") -Force
Copy-Item $outPathJpg (Join-Path $artifactDir "AutoPulse_Dashboard_Edited.jpg") -Force
Copy-Item $bannerPath (Join-Path $artifactDir "AutoPulse_Hero_Banner_Edited.png") -Force

$gBanner.Dispose()
$bannerBmp.Dispose()
$g.Dispose()
$outBmp.Dispose()
$img.Dispose()

Write-Output "Successfully generated edited image and banner!"
