const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 

router.get('/profile', async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json(user); 
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/bookmark/:id', async(req,res)=>{

  const blogId = req.params.id;
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    const bookmarked = user.bookmarks.includes(blogId);
    if(bookmarked){
      user.bookmarks.pull(mongoose.Types.ObjectId(blogId));
    }
    else{
      user.bookmarks.push(mongoose.Types.ObjectId(blogId));
    }

    await user.save();

    res.status(200).json("Bookmark added",user.bookmarks);
  }
  catch(error){

    res.status(500).json("Error occured while bookmarking")
   
  }


});


router.get('/bookmark', async(req,res)=>{

    const userId = req.user.id;
    try {
      const user = await userModel.findById(userId).populate('bookmark');;

      res.status(200).json(user.bookmark);
    }
    catch(error){

      res.status(500).json("Error occured while fetching bookmarks")
    
    }


});



module.exports = router;