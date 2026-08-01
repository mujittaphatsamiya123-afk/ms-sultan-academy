-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  avatar_url text,
  phone text,
  role text not null default 'student' check (role in ('student', 'admin')),
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  subscription_plan text default 'free' check (subscription_plan in ('free', 'basic', 'pro')),
  subscription_expires_at timestamptz,
  is_suspended boolean default false,
  suspended_at timestamptz,
  suspended_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  category_id uuid references public.categories(id),
  price numeric(10,2) default 0,
  is_free boolean default false,
  level text default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  is_published boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  video_url text,
  content text,
  position int not null default 0,
  duration_minutes int,
  created_at timestamptz default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text default 'pdf',
  file_size_kb int,
  created_at timestamptz default now()
);

create table public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  website_url text,
  category text,
  created_at timestamptz default now()
);

-- Quizzes: lesson_id starts required, made optional in migration 0003 for standalone quizzes
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  pass_percentage int default 70,
  created_at timestamptz default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_option int not null,
  position int default 0
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  score int not null,
  passed boolean not null,
  attempted_at timestamptz default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  progress_percentage int default 0,
  completed boolean default false,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(student_id, course_id)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  certificate_url text,
  issued_at timestamptz default now(),
  unique(student_id, course_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id),
  amount numeric(10,2) not null,
  paystack_reference text unique not null,
  status text default 'pending' check (status in ('pending', 'success', 'failed')),
  payment_type text default 'course' check (payment_type in ('course', 'subscription')),
  coupon_code text,
  discount_amount numeric(10,2) default 0,
  invoice_number text unique,
  created_at timestamptz default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.profiles(id) on delete cascade,
  referred_id uuid references public.profiles(id) on delete cascade,
  reward_amount numeric(10,2) default 0,
  status text default 'pending' check (status in ('pending', 'rewarded')),
  created_at timestamptz default now(),
  unique(referred_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  category text,
  tags text[],
  meta_description text,
  cover_image_url text,
  author_id uuid references public.profiles(id),
  is_published boolean default false,
  created_at timestamptz default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, referral_code)
  values (
    new.id, new.email, new.raw_user_meta_data->>'full_name',
    substr(md5(random()::text), 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
