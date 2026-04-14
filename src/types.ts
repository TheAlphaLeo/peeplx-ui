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

export interface ProfilePaymentFormValue {
  amount: string;
  currency: "NGN" | "USD" | "USDT" | "USDC";
  description: string;
  payerEmail: string;
  payerName: string;
  paymentMethod: "card" | "crypto";
}

export interface ProfilePaymentWidgetPayload {
  username: string;
  amount: number;
  currency: "NGN" | "USD" | "USDT" | "USDC";
  description?: string;
  payerEmail: string;
  payerName: string;
  paymentMethod: "card" | "crypto";
}
