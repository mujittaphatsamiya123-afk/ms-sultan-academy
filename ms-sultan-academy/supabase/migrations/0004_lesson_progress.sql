create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  is_completed boolean default false,
  completed_at timestamptz,
  unique(student_id, lesson_id)
);

alter table public.lesson_progress enable row level security;
create policy "Students manage own lesson progress" on public.lesson_progress
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
