Add-Type -AssemblyName System.Drawing

$f1 = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794236696412_b2298fab.jpg"
$i1 = [System.Drawing.Image]::FromFile($f1)
Write-Output "b2298fab: $($i1.Width) x $($i1.Height)"
$i1.Dispose()

$f2 = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded\media_1794237982346_2fd4f6a0.jpg"
$i2 = [System.Drawing.Image]::FromFile($f2)
Write-Output "2fd4f6a0: $($i2.Width) x $($i2.Height)"
$i2.Dispose()
