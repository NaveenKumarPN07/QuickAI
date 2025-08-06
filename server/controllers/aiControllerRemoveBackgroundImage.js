import sql from "../configs/db.js";
import {v2 as cloudinary} from 'cloudinary'

export const removeImage= async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only avilable for premium subscriptons ",
      });
    }
    

    const {secure_url} = await cloudinary.uploader.upload(image.path , {
        
        transformation :[
            {
                effect:'background_removal',
                background_removal:'remove_the_background'
            }
        ]
    })
    

    await sql`INSERT INTO creations (user_id , prompt , content , type )
    VALUES(${userId} , 'Remove background from image' , ${secure_url} , 'image' )`;

    
    res.json({ success: true, secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
