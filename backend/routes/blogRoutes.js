const express = require('express');
const router = express.Router();
const blogModel = require('../models/blogModel'); 
const jwtAuthMiddleware = require('../services/jwt').jwtAuth;
const uploadImage = require('../services/cloudUpload');

router.post('/create',jwtAuthMiddleware,uploadImage.single('image'), async (req, res) => {
   const { title, content, tags } = req.body;
   const imageUrl = req.file ? req.file.path : null;
   
    try {
         const newBlog = new blogModel({
              title,
              content,
              author: req.user.id, 
              tags: tags ? tags.split(',') : [],
              imageUrl
         });
         await newBlog.save();
         res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
         res.status(500).json({ message: 'Error creating blog', error });
         console.error(error);
    }
});

router.get('/all', async (req, res) => {
     try {
          const blogs = await blogModel.find().populate('author', 'username avatarUrl').sort({ createdAt: -1 });
          res.status(200).json(blogs);
     } catch (error) {
          res.status(500).json({ message: 'Error fetching blogs', error });
     }

     });

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const blogs = await blogModel.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') },
      ],
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search blogs' });
  }
})

router.get('/my-blogs',jwtAuthMiddleware, async (req, res) => {
     try {
          const userId = req.user.id;
          const blogs = await blogModel.find({author:userId}).populate('author', 'username avatarUrl').sort({ createdAt: -1 });
          res.status(200).json(blogs);
     } catch (error) {
          res.status(500).json({ message: 'Error fetching blogs', error });
     }

     });

router.get('/:id',async (req, res) => {
     const blogId = req.params.id;
     
     try {
          
          const blog = await blogModel.findById(blogId).populate('author', 'username avatarUrl').sort({ createdAt: -1 });
          
          res.status(200).json({ blog:blog});
     } catch (error) {
          res.status(500).json({ message: 'Error fetching blogs', error });
          console.log(error)
     }

     });

router.put('/:id',jwtAuthMiddleware,uploadImage.single('image'),async(req,res) =>{

     const blogId = req.params.id;
     const { title, content, tags } = req.body;
     const imageUrl = req.file ? req.file.path : null;

     try{
          const blog = await blogModel.findById(blogId);
          if (blog){
               if (title) blog.title = title;
               if (content) blog.content = content;
               if (tags) blog.tags = tags;
               if (imageUrl) blog.imageUrl = imageUrl;
               await blog.save();
               res.status(200).json({message:"Requested Update is done", blog})
          }
          else{
               res.status(404).json({message:'Blog not found '});
          }

     }

     catch (error) {
       res.status(500).json({ message: 'Error fetching blogs', error });
     }

});

router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
     const blogId = req.params.id;
     try {
          const blog = await blogModel.findById(blogId);
          if (!blog) {
               return res.status(404).json({ message: 'Blog not found' });
          }
          else if (blog.author.toString() !== req.user.id) {
               return res.status(403).json({ message: 'You are not authorized to delete this blog' });
          }
          else{
               await blogModel.findByIdAndDelete(blogId);
               res.status(200).json({ message: 'Blog deleted successfully' });
          }
     }
     catch (error) {
          res.status(500).json({ message: 'Error deleting blog', error }); 
     }
});

//Likes

router.get('/:id/like',jwtAuthMiddleware,async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  const userId = req.user.id;
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  const liked = blog.likes.includes(userId);
  res.json({ liked: liked });
});

router.patch('/:id/like',jwtAuthMiddleware,async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  const userId = req.user.id;

  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  
  const liked = blog.likes.includes(userId);
  console.log(liked);
  if (liked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();
  res.json({ liked: !liked, likesCount: blog.likes.length });

});


router.patch('/:id/views', async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!blog.views.includes(userIp)) {
      blog.views.push(userIp);
      await blog.save();
    }

    res.json({ viewCount: blog.views.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;