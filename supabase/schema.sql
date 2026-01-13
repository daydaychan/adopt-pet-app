
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  bio TEXT,
  home_type TEXT,
  has_garden BOOLEAN DEFAULT false,
  activity_level TEXT CHECK (activity_level IN ('Low', 'Moderate', 'High')),
  has_children BOOLEAN DEFAULT false,
  existing_pets TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Pets Table
CREATE TABLE pets (
  id TEXT PRIMARY KEY, -- Changed to TEXT to match mock data IDs easily ('1', '2' etc) or UUIDs
  name TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  distance TEXT, -- This might be dynamic based on user location in a real app, but storing string for now as per mock
  image TEXT,
  is_urgent BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  category TEXT CHECK (category IN ('Dogs', 'Cats', 'Birds', 'Other')),
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  weight TEXT,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Applications Table
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id TEXT REFERENCES pets(id),
  user_id UUID REFERENCES auth.users(id),
  pet_name TEXT, -- Denormalized for easier display
  pet_image TEXT, -- Denormalized for easier display
  status TEXT CHECK (status IN ('Submitted', 'Reviewing', 'Interview', 'Approved', 'Declined')) DEFAULT 'Submitted',
  date TIMESTAMPTZ DEFAULT NOW(),
  home_type TEXT,
  landlord_name TEXT,
  current_pets TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Favorites Table
CREATE TABLE favorites (
  user_id UUID REFERENCES auth.users(id),
  pet_id TEXT REFERENCES pets(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, pet_id)
);

-- Set up Row Level Security (RLS)

-- Profiles: Users can view all profiles (or just their own? usually just own for editing, public maybe for some parts. Let's say users can read own profile and update it)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pets: Public read, Admin write (since we don't have admin role, currently no one can write via API, relying on dashboard or seed)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pets are viewable by everyone" ON pets FOR SELECT USING (true);

-- Applications: Users can view and create their own applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
-- (Optional) Shelter staff (if existed) would need a policy to view all.

-- Favorites: Users can view and manage their own favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create Messages Table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- The user involved in the chat
  shelter_name TEXT NOT NULL,
  shelter_logo TEXT,
  pet_id TEXT, -- ID string from pets table (but since pets table uses UUID potentially, wait. Pets table uses string '1', '2' in seed but defined as UUID in schema? Ah schema says UUID. Seed says '1'. This is detailed check needed.
               -- Actually schema says: id UUID DEFAULT uuid_generate_v4().
               -- Seed says: VALUES ('1', ...). '1' is not valid UUID. 
               -- If seed failed, pets table is empty. User got "failed to fetch" earlier so connection was bad.
               -- But if seed ran with '1', it would fail on UUID type.
               -- Let's check schema again. `id UUID`.
               -- The seed I wrote in Step 113 used '1'. That seed likely FAILED if run.
               -- I should fix the seed to use UUIDs or change schema to TEXT if we want to match mock data exactly.
               -- Given the complexity, let's stick to TEXT for IDs in `pets` to match mock data easily, OR use UUIDs properly.
               -- MOCK_PETS use '1', '2'. 
               -- Let's change `pets.id` to TEXT to be flexible with mock data, OR just use UUIDs and update the mock data in the app to use the returned UUIDs.
               -- For now, let's assume `pet_id` in messages is TEXT to match `pets.id` whatever it is.
  pet_name TEXT,
  text TEXT,
  sender TEXT CHECK (sender IN ('user', 'shelter')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Messages Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- We also need to allow "shelter" to insert? In this demo, 'shelter' response is simulated by client or server action acting as user? 
-- In Messages.tsx, the 'shelter' response is generated by AI and inserted. Since the user is logged in, they are inserting 'shelter' message into their own chat?
-- Yes, technically the client inserts both user and shelter messages in this demo.
-- So the policy "Users can insert own messages" where (auth.uid() = user_id) allows user to insert a message where user_id is themselves, regardless of 'sender' field.

