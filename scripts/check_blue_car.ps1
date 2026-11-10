Add-Type -AssemblyName System.Drawing

$src = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794237982346_2fd4f6a0.jpg"
$img = [System.Drawing.Bitmap]::FromFile($src)
Write-Output "Image size: $($img.Width) x $($img.Height)"

# Let's save a copy to public/images to check
$img.Save((Resolve-Path "public\images").Path + "\blue-car-card.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
Write-Output "Saved blue-car-card.jpg"
