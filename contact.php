<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.bizdynamix.co.za');

$name    = strip_tags(trim($_POST['name']    ?? ''));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$service = strip_tags(trim($_POST['service'] ?? ''));
$mobile  = strip_tags(trim($_POST['mobile']  ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

if (empty($name) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and message are required.']);
    exit;
}

// ── Format WhatsApp number (SA format) ──
$wa_number = preg_replace('/[^0-9]/', '', $mobile);
if (strlen($wa_number) === 10 && $wa_number[0] === '0') {
    $wa_number = '27' . substr($wa_number, 1);
}
$wa_link = $wa_number ? "https://wa.me/{$wa_number}" : null;

// ── INTERNAL NOTIFICATION ──
$to_internal      = 'info@bizdynamix.co.za';
$subject_internal = "New enquiry: {$name} — {$service}";
$html_internal    = buildInternalEmail($name, $email ?: 'Not provided', $service, $mobile ?: 'Not provided', $message, $wa_link);

$h  = "MIME-Version: 1.0\r\n";
$h .= "Content-Type: text/html; charset=UTF-8\r\n";
$h .= "From: BizDynamix Website <noreply@bizdynamix.co.za>\r\n";
if ($email) $h .= "Reply-To: {$name} <{$email}>\r\n";

$sent = mail($to_internal, $subject_internal, $html_internal, $h);

// ── CLIENT AUTO-REPLY ──
if ($email && $sent) {
    $subject_reply = "We got your message, {$name} — here's what happens next";
    $html_reply    = buildClientEmail($name, $service);

    $hr  = "MIME-Version: 1.0\r\n";
    $hr .= "Content-Type: text/html; charset=UTF-8\r\n";
    $hr .= "From: BizDynamix <info@bizdynamix.co.za>\r\n";

    mail($email, $subject_reply, $html_reply, $hr);
}

echo json_encode(['success' => $sent]);


// ═══════════════════════════════════════════════════
//  INTERNAL — Lead notification to BizDynamix
// ═══════════════════════════════════════════════════
function buildInternalEmail($name, $email, $service, $mobile, $message, $wa_link) {
    $time   = date('d M Y · H:i');
    $wa_btn = $wa_link
        ? "<a href='{$wa_link}' style='display:inline-block;background:#00e5c8;color:#000000;padding:14px 32px;border-radius:50px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.03em;box-shadow:0 8px 24px rgba(0,229,200,0.25);'>📱 WhatsApp {$name}</a>"
        : "<span style='font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;'>No mobile number provided</span>";

    $row = function($label, $value) {
        return "
        <tr>
          <td style='padding:20px 0;width:35%;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);'>
            <span style='font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;'>{$label}</span>
          </td>
          <td style='padding:20px 0;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);padding-left:24px;'>
            <span style='font-size:15px;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;line-height:1.6;'>{$value}</span>
          </td>
        </tr>";
    };

    $email_display = $email !== 'Not provided'
        ? "<a href='mailto:{$email}' style='color:#00e5c8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;'>{$email}</a>"
        : "<span style='color:#6b7280;font-size:15px;font-family:Arial,sans-serif;'>Not provided</span>";

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090f;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#09090f;padding:48px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- Header with gradient accent -->
  <tr><td style="background:linear-gradient(135deg, rgba(0,229,200,0.05) 0%, rgba(124,108,245,0.05) 100%);border:1px solid rgba(0,229,200,0.15);border-radius:22px 22px 0 0;padding:48px 40px 36px;text-align:center;border-bottom:2px solid rgba(0,229,200,0.3);">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#00e5c8;margin-bottom:16px;">New Lead</div>
    <div style="font-size:32px;font-weight:800;color:#eeeef6;letter-spacing:-0.03em;margin-bottom:6px;">Biz<span style='color:#00e5c8;'>Dynamix</span></div>
    <div style="height:3px;background:linear-gradient(90deg, #00e5c8 0%, #7c6cf5 100%);width:48px;margin:0 auto;border-radius:2px;"></div>
  </td></tr>

  <!-- Lead info banner -->
  <tr><td style="background:rgba(0,229,200,0.08);border-left:1px solid rgba(0,229,200,0.15);border-right:1px solid rgba(0,229,200,0.15);padding:28px 40px;border-bottom:1px solid rgba(255,255,255,0.04);">
    <div style='font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00e5c8;margin-bottom:8px;'>Lead Name</div>
    <div style="font-size:28px;font-weight:800;color:#eeeef6;letter-spacing:-0.025em;line-height:1.2;">{$name}</div>
    <div style="font-size:12px;color:#6b7280;margin-top:8px;">📅 {$time}</div>
  </td></tr>

  <!-- Content sections -->
  <tr><td style="background:#111119;border-left:1px solid rgba(0,229,200,0.15);border-right:1px solid rgba(0,229,200,0.15);padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      {$row('Service Interested In', $service)}
      <tr>
        <td style='padding:20px 0;width:35%;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);'>
          <span style='font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;'>Email Address</span>
        </td>
        <td style='padding:20px 0;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);padding-left:24px;'>
          {$email_display}
        </td>
      </tr>
      {$row('Contact Number', $mobile)}
      <tr>
        <td style='padding:20px 0;width:35%;vertical-align:top;'>
          <span style='font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;'>Message</span>
        </td>
        <td style='padding:20px 0;vertical-align:top;padding-left:24px;'>
          <span style='font-size:14px;color:#9ca3af;line-height:1.8;'>{$message}</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CTA Section -->
  <tr><td style="background:linear-gradient(135deg, rgba(0,229,200,0.1) 0%, rgba(124,108,245,0.08) 100%);border-left:1px solid rgba(0,229,200,0.15);border-right:1px solid rgba(0,229,200,0.15);border-bottom:1px solid rgba(0,229,200,0.15);border-radius:0 0 22px 22px;padding:36px 40px;text-align:center;">
    <div style='font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00e5c8;margin-bottom:16px;'>Quick Response</div>
    {$wa_btn}
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:28px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.04);margin-top:8px;">
    <span style='font-size:12px;color:#6b7280;'>Contact received at bizdynamix.co.za</span><br>
    <span style='font-size:11px;color:#4b5563;margin-top:8px;display:block;'>Cape Town, South Africa · © 2026 BizDynamix</span>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
HTML;
}


// ═══════════════════════════════════════════════════
//  CLIENT AUTO-REPLY — Confirmation + portfolio upsell
// ═══════════════════════════════════════════════════
function buildClientEmail($name, $service) {
    $first = explode(' ', trim($name))[0];

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090f;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#09090f;padding:48px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- Header bar with gradient -->
  <tr><td style="background:linear-gradient(135deg, rgba(0,229,200,0.1) 0%, rgba(124,108,245,0.08) 100%);border:1px solid rgba(0,229,200,0.15);border-radius:22px 22px 0 0;padding:44px 40px;text-align:center;">
    <div style="font-size:24px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;">
      Biz<span style="color:#00e5c8;">Dynamix</span>
    </div>
    <div style="height:3px;background:linear-gradient(90deg, #00e5c8 0%, #7c6cf5 100%);width:48px;margin:16px auto 0;border-radius:2px;"></div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#111119;padding:48px;border-left:1px solid rgba(0,229,200,0.15);border-right:1px solid rgba(0,229,200,0.15);">

    <!-- Greeting -->
    <div style="font-size:28px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;line-height:1.15;margin-bottom:24px;">
      Got it, {$first}.
    </div>

    <p style="font-size:15px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;line-height:1.8;margin:0 0 20px;">
      Your enquiry about <span style='color:#00e5c8;font-weight:600;'>{$service}</span> is in. Someone on our team will be in touch within <span style='color:#00e5c8;font-weight:600;'>24 hours</span> — not with a proposal you didn't ask for, but to understand what you're actually trying to build.
    </p>

    <p style="font-size:15px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;line-height:1.8;margin:0 0 48px;">
      We've been building digital systems for South African businesses for over a decade. When we reach out, the first conversation is about your business — not ours.
    </p>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
      <tr><td style="border-top:1px solid rgba(0,229,200,0.1);font-size:0;">&nbsp;</td></tr>
    </table>

    <!-- Portfolio preview block -->
    <div style="background:linear-gradient(135deg, rgba(0,229,200,0.08) 0%, rgba(124,108,245,0.08) 100%);border:1px solid rgba(0,229,200,0.15);border-radius:16px;padding:32px;margin-bottom:24px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00e5c8;margin-bottom:12px;">While You Wait</div>

      <div style="font-size:20px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.025em;line-height:1.3;margin-bottom:14px;">
        See real projects for real SA businesses.
      </div>

      <p style="font-size:14px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;line-height:1.75;margin:0 0 24px;">
        A property tech platform built from scratch. A premium gin brand with the artist at the centre. An architecture firm's digital presence as considered as their buildings.
      </p>

      <!-- Portfolio CTA button -->
      <a href="https://www.bizdynamix.co.za/portfolio.html"
         style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;background:#00e5c8;color:#000000;font-family:Arial,Helvetica,sans-serif;text-decoration:none;letter-spacing:0.02em;border-radius:50px;box-shadow:0 8px 24px rgba(0,229,200,0.25);">
        View Our Work →
      </a>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:linear-gradient(135deg, rgba(0,229,200,0.05) 0%, rgba(124,108,245,0.05) 100%);border-left:1px solid rgba(0,229,200,0.15);border-right:1px solid rgba(0,229,200,0.15);border-bottom:1px solid rgba(0,229,200,0.15);border-radius:0 0 22px 22px;padding:32px 48px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <div style="font-size:12px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">© 2026 BizDynamix · Cape Town, South Africa</div>
          <div style="margin-top:6px;">
            <a href="mailto:info@bizdynamix.co.za" style="font-size:12px;color:#00e5c8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:600;">info@bizdynamix.co.za</a>
          </div>
        </td>
        <td align="right" valign="middle">
          <div style="font-size:18px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;">
            Biz<span style="color:#00e5c8;">Dynamix</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Legal footer -->
  <tr><td style="padding:20px 0;text-align:center;">
    <span style="font-size:11px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
      You're receiving this because you submitted a message on bizdynamix.co.za
    </span>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
HTML;
}
