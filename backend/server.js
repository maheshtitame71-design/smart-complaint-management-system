import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from "./src/routes/auth.routes.js"
import complaintRoutes from "./src/routes/complaint.routes.js";
import cors from "cors";
import notificationRoutes from"./src/routes/notificationRoutes.js";


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

// middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications",notificationRoutes);




app.get('/', (req, res) => {
  res.send("Server is running")
})



const PORT = process.env.PORT || 5000;



// server start after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
  }
}

startServer();





