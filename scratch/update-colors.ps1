$files = @(
  'app\(marketing)\page.js',
  'app\(marketing)\about\page.js',
  'app\(marketing)\contact\page.js',
  'app\(marketing)\cookies\page.js',
  'app\(marketing)\features\page.js',
  'app\(marketing)\pricing\page.js',
  'app\(marketing)\privacy\page.js',
  'app\(marketing)\terms\page.js',
  'app\(auth)\login\page.js',
  'app\(auth)\register\page.js',
  'components\ui\input.js',
  'components\ui\textarea.js',
  'components\ui\tabs.js',
  'components\ui\dialog.js',
  'components\ui\badge.js',
  'components\ui\file-upload.js',
  'components\subscription\subscription-status-card.js',
  'components\subscription\renewal-form.js',
  'components\store-setup\unified-store-setup-form.js',
  'components\store-setup\setup-wizard.js',
  'components\store-setup\setup-complete-card.js'
)

$basePath = 'd:\final\PHONE GIFTS\tejaratk'

foreach ($f in $files) {
  $path = Join-Path $basePath $f
  if (Test-Path $path) {
    $content = [System.IO.File]::ReadAllText($path)
    
    # Replace blue -> brand
    $content = $content -replace 'blue-800', 'brand-800'
    $content = $content -replace 'blue-700', 'brand-800'
    $content = $content -replace 'blue-600', 'brand-700'
    $content = $content -replace 'blue-500', 'brand-600'
    $content = $content -replace 'blue-400', 'brand-400'
    $content = $content -replace 'blue-300', 'brand-300'
    $content = $content -replace 'blue-200', 'brand-200'
    $content = $content -replace 'blue-100', 'brand-100'
    $content = $content -replace 'blue-50', 'brand-50'
    
    # Replace indigo -> brand
    $content = $content -replace 'indigo-600', 'brand-600'
    $content = $content -replace 'indigo-500', 'brand-500'
    $content = $content -replace 'indigo-400', 'brand-400'
    
    # Replace purple -> gold
    $content = $content -replace 'purple-800', 'gold-800'
    $content = $content -replace 'purple-700', 'gold-700'
    $content = $content -replace 'purple-600', 'gold-700'
    $content = $content -replace 'purple-500', 'gold-600'
    $content = $content -replace 'purple-400', 'gold-400'
    $content = $content -replace 'purple-300', 'gold-300'
    $content = $content -replace 'purple-200', 'gold-200'
    $content = $content -replace 'purple-100', 'gold-100'
    $content = $content -replace 'purple-50', 'gold-50'
    
    # Replace pink -> walnut
    $content = $content -replace 'pink-600', 'walnut-600'
    $content = $content -replace 'pink-500', 'walnut-500'
    $content = $content -replace 'pink-400', 'walnut-400'
    $content = $content -replace 'pink-300', 'walnut-300'
    
    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Updated: $f"
  } else {
    Write-Host "NOT FOUND: $f"
  }
}

Write-Host "Done!"
