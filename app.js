require("dotenv").config();
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
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
    });

    console.log("1. Request received");
    console.log("2. Transport created");

    await transporter.sendMail({
      from: `${user.name} <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // tere paas aayegi inquiry
      replyTo: user.email, // reply karo toh client ko jaayegi
      subject: `New Inquiry from ${user.name}`,
      text: `
Name: ${user.name}
Company: ${user.company}
Goal: ${user.goal}
Date: ${user.date}
Budget: ${user.budget}
Email: ${user.email}
Details: ${user.details}
  `,
    });

    console.log("3. Mail sent");

    res.status(200).json({
      message: "Form submitted & email sent successfully",
    });
  } catch (err) {
    console.error("SERVER ERROR FULL:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on ${PORT}`);
});