import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

app.use("/api", chatRoutes);

const connectDB = async() => {
    try {
        if(!process.env.MONGODB_URI) {
            console.log("MONGODB_URI is missing. Starting without database persistence.");
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
        console.log("Continuing without database persistence.");
    }
}

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });
};

const isMainModule = process.argv[1]
    ? fileURLToPath(import.meta.url) === process.argv[1]
    : false;

if(isMainModule) {
    startServer();
}

export default app;


// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });

