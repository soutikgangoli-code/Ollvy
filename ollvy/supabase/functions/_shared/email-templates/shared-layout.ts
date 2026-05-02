// Deno mirror of apps/customer/lib/email/templates/shared-layout.ts.
// Kept in sync by hand - if you edit one, edit the other.

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export function wrapHTML(bodyHTML: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: ${FONT_STACK};">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #111;">
    <div style="font-weight: bold; font-size: 20px; margin-bottom: 24px;">Ollvy</div>
    <div style="font-size: 15px; line-height: 1.55;">
      ${bodyHTML}
    </div>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
      Ollvy Collective Private Limited<br/>
      123, DK1, Dhaula Kuan<br/>
      New Delhi, 110010<br/>
      Delhi, India<br/><br/>
      Email: support@ollvy.com<br/><br/>
      You're receiving this because you placed an order with us.
    </div>
  </div>
</body>
</html>`;
}

export function ctaButton(text: string, href: string): string {
  return `<a href="${href}" style="display: inline-block; background: #000; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">${text}</a>`;
}
