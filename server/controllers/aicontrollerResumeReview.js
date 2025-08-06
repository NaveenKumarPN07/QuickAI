import sql from "../configs/db.js";
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only avilable for premium subscriptons ",
      });
    }
    
    if(resume.size>5*1024*1024){
      return  res.json({success:false  , message:"resume file size exceeds allowed size(5MB). "})
    }
    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)
    const prompt = `review the following resume and provide constructiive feedback on its strengths , weekness and areas for improvement.Resume content:\n\n${pdfData.text}`
    
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id , prompt , content , type )
    VALUES(${userId} , 'review the uploaded resume', ${content} , 'resume review' )`;

    
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
