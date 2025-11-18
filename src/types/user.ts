export interface Workspace {
  id: string;
  userId: string;
  name?: string;
  createdAt: string;
}

export interface KnowledgeBase
{
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  username?: string | null;
  onboarded: boolean;
  lastLogin?: string | null;
  createdAt: string;
  workspace?: Workspace | null;
  kb?: KnowledgeBase | null;
}
