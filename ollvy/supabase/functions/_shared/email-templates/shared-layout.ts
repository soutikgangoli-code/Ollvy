// Deno mirror of apps/customer/lib/email/templates/shared-layout.ts.
// Kept in sync by hand - if you edit one, edit the other.
//
// Fonts: Inter for all prose (matches the site's primary UI font), JetBrains
// Mono for data points (order numbers, amounts, IDs, dates) via the mono()
// helper. Both load from Google Fonts where the client supports web fonts
// (Apple Mail, most Gmail) and fall back to clean system stacks everywhere else
// (Outlook). No em dashes anywhere in customer-facing copy.

const SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const BRAND = '#2D5A27';

// Wrap data points (order numbers, amounts, IDs, dates) in the brand mono face,
// matching how the website renders the same values.
export function mono(text: string): string {
  return `<span style="font-family: ${MONO}; font-size: 0.95em; letter-spacing: -0.01em;">${text}</span>`;
}

export function ctaButton(text: string, href: string): string {
  return `<a href="${href}" style="display: inline-block; background: ${BRAND}; color: #ffffff; padding: 13px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: ${SANS}; font-size: 15px;">${text}</a>`;
}

export function wrapHTML(bodyHTML: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  a { color: ${BRAND}; }
  h3 { font-size: 15px; font-weight: 600; margin: 24px 0 8px; color: #1a1a1a; }
  p { margin: 0 0 14px; }
  td { font-family: ${SANS}; }
</style>
</head>
<body style="margin: 0; padding: 0; background: #f4f4f2; font-family: ${SANS}; color: #1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f2;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background: #ffffff; border: 1px solid #ececec; border-radius: 12px;">
          <tr>
            <td style="padding: 28px 32px 0;">
              <div style="font-weight: 700; font-size: 20px; letter-spacing: -0.02em; color: #1a1a1a;">Ollvy</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 32px 8px; font-size: 15px; line-height: 1.6; color: #1a1a1a;">
              ${bodyHTML}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px 28px;">
              <img src="https://www.ollvy.com/logo.png" width="30" height="30" alt="Ollvy" style="display: block; width: 30px; height: 30px; border: 0; border-radius: 7px;">
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 32px 24px; border-top: 1px solid #efefef; background: #fafafa; border-radius: 0 0 12px 12px; font-size: 12px; line-height: 1.6; color: #8a8a8a;">
              Ollvy Collective Private Limited<br>
              123, DK1, Dhaula Kuan, New Delhi 110010, India<br>
              <a href="mailto:support@ollvy.com" style="color: #8a8a8a; text-decoration: underline;">support@ollvy.com</a><br><br>
              You are receiving this because you placed an order with Ollvy.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
