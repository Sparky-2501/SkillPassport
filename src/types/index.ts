export interface CredentialType {
  id: string;
  title: string;
  type: string;
  issuer: string;
  skills: string[];
  evidenceLinks: string[];
  description: string;
  expiryDate?: string;
  createdAt: Date;
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