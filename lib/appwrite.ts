import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

  import { ICurrentAccount, IUser } from "@/types/userInterface";
  import { IPost } from "@/types/postsInterface";

  const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.react-native-app',
    projectId: '66605126003330cba662',
    databaseId: '6660538e002b155c29aa',
    userCollectionId: '666053cf003ba546ade4',
    videoCollectionId: '6660540e003df19ac884',
    storageId: '66605633003701e7a27b'
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId 
} = appwriteConfig

type IDockLists<T> = {
  documents: T[] | [],
  total: number
}

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email: string, password: string, username: string) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
      await signIn(email, password);
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  
  // Sign In
  export async function signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  export const getCurrentUser = async (): Promise<IUser | never | null> => {
    try {
      const currentAccount: ICurrentAccount = await account.get()

      if(!currentAccount) return null

      const currentUser: IDockLists<IUser> = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      ).then(res => res as IDockLists<IUser>)


      if (!currentUser || currentUser.documents.length === 0) throw new Error("No user found")

      return currentUser.documents[0]
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  export const fetchAllPosts = async (): Promise<IPost[] | never> => {
    try {
      const posts: IDockLists<IPost> = await databases.listDocuments(
        databaseId,
        videoCollectionId
      ).then(res => res as IDockLists<IPost>)
      return posts.documents 
    } catch (error: any) {
      throw new Error(error)
    }
  }