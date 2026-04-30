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
$curl_error = curl_error($ch);
curl_close($ch);

// Return response with appropriate status
http_response_code($http_code);
echo $response;

// Log errors if any
if ($curl_error) {
    error_log("API Proxy Error: $curl_error");
}
?>
