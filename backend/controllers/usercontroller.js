const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js');

// Fetch user details
exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User fetched successfully',
            user,
        });
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, bio } = req.body;

        // Validate the request body
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, bio },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user details:', error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
