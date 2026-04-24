$files = @(
  'app\(admin)\admin\activity\page.js',
  'app\(admin)\admin\analytics\page.js',
  'app\(admin)\admin\dashboard\page.js',
  'app\(admin)\admin\invoices\page.js',
  'app\(admin)\admin\merchants\page.js',
  'app\(admin)\admin\reports\page.js',
  'app\(admin)\admin\settings\appearance\page.js',
  'app\(admin)\admin\settings\email\page.js',
  'app\(admin)\admin\settings\general\page.js',
  'app\(admin)\admin\settings\notifications\page.js',
  'app\(admin)\admin\settings\payment\page.js',
  'app\(admin)\admin\settings\security\page.js',
  'app\(admin)\admin\settings\page.js',
  'app\(admin)\admin\stores\page.js',
  'app\(admin)\admin\subscriptions\page.js',
  'app\(admin)\admin\users\page.js',
  'app\(admin)\admin\layout.js'
)

$basePath = 'd:\final\PHONE GIFTS\tejaratk'

foreach ($f in $files) {
  $path = Join-Path $basePath $f
  if (Test-Path $path) {
    $content = [System.IO.File]::ReadAllText($path)
    
    $content = $content -replace 'blue-800', 'brand-800'
    $content = $content -replace 'blue-700', 'brand-800'
    $content = $content -replace 'blue-600', 'brand-700'
    $content = $content -replace 'blue-500', 'brand-600'
    $content = $content -replace 'blue-400', 'brand-400'
    $content = $content -replace 'blue-300', 'brand-300'
    $content = $content -replace 'blue-200', 'brand-200'
    $content = $content -replace 'blue-100', 'brand-100'
    $content = $content -replace 'blue-50', 'brand-50'
    
    $content = $content -replace 'indigo-600', 'brand-600'
    $content = $content -replace 'indigo-500', 'brand-500'
    $content = $content -replace 'indigo-400', 'brand-400'
    
    $content = $content -replace 'purple-800', 'gold-800'
    $content = $content -replace 'purple-700', 'gold-700'
    $content = $content -replace 'purple-600', 'gold-700'
    $content = $content -replace 'purple-500', 'gold-600'
    $content = $content -replace 'purple-400', 'gold-400'
    
    $content = $content -replace 'pink-600', 'walnut-600'
    $content = $content -replace 'pink-500', 'walnut-500'
    $content = $content -replace 'pink-400', 'walnut-400'
    
    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Updated: $f"
  } else {
    Write-Host "NOT FOUND: $f"
  }
}

Write-Host "Done!"
