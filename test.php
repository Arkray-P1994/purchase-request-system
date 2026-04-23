<?php
$uri = '/purchase-request-api/public/request/update/51';
$path = rtrim($uri, '/');

$basePaths = [
    '/purchase-request-api/public/index.php',
    '/purchase-request-api/public',
];

foreach ($basePaths as $bp) {
    if (strpos($path, $bp) === 0) {
        $path = substr($path, strlen($bp));
        break;
    }
}

if (empty($path) || $path[0] !== '/') {
    $path = '/' . $path;
}

echo "Path: " . $path . "\n";
echo "Match: " . preg_match('#^/request/update/(\d+)$#', $path) . "\n";
