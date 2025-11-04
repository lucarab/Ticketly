export type CreateEventRequest = {
  name: string;
  location: string;
  datetime: string;
  price: string;
  maxTicketAmount: number;
  description?: string;
  status?: 'draft' | 'published' | 'canceled';
}