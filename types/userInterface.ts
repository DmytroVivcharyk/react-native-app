import { Models } from "react-native-appwrite";

export interface IUser extends Models.Document {
    username: string;
    email: string;
    avatar: string;
    accountId: string;
    '$id': string;
    '$tenant': string;
    '$createdAt': string;
    '$updatedAt': string;
    '$permissions': string[];
    '$databaseId': string;
    '$collectionId': string;
}

export interface ICurrentAccount {
    $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  email: string;
  emailVerification: boolean;
  labels: string[]; 
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: object; 
  registration: string;
  status: boolean;
  targets: Array<{
    $id: string;
    $createdAt: string;
    // Add other properties of the target object if there are more
  }>;
}