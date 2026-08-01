alter table public.quizzes
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists difficulty text default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  add column if not exists time_limit_minutes int,
  add column if not exists is_published boolean default false,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists updated_at timestamptz default now();

alter table public.quiz_questions add column if not exists explanation text;
alter table public.quizzes alter column lesson_id drop not null;

create index if not exists idx_quiz_questions_quiz_position on public.quiz_questions(quiz_id, position);

alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;

create policy "Admins manage quizzes" on public.quizzes for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone views published quizzes" on public.quizzes for select using (
  is_published = true or exists (select 1 from public.profiles where id = auth.uid() and role='admin')
);
create policy "Admins manage quiz questions" on public.quiz_questions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone views questions of published quiz" on public.quiz_questions for select using (
  exists (select 1 from public.quizzes q where q.id = quiz_id and (q.is_published = true or exists (select 1 from public.profiles where id = auth.uid() and role='admin')))
);
