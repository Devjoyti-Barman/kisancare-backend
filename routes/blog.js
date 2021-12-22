import express from 'express';
import { createBlog, showBlog,getBlog, searchBlog } from '../controllers/blog.js';
import isLogin from '../middlewares/isLogin.js';

const router=express.Router();

router.post('/create', isLogin, createBlog);
router.get('/show/:blogID',isLogin,showBlog);
router.get('/page/:pageNO',isLogin,getBlog);
router.get('/search',isLogin,searchBlog);

export default router;