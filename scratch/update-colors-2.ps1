$files = @(
  'components\store-setup\payment-gateway-selector.js',
  'components\store-setup\license-form.js',
  'components\store-setup\brand-identity-form.js',
  'components\pricing\pricing-cards.js',
  'components\auth\AuthProvider.js',
  'components\admin\users-table.js',
  'components\admin\subscriptions-table.js',
  'components\admin\stores-table.js',
  'components\admin\reports-charts.js',
  'components\admin\admin-topbar.js',
  'components\admin\admin-sidebar.js',
  'components\admin\admin-settings-form.js',
  'components\dashboard\stats-card.js',
  'app\(auth)\forgot-password\page.js',
  'app\(admin)\admin\page.js',
  'app\(admin)\layout.js',
  'app\(dashboard)\dashboard\store-setup\page.js',
  'app\(dashboard)\dashboard\subscription\page.js',
  'app\(dashboard)\dashboard\invoices\page.js',
  'app\(dashboard)\dashboard\settings\page.js',
  'app\(dashboard)\dashboard\help\page.js',
  'app\error.js',
  'app\not-found.js'
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
    $content = $content -replace 'purple-300', 'gold-300'
    $content = $content -replace 'purple-200', 'gold-200'
    $content = $content -replace 'purple-100', 'gold-100'
    $content = $content -replace 'purple-50', 'gold-50'
    
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
