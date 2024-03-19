export interface Transfer {
  id: string;
  amount: string;
  senderId: string;
  receiverId: string;
  status: string;
  errorReason: string | null;
}
