import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { generateSessionId } from '../../../lib/auth/session';

// Reset token TTL: 15 minutes
const RESET_TOKEN_TTL = 60 * 15;

function getAppUrl(env: ReturnType<typeof getEnv>) {
  const configured = env?.APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  return 'https://kelplratu.web.id';
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/lupa-password?error=1');

  const formData = await request.formData();
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return redirect('/admin/lupa-password?error=invalid');
  }

  // Look up admin by email (we respond generically even if not found to prevent enumeration)
  const admin = await env.DB.prepare('SELECT id, username, email FROM admin_user WHERE email = ?')
    .bind(email).first<{ id: number; username: string; email: string }>();

  if (!admin) {
    // For security: still show success, but do not send email
    // Redirect with "sent" to prevent email enumeration
    return redirect('/admin/lupa-password?sent=1');
  }

  // Generate secure reset token
  const token = generateSessionId();

  // Store token in KV: key = pwd_reset:<token>, value = username, TTL 15 min
  await env.SESSION_KV.put(`pwd_reset:${token}`, admin.username, {
    expirationTtl: RESET_TOKEN_TTL,
  });

  // Determine base URL for the reset link
  const appUrl = getAppUrl(env);
  const resetLink = `${appUrl}/admin/reset-password?token=${token}`;

  // Try to send email via Resend API
  const resendApiKey = (env as any).RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const emailBody = {
        from: 'noreply@kelplratu.web.id',
        to: [email],
        subject: 'Pemulihan Kata Sandi — Panel Admin Kelurahan Palabuhanratu',
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F8FAFC;">
            <div style="background: #0A3650; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700;">Reset Kata Sandi</h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.8;">Panel Admin Kelurahan Palabuhanratu</p>
            </div>
            <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0; border-top: none;">
              <h2 style="color: #0A3650; font-size: 18px; margin: 0 0 12px;">Halo, ${admin.username}</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 18px;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun admin Anda. Tekan tombol di bawah untuk melanjutkan.
              </p>
              <a href="${resetLink}" style="display: inline-block; background: #0A3650; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-bottom: 18px;">
                Atur Kata Sandi Baru
              </a>
              <p style="color: #64748B; font-size: 12px; line-height: 1.6; margin: 12px 0 0; border-top: 1px solid #F1F5F9; padding-top: 16px;">
                Tautan ini berlaku selama <strong>15 menit</strong>. Jika Anda tidak meminta reset ini, abaikan email ini.
              </p>
              <p style="color: #94A3B8; font-size: 11px; margin: 10px 0 0; word-break: break-all;">
                Jika tombol tidak berfungsi, buka link ini: ${resetLink}
              </p>
            </div>
          </div>
        `,
      };

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      });

      if (!res.ok) {
        console.error('[lupa-password] Resend API error:', await res.text());
      }
    } catch (err) {
      console.error('[lupa-password] Failed to send email:', err);
    }

    return redirect(`/admin/lupa-password?sent=1&email=${encodeURIComponent(email)}`);
  } else {
    // Development/Mock mode: show reset link directly on page
    console.log('[lupa-password] DEV MODE — Reset link:', resetLink);
    return redirect(`/admin/lupa-password?sent=1&email=${encodeURIComponent(email)}&dev_link=${encodeURIComponent(resetLink)}`);
  }
};
