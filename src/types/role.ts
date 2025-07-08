export interface Role {
  _id: string;
  name: string;
  label: string;
  permissions: Array<{
    permission: string;
    value: boolean | number;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
