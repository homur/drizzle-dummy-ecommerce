export type CMSUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};
