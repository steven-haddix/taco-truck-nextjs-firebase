export default interface IUser {
  uid: string;
  displayName: string | undefined | null;
  email: string | undefined | null;
  photoURL: string | undefined | null;
  token: string | undefined | null;
}
