
-- Seed data for Pets table using data from constants.ts

INSERT INTO pets (id, name, breed, age, distance, image, is_new, category, gender, weight, location, description, is_urgent)
VALUES
  (
    '1',
    'Buddy',
    'Golden Retriever',
    '2 Years',
    '2.5 miles',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQsnFNbF-qMlVJWKk63dBuDVKyOB0eJQ6A73aPNlVfPaSbj1g4qCh4ajsPAEMgWPlJUKgVqv6veXuk5ndfhM2FXaKwBH9NBe359SldRpQsk5MnZuVzxD6d1_4oHl1Bz8jo884OOgTJZILf2o83q8KCvR1IKT23PV2t0yaIfDCEchl4lcM0s5fhOFkgq9wZJz0JGT8yGuzfYGW7ke9YMdjHP9gQL1a3A5d8g4h3A3FGHqF2P7PvSE2DurURpWYP-WFvqdH4hDWYC_-m',
    true,
    'Dogs',
    'Male',
    '25 kg',
    'Los Angeles, CA',
    'Buddy is a high-energy, affectionate Golden Retriever who loves long walks and playing fetch. He was rescued from a local shelter and is now looking for his forever home. He''s incredibly friendly with other dogs and has a heart of gold.',
    false
  ),
  (
    '2',
    'Luna',
    'Calico Cat',
    '1 year',
    '1.2 miles',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    false,
    'Cats',
    'Female',
    '4 kg',
    'Santa Monica, CA',
    'Luna is a graceful calico who enjoys quiet afternoons by the window. She''s very talkative and loves a good scratch behind the ears.',
    true
  ),
  (
    '3',
    'Max',
    'German Shepherd',
    '4 years',
    '5.0 miles',
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=800',
    false,
    'Dogs',
    'Male',
    '32 kg',
    'Beverly Hills, CA',
    'Max is a loyal protector and an intelligent companion. He needs an experienced owner who can give him the mental stimulation he craves.',
    false
  ),
  (
    '4',
    'Daisy',
    'Beagle Puppy',
    '3 months',
    '3.1 miles',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    false,
    'Dogs',
    'Female',
    '6 kg',
    'West Hollywood, CA',
    'Daisy is full of puppy energy! She loves to sniff everything and would be a great addition to an active family.',
    true
  )
ON CONFLICT (id) DO NOTHING;
