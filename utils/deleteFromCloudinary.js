import { cloudinary } from "../config/cloudinary.js";

const deleteFromCloudinary = (public_id) => {
    return new Promise((resolve, reject) => {

        cloudinary.uploader.destroy(public_id, (error, result) => {

            if (error) {
                reject(error);
            } else {
                resolve(result);
            }

        });

    });
};

export default deleteFromCloudinary;