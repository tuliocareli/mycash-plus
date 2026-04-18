export type Participant = {
  id: string;
  name: string;
  isMe?: boolean;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // participant ID
  excludedParticipants?: string[]; // IDs of participants who didn't partake
};

export type SplitRole = {
  id: string;
  title: string;
  date: string;
  emoji: string;
  participants: Participant[];
  expenses: Expense[];
  createdAt: string;
};
