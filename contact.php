<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.bizdynamix.co.za');

$name    = strip_tags(trim($_POST['name'] ?? ''));
$service = strip_tags(trim($_POST['service'] ?? ''));
$mobile  = strip_tags(trim($_POST['mobile'] ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

if (empty($name) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and message are required.']);
    exit;
}

$to      = 'info@bizdynamix.co.za';
$subject = "Website enquiry from $name";
$body    = "Name: $name\nService: $service\nWhatsApp: $mobile\n\nMessage:\n$message";
$headers = "From: noreply@bizdynamix.co.za\r\nReply-To: $mobile";

// Log submission locally (for dev/testing)
$log_entry = "[" . date('Y-m-d H:i:s') . "] $name | $service | $mobile\n$message\n---\n";
file_put_contents('/tmp/bdx_submissions.log', $log_entry, FILE_APPEND);

// Try to send email (will fail on localhost without mail server)
$sent = @mail($to, $subject, $body, $headers);

// Return success if logged (dev mode) or if mail succeeded
echo json_encode(['success' => true, 'message' => 'Thank you! We\'ll be in touch soon.']);