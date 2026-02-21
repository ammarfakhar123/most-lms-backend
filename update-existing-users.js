require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const updateExistingUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({ userId: { $exists: false } });
    console.log(`Found ${users.length} users without userId`);

    const roleCounts = {};
    
    for (const user of users) {
      if (!roleCounts[user.role]) {
        const existingCount = await User.countDocuments({ 
          role: user.role, 
          userId: { $exists: true } 
        });
        roleCounts[user.role] = existingCount;
      }
      
      roleCounts[user.role]++;
      const prefix = user.role.toUpperCase().substring(0, 3);
      const userId = `${prefix}${String(roleCounts[user.role]).padStart(4, '0')}`;
      
      await User.findByIdAndUpdate(user._id, { userId });
      console.log(`Updated ${user.username} (${user.role}) with userId: ${userId}`);
    }

    console.log("All existing users updated successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

updateExistingUsers();