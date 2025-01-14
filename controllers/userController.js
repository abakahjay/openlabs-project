const User = require('../models/User');

exports.followUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const user = await User.findById(id);
    const follower = await User.findById(userId);

    if (!user.followers.includes(userId)) {
      user.followers.push(userId);
      follower.following.push(id);
      await user.save();
      await follower.save();
    }

    res.status(200).json({ message: 'User followed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const user = await User.findById(id);
    const follower = await User.findById(userId);

    user.followers = user.followers.filter(f => f.toString() !== userId);
    follower.following = follower.following.filter(f => f.toString() !== id);

    await user.save();
    await follower.save();

    res.status(200).json({ message: 'User unfollowed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers following');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
