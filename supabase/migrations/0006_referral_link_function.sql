create or replace function public.link_referral(new_user_id uuid, code text)
returns void as $$
declare
  referrer uuid;
begin
  select id into referrer from public.profiles where referral_code = code;
  if referrer is not null then
    update public.profiles set referred_by = referrer where id = new_user_id;
    insert into public.referrals (referrer_id, referred_id) values (referrer, new_user_id);
  end if;
end;
$$ language plpgsql security definer;
