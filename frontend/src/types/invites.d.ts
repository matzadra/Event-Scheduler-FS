export interface ReceivedInvite {
  id: string;
  event: {
    id: string;
    description: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
  };
  inviter: {
    id: string;
    name: string;
  };
  status: "pending" | "accepted" | "rejected";
}

export interface SentInvite {
  id: string;
  event: {
    id: string;
    description: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
  };
  recipient: {
    id: string;
    name: string;
  };
  status: "pending" | "accepted" | "rejected";
}
