import sql from "../configs/db.js";
import {v2 as cloudinary} from 'cloudinary'

export const removeBackgroundObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {object} = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only avilable for premium subscriptons ",
      });
    }
    
    const {public_id} = await cloudinary.uploader.upload(image.path);

    const image_url = cloudinary.url(public_id , {
        transformation : [{effect:`gen_remove:${object}`}], 
        resource_type :'image'
    })
    

    await sql`INSERT INTO creations (user_id , prompt , content , type )
    VALUES(${userId} ,  ${`remove ${object} from image`} , ${image_url} , 'image' )`;

    
    res.json({ success: true, image_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
