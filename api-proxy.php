<?php
// BizDynamix Chat API Proxy
// Forwards requests to VPS backend at 154.66.198.46:4000

header('Content-Type: application/json');

// Get the request method and body
$method = $_SERVER['REQUEST_METHOD'];
$input = file_get_contents('php://input');

// VPS backend URL
$backend_url = 'http://154.66.198.46:4000/api/chat';

// Initialize cURL
$ch = curl_init($backend_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

// Set request method and data
if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

// Set headers
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($input)
));

// Execute request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_errno = curl_errno($ch);
$curl_error = curl_error($ch);

curl_close($ch);

// Debug response
if ($curl_errno !== 0) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Backend connection failed',
        'curl_error' => $curl_error,
        'errno' => $curl_errno,
        'backend_url' => $backend_url
    ]);
    exit;
}

if (empty($response)) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Empty response from backend',
        'http_code' => $http_code,
        'backend_url' => $backend_url
    ]);
    exit;
}

// Return response with appropriate status
http_response_code($http_code);
echo $response;
?>
