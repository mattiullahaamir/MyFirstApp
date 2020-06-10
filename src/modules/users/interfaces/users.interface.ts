export interface IUsers {
  id: number;
  Username: string;
  Email: string;
  Password: string;
  Salt: string;
  Accounts: [];
  //isDeleted: boolean; // delete flag
}
