import { IUser } from "./userInterface";

export interface IPost {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $tenant: string;
    $updatedAt: string;
    creator: IUser;
    prompt: string;
    thumbnail: string;
    title: string;
    video: string;
    [key: string]: any; // In case there are other properties you didn't mention
  }
