# Shining Portfolio Core - ebihe.com Dating Platform

##  Quick Start

```bash
npm install
npm run dev
```

## Supabase Setup (REQUIRED for Login/Logout/Profile)

### 1. Create Supabase Project
```
https://supabase.com/dashboard → New Project
```
Wait for DB to be ready (~2min).

### 2. Get Credentials
```
Settings → API → Copy:
- Project URL 
- anon/public key
```

### 3. Configure .env.local
```
cp .env .env.local
# Edit .env.local with your REAL URL/key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_long_anon_key_here
```

**🚨 RESTART dev server after .env changes!**

### 4. Setup Database
```
# Option A: Local migrations
npx supabase init
npx supabase db push


### 5. Create Profiles Table + RLS (if missing)
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Auth user can read own profile
CREATE POLICY user_profiles ON profiles FOR SELECT USING (auth.uid() = id);
```

### 6. Test User Setup
```
1. Register/login via app
2. Supabase Dashboard → profiles table
3. Insert row with id = auth.users.id
```

## 📱 Features
- Full auth (login/register/logout)
- Protected profile/dashboard
- Responsive design
- React Router + Tanstack Query

## 🛠 Tech Stack
```
React 18 + Vite + TypeScript
Tailwind CSS + shadcn/ui
Supabase (Auth + DB)
React Router + Tanstack Query
```

## Scripts
```
npm run dev     # Development
npm run build   # Production build
npm run lint    # ESLint
npm run test    # Vitest
npm run preview # Preview build
```
