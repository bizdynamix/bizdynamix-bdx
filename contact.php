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
        ? "<a href='{$wa_link}' style='display:inline-block;background:#00e5c8;color:#000000;padding:13px 30px;border-radius:50px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.03em;'>WhatsApp {$name} →</a>"
        : "<span style='font-size:13px;color:#6b7280;font-family:Arial,sans-serif;'>No mobile provided</span>";

    $row = function($label, $value) {
        return "
        <tr>
          <td style='padding:18px 0;width:38%;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.06);'>
            <span style='font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;'>{$label}</span>
          </td>
          <td style='padding:18px 0;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.06);'>
            <span style='font-size:14px;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;line-height:1.7;'>{$value}</span>
          </td>
        </tr>";
    };

    $email_display = $email !== 'Not provided'
        ? "<a href='mailto:{$email}' style='color:#00e5c8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;'>{$email}</a>"
        : "<span style='color:#6b7280;font-size:14px;font-family:Arial,sans-serif;'>Not provided</span>";

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090f;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#09090f;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#111119;border:1px solid rgba(255,255,255,0.08);border-radius:18px 18px 0 0;padding:36px 44px 28px;text-align:center;">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#00e5c8;font-family:Arial,Helvetica,sans-serif;margin-bottom:14px;">New Website Enquiry</div>
    <div style="font-size:26px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;">Biz<span style="color:#00e5c8;">Dynamix</span></div>
    <div style="width:36px;height:2px;background:#00e5c8;margin:16px auto 0;"></div>
  </td></tr>

  <!-- Lead name banner -->
  <tr><td style="background:rgba(0,229,200,0.06);border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);padding:22px 44px;">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;margin-bottom:6px;">Lead</div>
    <div style="font-size:24px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.02em;">{$name}</div>
    <div style="font-size:12px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;margin-top:4px;">{$time}</div>
  </td></tr>

  <!-- Details -->
  <tr><td style="background:#111119;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);padding:0 44px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      {$row('Service', $service)}
      <tr>
        <td style="padding:18px 0;width:38%;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Email</span>
        </td>
        <td style="padding:18px 0;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.06);">
          {$email_display}
        </td>
      </tr>
      {$row('WhatsApp / Mobile', $mobile)}
      <tr>
        <td style="padding:18px 0;width:38%;vertical-align:top;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Message</span>
        </td>
        <td style="padding:18px 0;vertical-align:top;">
          <span style="font-size:14px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;line-height:1.75;">{$message}</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- WhatsApp CTA -->
  <tr><td style="background:#18182a;border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 18px 18px;padding:28px 44px;text-align:center;">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-family:Arial,Helvetica,sans-serif;margin-bottom:14px;">Quick Action</div>
    {$wa_btn}
  </td></tr>

  <!-- Meta -->
  <tr><td style="padding:20px 0;text-align:center;">
    <span style="font-size:11px;color:#374151;font-family:Arial,Helvetica,sans-serif;">Sent by the BizDynamix contact form &nbsp;·&nbsp; bizdynamix.co.za</span>
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
<body style="margin:0;padding:0;background:#f0f0f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f5;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

  <!-- Header bar -->
  <tr><td style="background:#09090f;border-radius:18px 18px 0 0;padding:32px 48px;text-align:center;">
    <div style="font-size:22px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;">
      Biz<span style="color:#00e5c8;">Dynamix</span>
    </div>
    <div style="width:32px;height:2px;background:#00e5c8;margin:14px auto 0;"></div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:48px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

    <!-- Greeting -->
    <div style="font-size:28px;font-weight:800;color:#0d0d18;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;line-height:1.15;margin-bottom:20px;">
      Got it, {$first}.
    </div>

    <p style="font-size:15px;color:#4b5563;font-family:Arial,Helvetica,sans-serif;line-height:1.8;margin:0 0 18px;">
      Your enquiry about <strong style="color:#0d0d18;">{$service}</strong> is in. Someone on our team will be in touch within <strong style="color:#0d0d18;">24 hours</strong> — not with a proposal you didn't ask for, but to understand what you're actually trying to build.
    </p>

    <p style="font-size:15px;color:#4b5563;font-family:Arial,Helvetica,sans-serif;line-height:1.8;margin:0 0 40px;">
      We've been building digital systems for South African businesses for over a decade. When we reach out, the first conversation is about your business — not ours.
    </p>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
      <tr><td style="border-top:1px solid #e5e7eb;font-size:0;">&nbsp;</td></tr>
    </table>

    <!-- Upsell block -->
    <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;margin-bottom:14px;">While You Wait</div>

    <div style="font-size:19px;font-weight:800;color:#0d0d18;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.025em;line-height:1.25;margin-bottom:12px;">
      See how we've built real digital systems for SA businesses.
    </div>

    <p style="font-size:14px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;line-height:1.8;margin:0 0 28px;">
      A property tech platform built from scratch. A premium gin brand with the artist at the centre. An architecture firm's digital presence as considered as their buildings. Three projects, three problems, zero templates.
    </p>

    <!-- Portfolio CTA button -->
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#09090f;border-radius:50px;">
          <a href="https://www.bizdynamix.co.za/portfolio.html"
             style="display:inline-block;padding:15px 36px;font-size:14px;font-weight:700;color:#00e5c8;font-family:Arial,Helvetica,sans-serif;text-decoration:none;letter-spacing:0.02em;">
            View Our Work →
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#09090f;border-radius:0 0 18px 18px;padding:28px 48px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <div style="font-size:12px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">© 2026 BizDynamix · Cape Town, South Africa</div>
          <div style="margin-top:5px;">
            <a href="mailto:info@bizdynamix.co.za" style="font-size:12px;color:#00e5c8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">info@bizdynamix.co.za</a>
          </div>
        </td>
        <td align="right" valign="middle">
          <div style="font-size:17px;font-weight:800;color:#eeeef6;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.03em;">
            Biz<span style="color:#00e5c8;">Dynamix</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Legal footer -->
  <tr><td style="padding:18px 0;text-align:center;">
    <span style="font-size:11px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">
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
