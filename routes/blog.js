import express from 'express';
import { createBlog } from '../controllers/blog.js';
import isLogin from '../middlewares/isLogin.js';

const router=express.Router();

router.post('/create', isLogin, createBlog);


export default router;