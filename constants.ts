
import { Pet, Conversation } from './types';

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 Years',
    distance: '2.5 miles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQsnFNbF-qMlVJWKk63dBuDVKyOB0eJQ6A73aPNlVfPaSbj1g4qCh4ajsPAEMgWPlJUKgVqv6veXuk5ndfhM2FXaKwBH9NBe359SldRpQsk5MnZuVzxD6d1_4oHl1Bz8jo884OOgTJZILf2o83q8KCvR1IKT23PV2t0yaIfDCEchl4lcM0s5fhOFkgq9wZJz0JGT8yGuzfYGW7ke9YMdjHP9gQL1a3A5d8g4h3A3FGHqF2P7PvSE2DurURpWYP-WFvqdH4hDWYC_-m',
    isNew: true,
    category: 'Dogs',
    gender: 'Male',
    weight: '25 kg',
    location: 'Los Angeles, CA',
    description: "Buddy is a high-energy, affectionate Golden Retriever who loves long walks and playing fetch. He was rescued from a local shelter and is now looking for his forever home. He's incredibly friendly with other dogs and has a heart of gold.",
    isFavorite: true
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Calico Cat',
    age: '1 year',
    distance: '1.2 miles',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    isUrgent: true,
    category: 'Cats',
    gender: 'Female',
    weight: '4 kg',
    location: 'Santa Monica, CA',
    description: "Luna is a graceful calico who enjoys quiet afternoons by the window. She's very talkative and loves a good scratch behind the ears.",
    isFavorite: true
  },
  {
    id: '3',
    name: 'Max',
    breed: 'German Shepherd',
    age: '4 years',
    distance: '5.0 miles',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=800',
    category: 'Dogs',
    gender: 'Male',
    weight: '32 kg',
    location: 'Beverly Hills, CA',
    description: "Max is a loyal protector and an intelligent companion. He needs an experienced owner who can give him the mental stimulation he craves.",
    isFavorite: false
  },
  {
    id: '4',
    name: 'Daisy',
    breed: 'Beagle Puppy',
    age: '3 months',
    distance: '3.1 miles',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    isUrgent: true,
    category: 'Dogs',
    gender: 'Female',
    weight: '6 kg',
    location: 'West Hollywood, CA',
    description: "Daisy is full of puppy energy! She loves to sniff everything and would be a great addition to an active family.",
    isFavorite: false
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'm1',
    shelterName: 'North Shore Animal League',
    shelterLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA00tSfjC0T89M8WwYBX3sYxzYtPQaR1htXzDkVFnfGsUjWGda5e879hCnFTpG2y68IadjAAMUBSpItrieqe2iNfMhugbXYkcGdpMAMFkAZQLj2LkebCSRwppr5y7xalwqFfCwHNWiCl_1HlOyYNnfKbsCJ_Tn0Cjnu7e6_ttN-pt2bQzpYIZRUQCrJUjMq4dJ3cQJNCF4AOi_1TuEH0mvzVb9i8nP44rQEGCAjUQjk1o0LYVMnZL6MeJb9enOyRUER0lckWODyKqFA',
    lastMessage: "Cooper's application was approved! 🎉",
    time: '10:42 AM',
    petName: 'Cooper',
    petBreed: 'Golden Retriever',
    petId: '#4492',
    isUnread: true,
    messages: [
      { id: '1', sender: 'user', text: 'Hi, I am checking on Coopers application status.', timestamp: '9:00 AM' },
      { id: '2', sender: 'shelter', text: 'Hello! Let me check that for you.', timestamp: '9:15 AM' },
      { id: '3', sender: 'shelter', text: "Cooper's application was approved! 🎉", timestamp: '10:42 AM' }
    ]
  },
  {
    id: 'm2',
    shelterName: 'Paws & Whiskers Shelter',
    shelterLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoVMm5ELNROG0_-DcW2Q-jQ0DR-5gBQ3ADAjbzquKuwpYRds1RNjcjjStWoChp1tkCgC86NqVej7lQHAnPA9ukcHsmc7XdKf9HRQXnWWeSUw8ryaj6uHeO5c87j5BQpsfxTImg5UTn2rgpGwtceXLfuqIQ4rg3Qj5UHFWEXk785tTK6CAi1iAcjKkrrX9XEy3vV9SJa3UTCNTsZBnxSNj0OdMM4Nl1EEZ0krdFpO76VsVhO04JPFp2OBbIDEYBsfhyUYnZ0I66u-fP',
    lastMessage: 'Is Shadow still available for a visit?',
    time: 'Yesterday',
    petName: 'Shadow',
    petBreed: 'Bombay Cat',
    petId: '#1102',
    isUnread: false,
    messages: [
      { id: '1', sender: 'shelter', text: 'Hi Jane, thank you for your interest in Shadow.', timestamp: 'Yesterday' },
      { id: '2', sender: 'user', text: 'Is Shadow still available for a visit?', timestamp: 'Yesterday' }
    ]
  }
];
