param([string]$Output = '../adventure-art-check.jpg')
Add-Type -AssemblyName System.Drawing
$names = 'mango','durian','tea','mala','stickyRice','mooPing','bucket','coconut','khanom','chicken','goose','rider','pickup','motorbike','fruitCart','palm','house','fruitStall','person0','person1','person2','person3','person4','person5','mountain','sevenEleven','hall','dog','hay','irrigation'
$sheet = [System.Drawing.Bitmap]::new(1440, 1100)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#6d9165'))
$font = [System.Drawing.Font]::new('Arial', 12)
for ($i=0; $i -lt $names.Count; $i++) {
  $source = [System.Drawing.Bitmap]::new((Join-Path (Get-Location) ('public/game/' + $names[$i] + '.png')))
  $scale = [Math]::Min(210.0 / $source.Width, 185.0 / $source.Height)
  $width = [int]($source.Width * $scale); $height = [int]($source.Height * $scale)
  $left = ($i % 6) * 240; $top = [Math]::Floor($i / 6) * 220
  $graphics.DrawImage($source, [int]($left + (240-$width)/2), [int]($top + 190-$height), $width, $height)
  $graphics.DrawString($names[$i], $font, [System.Drawing.Brushes]::White, [single]($left + 12), [single]($top + 198))
  $source.Dispose()
}
$sheet.Save((Join-Path (Get-Location) $Output), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graphics.Dispose(); $font.Dispose(); $sheet.Dispose()
