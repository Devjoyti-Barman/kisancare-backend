import express from 'express';
import { createBlog, showBlog } from '../controllers/blog.js';
import isLogin from '../middlewares/isLogin.js';

const router=express.Router();

router.post('/create', isLogin, createBlog);
router.get('/show/:blogID',isLogin,showBlog);

export default router;