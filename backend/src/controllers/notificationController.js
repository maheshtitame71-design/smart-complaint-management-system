import Notification from "../models/Notification.js";

// Get my Notification
export const getMyNotifications = async (req,res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    })
     .populate("complaint", "title status")
     .sort({createdAt: -1});

     return res.status(200).json({
      success: true,
      notifications
     });

  } catch (error) {
    console.error("Get Notification error:",error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// mark one Notification as read 
export const markNotificationAsRead = async (req,res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate({
      _id:id,
      user: req.user.userId,
    },
    {
      isRead: true
    },
    {
      new: true,
    }
  );

  if(!notification){
    return res.status(404).json({
      success: false,
      message:"Notification not found",
    });
  }

  return res.status(200).json({
    success: true,
    notification,
  });
  } catch (error) {
    console.error("Mark notification read error:",error);
    
    return res.status(500).json({
      success: false,
      message:"internal server error",
    });
  }
};


// mark all Notification as read 
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Delete one Notification
export const deleteNotification = async (req,res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id:id,
      user: req.user.userId,
      isRead: true,
    })

    if(!notification){
      return res.status(404).json({
        success: false,
        message: "Notification not found or not read yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification cleared successfully",
    });
  } catch (error) {
    console.error("Delete notification error:",error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


