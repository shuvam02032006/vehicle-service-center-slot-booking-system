Add-Type -AssemblyName System.Drawing

$inputPath = Join-Path $PSScriptRoot "..\public\images\hero-reference.jpg"
$img = [System.Drawing.Image]::FromFile((Resolve-Path $inputPath).Path)

# 1. Car hero
$r1 = New-Object System.Drawing.Rectangle(630, 78, 385, 112)
$b1 = New-Object System.Drawing.Bitmap($r1.Width, $r1.Height)
$g1 = [System.Drawing.Graphics]::FromImage($b1)
$g1.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r1.Width, $r1.Height)), $r1, [System.Drawing.GraphicsUnit]::Pixel)
$b1.Save((Join-Path $PSScriptRoot "..\public\images\banner-car.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$b1.Dispose()

# 2. Facility lift
$r2 = New-Object System.Drawing.Rectangle(755, 418, 255, 140)
$b2 = New-Object System.Drawing.Bitmap($r2.Width, $r2.Height)
$g2 = [System.Drawing.Graphics]::FromImage($b2)
$g2.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r2.Width, $r2.Height)), $r2, [System.Drawing.GraphicsUnit]::Pixel)
$b2.Save((Join-Path $PSScriptRoot "..\public\images\facility-lift.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$b2.Dispose()

# 3. Sidebar service center building
$r3 = New-Object System.Drawing.Rectangle(0, 340, 166, 235)
$b3 = New-Object System.Drawing.Bitmap($r3.Width, $r3.Height)
$g3 = [System.Drawing.Graphics]::FromImage($b3)
$g3.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $r3.Width, $r3.Height)), $r3, [System.Drawing.GraphicsUnit]::Pixel)
$b3.Save((Join-Path $PSScriptRoot "..\public\images\sidebar-building.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$b3.Dispose()

$img.Dispose()
Write-Host "All assets successfully extracted!"
