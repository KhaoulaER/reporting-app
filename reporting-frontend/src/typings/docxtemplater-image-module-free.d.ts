declare module 'docxtemplater-image-module-free' {
    interface ImageModuleOptions {
      centered?: boolean;
      getImage: (chartImage: string) => Buffer;
      getSize: () => [number, number];
    }
  
    export default class ImageModule {
      constructor(options: ImageModuleOptions);
    }
  }
  