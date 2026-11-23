# Supabase setup (one time)

1. Create a project at https://supabase.com.
2. If you ALREADY ran the old single-admin SQL: SQL Editor -> run `reset.sql` first (it deletes the old tables).
3. SQL Editor -> New query -> paste all of `setup_all.sql` -> Run. (Run it only once.)
4. Authentication -> Sign In / Providers -> Email:
   - Sign-ups: keep ENABLED (every creator makes their own space).
   - **Confirm email: turn OFF** (creators sign up with a name and code, there is no real email).
   - Minimum password length: keep 6.
5. Project Settings -> API: copy the Project URL and the anon / publishable key into `.env`.
   NEVER use the `service_role` / secret key in this project.

There is no admin user to create. Each creator opens `/admin/login?mode=signup`,
picks a name + code, and gets their own panel and their own link: `/their-name`.
