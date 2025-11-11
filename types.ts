
export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
}
