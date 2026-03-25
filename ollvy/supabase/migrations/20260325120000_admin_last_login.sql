-- RPC function to update last_login_at for the currently logged in admin
create or replace function update_admin_last_login()
returns void
language plpgsql
security definer
as $$
begin
  update admin_users
  set last_login_at = now()
  where auth_user_id = auth.uid();
end;
$$;

-- Grant execute to authenticated users
grant execute on function update_admin_last_login() to authenticated;
