Add-Type -AssemblyName System.Drawing

$p = "C:\Users\shuva\.gemini\antigravity\brain\57f10509-e99e-40d6-ab48-6071a6c29571\.user_uploaded"
Get-ChildItem $p | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Output "$($_.Name): $($img.Width) x $($img.Height)"
    $img.Dispose()
}
