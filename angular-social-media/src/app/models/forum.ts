import { User } from './user';

export interface Forum {
  id: number;
  name: string;
  members: User[];
}
