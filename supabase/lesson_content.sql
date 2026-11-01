-- Run once in the Supabase SQL editor. Contains no lyrics.
create table public.lesson_content (
  lesson text not null,
  key text not null,
  title text,
  body text not null,
  updated_at timestamptz default now(),
  primary key (lesson, key)
);
alter table public.lesson_content enable row level security;
create policy "public read" on public.lesson_content for select using (true);
revoke all on public.lesson_content from anon, authenticated;
grant select on public.lesson_content to anon, authenticated;
