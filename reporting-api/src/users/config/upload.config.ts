import { MulterModuleOptions } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from 'multer';

export const multerOptions: MulterModuleOptions = {
    storage: diskStorage({
        destination: '../../assets/images/users',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' +Math.round(Math.random() * 1E9);
            const extension = extname(file.originalname);
            callback(null, `${uniqueSuffix}${extension}`);
        }
    })
};