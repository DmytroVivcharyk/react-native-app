export interface IAsset {
    assetId: string;
    base64: string | null;
    duration: number | null;
    exif: Record<string, any> | null;
    fileName: string;
    fileSize: number;
    height: number;
    mimeType: string;
    rotation: number | null;
    type: string;
    uri: string;
    width: number;
  }
  
  export interface IPickFileResponse {
    assets: IAsset[];
    canceled: boolean;
  }