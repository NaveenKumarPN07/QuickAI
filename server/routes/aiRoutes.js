import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateBlogTitle } from '../controllers/aiControllerGenerateBlogTitle.js';
import { generateImage } from '../controllers/aiControllerGenerateImage.js';
import { generateArticle } from '../controllers/aiControllerGenerateArticle.js';
import { upload } from '../configs/multer.js';
import { removeImage } from '../controllers/aiControllerRemoveBackgroundImage.js';
import { removeBackgroundObject } from '../controllers/aiControllerRemoveBackgroundObject.js';
import { resumeReview } from '../controllers/aicontrollerResumeReview.js';

const aiRouter = express.Router();

// Text & Image Generations
aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);

// Image Upload Endpoints
aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImage);
aiRouter.post('/remove-image-object', auth, upload.single('image'), removeBackgroundObject);
aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview);

export default aiRouter;
