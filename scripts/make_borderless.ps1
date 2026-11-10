Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\blue-car-full.png").Path
$img = [System.Drawing.Bitmap]::FromFile($src)

# Create a borderless version with smooth rounded corners and subtle feathering so there is strictly NO border
$outBmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Create a rounded path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 24
$rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)
$path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
$path.AddArc($rect.Right - $r, $rect.Y, $r, $r, 270, 90)
$path.AddArc($rect.Right - $r, $rect.Bottom - $r, $r, $r, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $r, $r, $r, 90, 90)
$path.CloseFigure()

$g.SetClip($path)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)
$g.ResetClip()

$outBmp.Save((Resolve-Path "public\images").Path + "\blue-car-borderless.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$outBmp.Dispose()
$path.Dispose()
$img.Dispose()
Write-Output "Created blue-car-borderless.png successfully!"
