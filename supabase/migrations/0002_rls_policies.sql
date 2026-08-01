alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.enrollments enable row level security;
alter table public.certificates enable row level security;
alter table public.payments enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.notifications enable row level security;
alter table public.referrals enable row level security;
alter table public.contact_messages enable row level security;

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Anyone can view published courses" on public.courses for select using (is_published = true);
create policy "Admins manage courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Students view own enrollments" on public.enrollments for select using (auth.uid() = student_id);
create policy "Students enroll themselves" on public.enrollments for insert with check (auth.uid() = student_id);

create policy "Students view own payments" on public.payments for select using (auth.uid() = student_id);
create policy "Admins view all payments" on public.payments for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Students view own certificates" on public.certificates for select using (auth.uid() = student_id);

create policy "Anyone can submit contact form" on public.contact_messages for insert with check (true);
create policy "Admins view contact messages" on public.contact_messages for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
