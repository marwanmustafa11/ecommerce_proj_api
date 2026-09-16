import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;