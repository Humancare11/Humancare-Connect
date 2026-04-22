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

// Middleware - CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/superadmin", require("./routes/superadmin"));
app.use("/api/qna", require("./routes/qna"));
app.use("/api/doctor", require("./routes/doctorAuth"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/medical", require("./routes/medical"));

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

// Socket.IO setup with proper CORS
const socketCorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
  transports: ["websocket", "polling"]
};

const io = new Server(server, {
  cors: socketCorsOptions,
});

// routes ke andar io use karne ke liye
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-online", ({ userId, role }) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    if (role === "doctor") {
      socket.join(`doctor_${userId}`);
    }

    if (role === "user") {
      socket.join(`patient_${userId}`);
    }

    if (role === "admin" || role === "superadmin") {
      socket.join("admin_room");
    }

    if (role !== "admin") {
      io.emit("active-users-count", onlineUsers.size);
    }

    console.log("Socket joined rooms for user:", userId, role);
  });

  socket.on("join-appointment-room", ({ appointmentId }) => {
    if (!appointmentId) return;
    const room = `appointment_${appointmentId}`;
    // Check if someone is already in the room BEFORE this socket joins
    const existing = io.sockets.adapter.rooms.get(room);
    const someoneAlreadyThere = existing && existing.size > 0;

    socket.join(room);

    // Tell everyone already in the room that a new peer joined
    socket.to(room).emit("peer-joined");
    // Tell the new joiner if a peer was already waiting
    if (someoneAlreadyThere) socket.emit("peer-joined");
  });

  socket.on("leave-appointment-room", ({ appointmentId }) => {
    if (!appointmentId) return;
    const room = `appointment_${appointmentId}`;
    socket.to(room).emit("participant-left");
    socket.leave(room);
  });

  socket.on("appointment-message", ({ appointmentId, senderId, senderName, text, fileUrl, fileName, fileType }) => {
    // Require at least text OR a file
    if (!appointmentId || (!text && !fileUrl)) return;
    io.to(`appointment_${appointmentId}`).emit("appointment-message", {
      appointmentId,
      senderId,
      senderName,
      text: text || "",
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("video-offer", ({ appointmentId, offer }) => {
    if (!appointmentId || !offer) return;
    socket.to(`appointment_${appointmentId}`).emit("video-offer", { offer });
  });

  socket.on("video-answer", ({ appointmentId, answer }) => {
    if (!appointmentId || !answer) return;
    socket.to(`appointment_${appointmentId}`).emit("video-answer", { answer });
  });

  socket.on("ice-candidate", ({ appointmentId, candidate }) => {
    if (!appointmentId || !candidate) return;
    socket.to(`appointment_${appointmentId}`).emit("ice-candidate", { candidate });
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
