-- ============ ENUMS ============
create type public.disaster_type as enum ('flood','earthquake','drought','landslide','storm','wildfire','other');
create type public.report_status as enum ('submitted','under_review','matched','in_progress','resolved');
create type public.org_category as enum ('government','non_profit','community','donor');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  location text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- ============ DISASTER REPORTS ============
create table public.disaster_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  disaster_type public.disaster_type not null,
  location text not null,
  description text not null,
  severity int not null default 3,
  needs text[] not null default '{}',
  status public.report_status not null default 'submitted',
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.disaster_reports to authenticated;
grant all on public.disaster_reports to service_role;

alter table public.disaster_reports enable row level security;

create policy "Users can view own reports" on public.disaster_reports
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own reports" on public.disaster_reports
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own reports" on public.disaster_reports
  for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own reports" on public.disaster_reports
  for delete to authenticated using (auth.uid() = user_id);

-- ============ AID ORGANIZATIONS (public directory) ============
create table public.aid_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category public.org_category not null,
  description text not null,
  region text not null default 'National',
  amount_label text,
  deadline text,
  verified boolean not null default true,
  website text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

grant select on public.aid_organizations to anon, authenticated;
grant all on public.aid_organizations to service_role;

alter table public.aid_organizations enable row level security;

create policy "Anyone can view aid organizations" on public.aid_organizations
  for select to anon, authenticated using (true);

-- ============ SUPPORT GROUPS (public directory) ============
create table public.support_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  topic text not null,
  region text not null default 'National',
  member_count int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.support_groups to anon, authenticated;
grant all on public.support_groups to service_role;

alter table public.support_groups enable row level security;

create policy "Anyone can view support groups" on public.support_groups
  for select to anon, authenticated using (true);

-- ============ RELIEF UPDATES (public feed) ============
create table public.relief_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  region text not null default 'National',
  severity text not null default 'info',
  created_at timestamptz not null default now()
);

grant select on public.relief_updates to anon, authenticated;
grant all on public.relief_updates to service_role;

alter table public.relief_updates enable row level security;

create policy "Anyone can view relief updates" on public.relief_updates
  for select to anon, authenticated using (true);

-- ============ ASSISTANCE CENTERS (public map) ============
create table public.assistance_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  region text not null default 'National',
  services text[] not null default '{}',
  is_open boolean not null default true,
  phone text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

grant select on public.assistance_centers to anon, authenticated;
grant all on public.assistance_centers to service_role;

alter table public.assistance_centers enable row level security;

create policy "Anyone can view assistance centers" on public.assistance_centers
  for select to anon, authenticated using (true);

-- ============ updated_at trigger ============
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger disaster_reports_updated_at before update on public.disaster_reports
  for each row execute function public.handle_updated_at();

-- ============ auto-create profile on signup ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ SEED DATA ============
insert into public.aid_organizations (name, category, description, region, amount_label, deadline, verified, tags) values
('FEMA Individual Assistance', 'government', 'Financial help for homeowners and renters with uninsured disaster expenses including housing and personal property.', 'National', 'Up to $42,500', 'Rolling', true, '{housing,grants,flood}'),
('SBA Disaster Loans', 'government', 'Low-interest disaster loans for businesses, homeowners, and renters to repair or replace damaged property.', 'National', 'Up to $500,000', 'Rolling', true, '{loans,business,rebuilding}'),
('Red Cross Emergency Relief', 'non_profit', 'Immediate emergency assistance: shelter, food, health services, and emotional support after disasters.', 'National', 'Emergency aid', 'Ongoing', true, '{shelter,food,emergency}'),
('Habitat for Humanity Rebuild', 'non_profit', 'Volunteer labor, tool lending, and affordable rebuilding support for disaster-affected homeowners.', 'National', 'In-kind support', 'Ongoing', true, '{rebuilding,volunteers,housing}'),
('Coastal Small Business Grant', 'non_profit', 'Emergency funding for local businesses affected by storm surges and flooding.', 'Southeast', 'Up to $15,000', 'Oct 30', true, '{business,grants,storm}'),
('Rebuild Materials Fund', 'community', 'Crowdfunded pool providing lumber, roofing, and construction supplies to neighbors in need.', 'Western Region', 'Available now', 'Ongoing', true, '{materials,community,rebuilding}'),
('Farmers Drought Relief Program', 'government', 'Assistance for agricultural producers facing crop and livestock losses due to drought.', 'Midwest', 'Up to $125,000', 'Dec 15', true, '{drought,agriculture,grants}'),
('Mutual Aid Network', 'community', 'Neighbor-to-neighbor support coordinating meals, childcare, and cleanup crews.', 'National', 'Volunteer-led', 'Ongoing', true, '{community,volunteers,food}'),
('GlobalGiving Disaster Recovery', 'donor', 'Donor-backed grants channeled to vetted local organizations leading recovery efforts.', 'International', 'Varies', 'Ongoing', true, '{donor,grants,recovery}'),
('United Way Recovery Fund', 'non_profit', 'Long-term recovery support including case management, financial counseling, and rebuilding grants.', 'National', 'Case-by-case', 'Ongoing', true, '{recovery,counseling,grants}');

insert into public.support_groups (name, description, topic, region, member_count) values
('Flood Survivors Together', 'A space for those rebuilding after floods to share resources, contractor tips, and encouragement.', 'Flood Recovery', 'Western Region', 1284),
('Earthquake Rebuild Circle', 'Connect with neighbors navigating structural repairs and seismic retrofitting.', 'Earthquake', 'West Coast', 642),
('Drought Resilience Farmers', 'Agricultural community sharing water-saving strategies and relief program updates.', 'Drought', 'Midwest', 938),
('Storm Recovery Families', 'Support and practical help for families displaced by hurricanes and severe storms.', 'Storm', 'Southeast', 2105),
('Volunteers & Helpers Hub', 'For volunteers offering labor, tools, transport, and skills to affected communities.', 'Volunteering', 'National', 3470),
('Mental Health & Recovery', 'A compassionate group focused on emotional wellbeing during the recovery journey.', 'Wellbeing', 'National', 1567);

insert into public.relief_updates (title, body, region, severity) values
('New FEMA disaster declaration approved', 'Federal assistance is now available for residents in newly declared counties. Applications open immediately.', 'Western Region', 'high'),
('Additional shelter capacity opened', 'Three new emergency shelters with 400 combined beds are now operating downtown.', 'Southeast', 'info'),
('Free debris removal program launched', 'Crews are available for no-cost debris and hazard removal for affected households this month.', 'Midwest', 'info'),
('Small business grant deadline extended', 'The Coastal Small Business Grant deadline has been extended to October 30 due to high demand.', 'Southeast', 'medium');

insert into public.assistance_centers (name, address, region, services, is_open, phone, lat, lng) values
('Asheville Recovery Hub', '122 Commerce St, Asheville, NC', 'Western Region', '{Water,Hot Meals,Power Charging,Wifi}', true, '800-555-0142', 35.5951, -82.5515),
('Riverside Relief Center', '88 Lakeview Ave, Riverside', 'Western Region', '{Shelter,First Aid,Supplies}', true, '800-555-0188', 35.61, -82.56),
('Unity Baptist Supply Point', '40 Faith Rd, Greenville', 'Southeast', '{Water,Food,Clothing}', true, '800-555-0199', 34.85, -82.39),
('Civic Heights Distribution', '215 Civic Center Blvd', 'Midwest', '{Supplies,Tools,Information}', false, '800-555-0123', 41.87, -87.62),
('Coastal Resource Station', '12 Harbor Way', 'Southeast', '{First Aid,Shelter,Pet Care}', true, '800-555-0167', 32.08, -81.09);