const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
// }));
app.use(cors());

// 🔴 THIS LINE FIXES YOUR ISSUE
// app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello Everyone.");
});

app.post("/data", async (req, res) => {
  try {
    const user = req.body;

    if (!user.email || !user.email.includes("@") || !user.email.includes(".")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!user.privacy) {
      return res.status(400).json({ message: "Privacy not accepted" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Form Bot <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Form Submission Received",
      text: JSON.stringify(user, null, 2),
    });

    res.status(200).json({
      message: "Form submitted & email sent successfully",
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
