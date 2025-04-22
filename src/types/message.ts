export interface Message {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: "system" | "user";
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  receiver?: {
    id: number;
    name: string;
    email: string;
  };
}
