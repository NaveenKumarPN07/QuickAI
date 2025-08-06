import sql from "../configs/db.js";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import FormData from "form-data"; 
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only avilable for premium subscriptons ",
      });
    }
    
    const formData = new FormData();
    formData.append("prompt", prompt);
    const {data} = await axios.post( "https://clipdrop-api.co/text-to-image/v1", formData , {
        headers :{'x-api-key': process.env.CLIPDROP_API_KEY},
        responseType :"arraybuffer"
    })

    const base64Image = `data:image/png;base64,${Buffer.from(data , 'binary').toString('base64')}`

    const {secure_url} = await cloudinary.uploader.upload(base64Image)
    

    await sql`INSERT INTO creations (user_id , prompt , content , type , publish)
    VALUES(${userId} , ${prompt} , ${secure_url} , 'image' ,${publish ?? false})`;

    
    res.json({ success: true, secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
