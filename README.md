# CreatorSpace

React + Vite + Tailwind + Supabase multi-user creator portfolio. Each creator logs in with a name + code at `/admin` and gets their own website at `/their-name`.

## 1. Run locally
    npm install
    cp .env.example .env        # fill in your Supabase URL + anon key
    npm run dev

Follow `supabase/README.md` first so the database exists.

## 2. Push to GitHub
    git init
    git add .
    git commit -m "CreatorSpace"
    git branch -M main
    git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
    git push -u origin main

`.env` is git-ignored, so your keys are not uploaded.

## 3. Deploy on Vercel
1. vercel.com -> **Add New -> Project** -> import the GitHub repo (Framework: Vite is auto-detected).
2. **Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Deploy. `vercel.json` makes `/admin` and `/admin/login` work on refresh.
4. In Supabase -> **Authentication -> URL Configuration**, set *Site URL* to your Vercel URL.

Open `https://YOUR-SITE.vercel.app`, click **Create my space**, choose a name + code, and start adding content.
Your public link will be `https://YOUR-SITE.vercel.app/your-name`. Anyone else can create their own space the same way.
Every later `git push` redeploys automatically.

## Admin panel
Overview, Profile, Video, Social Links, Projects, Work Links, Contact, Appearance, Settings (show/hide/reorder sections).
About and Projects sections are hidden by default - turn them on in **Settings**.
