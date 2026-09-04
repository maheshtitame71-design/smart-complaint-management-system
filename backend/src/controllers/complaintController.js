import Complaint from "../models/Complaint.js";
import User from "../models/User.js "
import Notification from "../models/Notification.js";

// Create Complaint
export const createComplaint = async (req,res)=>{
  try {
    // get complaint date from request
    const {
      title,
      description,
      category,
      priority,
      location,
    } = req.body;

    // validate required fields
    if(!title || !description || !category){
      return res.status(400).json({
        success: false,
        message: "Title, description and category is required"
      });
    }

    // create complaint 
    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      location: location ? location.trim() :null,

      // get user id from jwt middleware
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "complaint created successfully",
      complaint:{
        id: complaint._id,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        createdBy: complaint.createdBy,
        location: complaint.location,
        createdAt: complaint.createdAt,
      }
    });

  } catch (error) {
    console.error("Create complaint error", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

};

// Get my complaint
export const getMyComplaints = async (req,res) => {
  try {

    // get loged in user's ID from JWT
    const userId = req.user.userId

    // find complaints created by this user 
    const complaints = await Complaint.find({
      createdBy: userId,
    }).sort({ createdAt: -1});
    
    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error("Get complaint error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get my complaint by ID 
// for student's own complaint
export const getMyComplaintById = async (req,res) => {
  try {
    const { id } = req.params;

    // find complaint that belongs to the loged-in user
    const complaint = await Complaint.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    // Complaint not found or doesn't belong to the user 
    if(!complaint){
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    console.error("Get complaint by ID error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}; 

// Update Complaint = A user can update complaint only while its status is pending 
export const updateComplaint = async (req,res) => {
  try {

    const { id } = req.params;

    const {
    title,
    description,
    category,
    priority,
    location,
  } = req.body || {};

  // find complaint belong to the loged in user
  const complaint = await Complaint.findOne({
    _id: id,
    createdBy: req.user.userId,
  });

  // complaint doesnot exist
  if(!complaint){
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  // only pending complaint can be updated
  if(complaint.status !== "pending"){
    return res.status(400).json({
      success: false,
      message: "Only pending complaints can be updated",
    });
  }

  // Update only fields provided by the user
    if (title) complaint.title = title.trim();
    if (description) complaint.description = description.trim();
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;
    if (location !== undefined) {
      complaint.location = location ? location.trim() : null;
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// Delete Complaint  =  while complaint is pending
export const deleteComplaint = async (req,res) => {
  try {
    const { id } = req.params;

    // find complaint belonging to loged-in user 
    const complaint = await Complaint.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    // complaint not found 
    if(!complaint){
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // only pending complaint can be deleted
    if(complaint.status !== "pending"){
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be deleted"
      });
    }

    // delete complaint
    await Complaint.deleteOne({
      _id: id,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });

  } catch (error) {
    console.error("Complaint delete error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/////////////////////////////////////////////

// Admin 

// get all complaint 
export const getAllComplaints = async (req,res) =>{
  try {

    const {status, priority, category, search } = req.query;

    // build filter dynamically
    const filter = {};

    if(status){
      filter.status = status;
    }

    if(priority){
      filter.priority = priority;
    }

    if(category){
      filter.category = category;
    }

    if(search){
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Pagination values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // prevent invalid values
    if(page < 1 || limit < 1){
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0"
      })
    }

    // calaculate how many documents to skip
    const skip = (page - 1) * limit;


    const totalComplaints = await Complaint.countDocuments(filter);
    

    const complaints = await Complaint.find(filter)
     .populate("createdBy", "name email phone")
     .populate("assignedTo", "name email phone")
     .sort({createdAt: -1})
     .skip(skip)
     .limit(limit);

    // calaculate total pages 
    const totalPages = Math.ceil(totalComplaints/ limit);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        limit,
        totalComplaints,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters:{
        status: status || null,
        priority: priority || null,
        category: category || null,
        search: search || null,
      },
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error("Get all complaints error", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getComplaintById = async(req,res)=>{
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
    .populate("createdBy", "name email phone")
    .populate("assignedTo", "name email phone")

    if(!complaint){
      return res.status(404).json({
        success:false,
        message:"complaint not found",
      });
    }

    return res.status(200).json({
      success:true,
      complaint,
    });

  } catch (error) {
    console.error("Get complaint by id error:", error);
    
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });
  }
};

// assign complaint 
export const assignComplaint = async (req,res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    // validate staff ID 
    if(!staffId){
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    // find complaint
    const complaint = await Complaint.findById(id);

    if(!complaint){
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // find staff user 
    const staff = await User.findOne({
      _id: staffId,
      role: "staff",
    });

    if(!staff){
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    // assign complaint
    complaint.assignedTo = staff._id;
    complaint.status = "assigned";

    await complaint.save();

    // create user notification
    await Notification.create({
      user: complaint.createdBy,
      complaint:complaint._id,
      title: "Complaint Assigned",
      message:`Your complaint "${complaint.title}" has been assigned to ${staff.name}.`,
      type:"assigned",
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint:{
        id: complaint._id,
        title: complaint.title,
        status: complaint.status,
        assignedTo:{
          id: staff._id,
          name: staff.name,
          email: staff.email,
        },
      },
    });

  } catch (error) {
    console.error("Assign complaint error:",error);

    return res.status(500).json({
      success: false,
      message: " Internal server error",
    });
    
  }
};

/////////////////////////////////////////

// staff

// get assigned complaint
export const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user.userId,
      status: { $in: ["assigned", "in-progress"]},
    })
     .populate("createdBy","name email phone")
     .populate("assignedTo","name email phone")
     .sort({createdAt: -1});
    
    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
    
  } catch (error) {
    console.error("Get assigned complaints error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });  
  }
};

// update complaint status
export const updateComplaintStatus = async (req,res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // validate status
    const allowedStatus = ['in-progress', "resolved"];

    if(!status || !allowedStatus.includes(status)){
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use in-progress or resolved",
      });
    }

    // find complaint assigned to loged in user 
    const complaint = await Complaint.findOne({
      _id: id,
      assignedTo: req.user.userId,
    });

    if(!complaint){
      return res.status(404).json({
        success: false,
        message: "complaint not found or assgined to you",
      });
    }

    // check status transition 
    if(status === "in-progress" && complaint.status !== "assigned"){
      return res.status(400).json({
        success: false,
        message: 'complaint must be assgined before starting work',
      });
    }

    if(status === "resolved" && complaint.status !== "in-progress"){
      return res.status(400).json({
        success: false,
        message: "complaint must be in-progess before resolved"
      });
    }

    // update status 
    complaint.status = status;
    await complaint.save();

    // create user notification
    let notificationTitle;
    let notificationMessage;

    if(status === "in-progress"){
      notificationTitle = "Complaint In Progress";
      
      notificationMessage = `Your complaint "${complaint.title}" is now in progress.`;
    }


    if(status === "resolved"){
      notificationTitle = "Complaint Resolved";
      
      notificationMessage = `Your complaint "${complaint.title}" has been resolved successfully."`;
    }

    // user notification
    await Notification.create({
      user:complaint.createdBy,
      complaint: complaint._id,
      title: notificationTitle,
      message: notificationMessage,
      type:status,
      isRead: false,
    });

    // admin notification
    const admins = await User.find({
      role:"admin",
    }).select("_id");

    const adminNotifications = admins.map((admin)=>({
      user: admin._id,
      complaint: complaint._id,
      title:notificationTitle,
      type:status,
      message:
      status === "in-progress"
      ? `Staff has started working on complaint "${complaint.title}.`
      : `Staff has resolved complaint "${complaint.title}.`,
      isRead: false,
    }));

    if (adminNotifications.length > 0) { await Notification.insertMany(adminNotifications); }



    return res.status(200).json({
      success: true,
      message: `complaint marked as ${status}`,
      complaint:{
        id: complaint._id,
        title: complaint.title,
        status: complaint.status,
        assignedTo: complaint.assignedTo,
        updatedAt: complaint.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Intenral server error",
    });
  }
};

// admin dashboard stats

export const getComplaintStats = async (req, res) => {
 try {
  const total = await Complaint.countDocuments();

  const pending = await Complaint.countDocuments({
    status: "pending",
  });

  const assigned = await Complaint.countDocuments({
    status: "assigned",
  });
  ;
  const inProgress = await Complaint.countDocuments({
    status: "in-progress",
  });

  const resolved = await Complaint.countDocuments({
    status: "resolved",
  });
  
  const rejected = await Complaint.countDocuments({
    status: "rejected",
  });

  return res.status(200).json({
    success: true,
    stats:{
      total,
      pending,
      assigned,
      inProgress,
      resolved,
      rejected,
    },
  });
 } catch (error) {
  console.error("Get complaint stats error:",error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
  
 } 
};