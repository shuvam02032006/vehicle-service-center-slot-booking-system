Add-Type -AssemblyName System.Drawing
$p = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794243371552_69b1ed0b.jpg"
$img = [System.Drawing.Image]::FromFile($p)
Write-Output "Uploaded image size: $($img.Width) x $($img.Height)"
$img.Dispose()
