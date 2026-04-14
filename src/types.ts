export interface ProfileCardData {
  username: string;
  displayName: string;
  joinedAt: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isBusinessAccount: boolean;
  trustScore: {
    overall: number;
    level: string;
    badge: string;
  };
  stats: {
    asBuyer: number;
    asSeller: number;
    totalVolume: number;
  };
}

