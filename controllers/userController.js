const { UnauthenticatedError, BadRequestError,NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

exports.followUser = async (req, res) => {
  const { id } = req.params;//UserId
  if(!id){
    throw new BadRequestError('Please Provide a user id')
  }

  const userId = req.body.userId;//FollowerId

  if(!userId){
    throw new BadRequestError('Please Provide a follower id')
  }

    const user = await User.findById(id);

    if(!user){
      throw new NotFoundError(`No user with id: ${id}`)
    }


    const follower = await User.findById(userId);


    if(!follower){
      throw new NotFoundError(`No follower with id: ${userId}`)
    }

    if (!user.followers.includes(userId)) {
      user.followers.push(userId);
      follower.following.push(id);
      await user.save();
      await follower.save();
    }

    res.status(StatusCodes.OK).json({ message: 'User followed!' });
  
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;//UserId
  if(!id){
    throw new BadRequestError('Please Provide a user id')
  }

  const {userId }= req.body;//FollowerId

  if(!userId){
    throw new BadRequestError('Please Provide a follower id')
  }

    const user = await User.findById(id);

    if(!user){
      throw new NotFoundError(`No user with id: ${id}`)
    }


    const follower = await User.findById(userId);


    if(!follower){
      throw new NotFoundError(`No follower with id: ${userId}`)
    }


    user.followers = user.followers.filter(f => f.toString() !== userId);
    follower.following = follower.following.filter(f => f.toString() !== id);

    await user.save();
    await follower.save();

    res.status(StatusCodes.OK).json({ message: 'User unfollowed!' });
  
};

exports.getUser = async (req, res) => {
    const {id} = req.params
    if(!id){
      throw new BadRequestError('Please Provide a user id')
    }
    const user = await User.findById(id).populate('followers following');
    if(!user){
      throw new NotFoundError(`No user with id: ${id}`)
    }
    res.status(StatusCodes.OK).json({message:`User:${id} found successfully `,user});
};

exports.getUserByName = async (req, res) => {
    const {username} = req.params
    if(!username){
      throw new BadRequestError('Please Provide a username')
    }
    // console.warn('Hi')
    const user = await User.findOne({username:username}).populate('followers following')
    User
    if(!user){
      throw new NotFoundError(`No user with username: ${username}`)
    }
    console.log('\x1b[36m%s\x1b[0m',`Username: ${username} found`)
    res.status(StatusCodes.OK).json({message:`User: ${username} found successfully `,user});
};


exports.editUser = async (req, res) => {
  const {username} = req.params
  const {usernames,bio,firstName,lastName} = req.body.updatedUser?req.body.updatedUser:req.body
  // console.log(req.body)
  if(!username){
    throw new BadRequestError('Please Provide a username')
  }

  const user = await User.findOneAndUpdate({username:username},{username:usernames,bio,firstName,lastName},{ new: true, runValidators: true })//.populate('followers following')
  if(!user){
    throw new NotFoundError(`No user with username: ${username}`)
  }
  if(req.file){
    console.log(req.file)
    user.profile_picture_id = req.file.id;
    await user.save()
  }
  console.log('\x1b[36m%s\x1b[0m',`Username: ${username} updated user details successfully `)
  res.status(StatusCodes.OK).json({message:`User: ${username} updated user details successfully `,user});
};


exports.editUserProfilePic = async (req, res) => {
  const {username} = req.params
  if(!username){
    throw new BadRequestError('Please Provide a username')
  }

  if(!req.file){
    throw new BadRequestError('Please Provide an Image')
  }

  const user = await User.findOne({username:username})
  
  if(!user){
    throw new NotFoundError(`No user with username: ${username}`)
  }
  
  // console.log(req.file)
  user.profile_picture_id = req.file.id;
  await user.save()
  console.log('\x1b[36m%s\x1b[0m',`Username: ${username} updated user profile pic successfully `)
  res.status(StatusCodes.OK).json({message:`User: ${username} updated user profile pic successfully `,user});
};

