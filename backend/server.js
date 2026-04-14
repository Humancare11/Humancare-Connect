require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// DB connect + auto-seed admin
const startServer = async () => {
  await connectDB();

  // Seed default admin
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Admin", email: "admin@gmail.com", password: hashed, role: "admin" });
    console.log("Admin account created ✅ (admin@gmail.com / admin123)");
  }

  // Seed superadmin
  const existingSuperAdmin = await User.findOne({ email: "superadmin@humancare.com" });
  if (!existingSuperAdmin) {
    const hashed = await bcrypt.hash("superadmin123", 10);
    await User.create({ name: "Super Admin", email: "superadmin@humancare.com", password: hashed, role: "superadmin" });
    console.log("Super Admin created ✅ (superadmin@humancare.com / superadmin123)");
  }
};

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/superadmin", require("./routes/superadmin"));
app.use("/api/qna", require("./routes/qna"));
app.use("/api/doctor", require("./routes/doctorAuth"));

app.get("/api/health", (req, res) => {
  res.send("API Running...");
});

// userId => Set(socketIds)
const onlineUsers = new Map();

// API for initial active users count
app.get("/api/admin/active-users", (req, res) => {
  res.json({ activeUsers: onlineUsers.size });
});

// Serve static frontend in production only
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// routes ke andar io use karne ke liye
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-online", ({ userId, role }) => {
    if (!userId) return;

    // admin ko active users count me include nahi karna
    if (role === "admin") return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    io.emit("active-users-count", onlineUsers.size);
    console.log("Active users:", onlineUsers.size);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketSet] of onlineUsers.entries()) {
      if (socketSet.has(socket.id)) {
        socketSet.delete(socket.id);

        if (socketSet.size === 0) {
          onlineUsers.delete(userId);
        }
        break;
      }
    }

    io.emit("active-users-count", onlineUsers.size);
    console.log("Active users:", onlineUsers.size);
  });
});

const PORT = process.env.PORT || 3000; // AI Studio requires port 3000

startServer().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
