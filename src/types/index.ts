export interface CredentialType {
  id: string;
  name: string;
  type: string;
  issuer: string;
  issue_date: string;
  evidence_url?: string;
  user_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  theme: 'theme1' | 'theme2' | 'theme3' | 'theme4' | 'theme5' | 'theme6';
  created_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  connection_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  profiles?: Profile;
}

export interface UserStats {
  credentials: number;
  verifiedSkills: number;
  profileViews: number;
  connections: number;
}

export interface ModalProps {
  setShowModal: (show: boolean) => void;
}

export interface LandingProps {
  setHasVisited: (visited: boolean) => void;
}

export interface NavbarProps {
  setShowModal: (show: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}