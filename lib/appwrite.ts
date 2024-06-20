import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage,
  } from "react-native-appwrite";

  import { ICurrentAccount, IUser } from "@/types/userInterface";
  import { IPost } from "@/types/postsInterface";
  import {IPostForm, fileType} from '../app/(tabs)/create'
import { IAsset } from "@/types/fileInterface";

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
  documents: T[]| [],
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

  export const getCurrentUser = async (): Promise<IUser | null> => {
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

  export const fetchAllPosts = async (): Promise<IPost[]> | never => {
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

  export const fetchLatestPosts = async (): Promise<IPost[]> => {
    try {
      const posts: IDockLists<IPost> = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(7)]
      ).then(res => res as IDockLists<IPost>)
      return posts.documents 
    } catch (error: any) {
      throw new Error(error)
    }
  }

  export const searchPosts = async (query: string | undefined): Promise<IPost[] | null> => {
    if(!query) return null
    try {
      const posts: IDockLists<IPost> = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.contains('title', query)]
      ).then(res => res as IDockLists<IPost>)
      return posts.documents 
    } catch (error: any) {
      throw new Error(error)
    }
  }

  export const fetchUserPosts = async (userId: string | undefined): Promise<IPost[] | null> => {
    if(!userId) return null
    try {
      const posts: IDockLists<IPost> = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal('creator', userId)]
      ).then(res => res as IDockLists<IPost>)

      return posts.documents 
    } catch (error: any) {
      throw new Error(error)
    }
  }

  export const logOut = async () => {
    try {
      const session = await account.deleteSession('current')

      return session
    } catch (error: any) {
      throw new Error(error)
    }
  }

  // ------------check ------------------------

  const getFilePreviewAsync = async (fileId: string, type: fileType) => {
    let fileUrl;

    try {
      if(type === 'video') {
        fileUrl = storage.getFileView(storageId, fileId)
      } else if(type === 'image') {
        fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'center' as ImageGravity, 100)

        
      } else {
        throw new Error('invalid file type')
      }

      if(!fileUrl) throw Error('did not successed to acquire file URL')

      return fileUrl
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const uploadFile = async (file: IAsset | null, type: fileType) => {
    if(!file) return

    const asset = {
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri
    }

    try {
      const uploadedFile = await storage.createFile(
        storageId,
        ID.unique(),
        asset
      )

      const fileUrl = await getFilePreviewAsync(uploadedFile.$id, type)

      return fileUrl

    } catch (error: any) {
      throw new Error(error)
    }
  }

  export const postVideo = async (form: IPostForm) => {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video')
      ])

      const newPost = databases.createDocument(
        databaseId, videoCollectionId, ID.unique(), {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId
        }
      )

      return newPost

    } catch (error: any) {
      throw new Error(error)
    }
  }