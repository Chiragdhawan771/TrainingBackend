import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null
        // Upload file on cloudinary 
        const res = await cloudinary.uploader.upload(
            localfilepath, {
            resource_type: "auto"
        })
        // file Uploaded successfully
        // console.log(res.url, "FILE UPLOAD SUCCESSFUL")
        fs.unlinkSync(localfilepath)

        return res
    }
    catch (err) {
        // remove the local saved temporary file as the upload operation failed 
        fs.unlinkSync(localfilepath)
        console.log(err, "UNABLE TO ACCESS PATH")
        return null
    }
}
export { uploadOnCloudinary }