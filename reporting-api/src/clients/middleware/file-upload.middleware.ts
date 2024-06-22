import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from "multer";
import path from "path";
import { v4 as uuidv4} from 'uuid';


export const storage = {
    storage: diskStorage({
        destination: './assets/images/clients',
        filename: (req, file, cb) => {
          try {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
          } catch (error) {
            cb(
              new HttpException(
                'Failed to generate filename',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
              null,
            );
          }
        },
      }),
}