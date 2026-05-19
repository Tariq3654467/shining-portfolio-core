# Account verification setup

Members must verify **email** and **phone** to browse others and appear in search (enforced by database RLS).

## 1. Apply migrations

Run all files in `supabase/migrations/` on your Supabase project (SQL editor or CLI).

## 2. Deploy edge functions

```bash
supabase functions deploy send-verification-email
supabase functions deploy send-verification-sms
```

## 3. Configure secrets

```bash
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set RESEND_FROM_EMAIL="eBihe <noreply@yourdomain.com>"

supabase secrets set TWILIO_ACCOUNT_SID=ACxxxx
supabase secrets set TWILIO_AUTH_TOKEN=xxxx
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided automatically to edge functions.

## 4. Local development

Copy `.env.example` to `.env` and set Supabase keys. Use `VITE_DEV_SHOW_OTP=true` to display OTP codes in the app when Resend/Twilio are not configured.

## User flow

1. Log in → **Verify** in the header → `/verification`
2. Send email code → enter 6 digits
3. Enter phone with country code (e.g. `+9779876543210`) → send SMS → enter code
4. After both are verified, the profile shows a **Verified** badge and the member appears in **Active Members** / search for others.
