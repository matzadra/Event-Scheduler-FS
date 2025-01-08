export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  inviterName?: string;
  accepted?: boolean;
}
