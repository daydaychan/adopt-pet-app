
export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  distance: string;
  image: string;
  isUrgent?: boolean;
  isNew?: boolean;
  category: 'Dogs' | 'Cats' | 'Birds' | 'Other';
  gender: 'Male' | 'Female';
  weight: string;
  location: string;
  description: string;
  isFavorite: boolean;
  aiMatchScore?: number;
  aiMatchReason?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  homeType: string;
  hasGarden: boolean;
  activityLevel: 'Low' | 'Moderate' | 'High';
  hasChildren: boolean;
  existingPets: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'shelter';
  timestamp: string;
}

export interface Conversation {
  id: string;
  shelterName: string;
  shelterLogo: string;
  lastMessage: string;
  time: string;
  petName: string;
  petBreed: string;
  petId: string;
  isUnread: boolean;
  messages: ChatMessage[];
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  status: 'Submitted' | 'Reviewing' | 'Interview' | 'Approved' | 'Declined';
  date: string;
  // Form Data
  homeType: string;
  landlordName?: string;
  currentPets: string;
  reason: string;
}
