create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(10,2) not null,
  max_uses int,
  used_count int default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.coupons enable row level security;
create policy "Admins manage coupons" on public.coupons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can read active coupons" on public.coupons for select using (is_active = true);

create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  created_at timestamptz default now(),
  unique(student_id, course_id)
);
alter table public.wishlist enable row level security;
create policy "Students manage own wishlist" on public.wishlist
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

create table public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);
alter table public.ai_chat_messages enable row level security;
create policy "Students manage own AI chats" on public.ai_chat_messages
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
create index idx_ai_chat_student_course on public.ai_chat_messages(student_id, course_id, created_at);
