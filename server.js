require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const learnerRoutes = require("./routes/learner");
const accessorRoutes = require("./routes/accessor");
const iqaRoutes = require("./routes/iqa");
const eqaRoutes = require("./routes/eqa");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ✅ ROOT ROUTE ADD KIYA
app.get("/", (req, res) => {
  res.send("LMS Backend is Running 🚀");
});

// Connect to database and sync models
sequelize.sync({ force: false }).then(() => {
  console.log("Database connected and synchronized");
}).catch((err) => console.error("Database connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/learner", learnerRoutes);
app.use("/api/accessor", accessorRoutes);
app.use("/api/iqa", iqaRoutes);
app.use("/api/eqa", eqaRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});