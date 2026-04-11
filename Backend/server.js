import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultDevOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
];

const resolvedAllowedOrigins = allowedOrigins.length > 0
    ? allowedOrigins
    : (isProduction ? [] : defaultDevOrigins);

const isOriginAllowed = (origin) => {
    // Requests from curl/supertest typically have no Origin header.
    if(!origin) {
        return true;
    }
    return resolvedAllowedOrigins.includes(origin);
};

app.disable("x-powered-by");

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if(isProduction) {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }
    next();
});

app.use(express.json({ limit: "100kb" }));
app.use(cors({
    origin: (origin, callback) => {
        if(isOriginAllowed(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

app.use((err, req, res, next) => {
    if(err?.message === "Not allowed by CORS") {
        return res.status(403).json({ error: "Origin not allowed" });
    }
    return next(err);
});

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
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
        console.log("Continuing without database persistence.");
    }
}

const startServer = async () => {
    if(isProduction && resolvedAllowedOrigins.length === 0) {
        console.warn("CORS_ORIGIN is empty in production. Browser requests will be rejected.");
    }
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });

    // Keep API available even if database is slow or temporarily unavailable.
    connectDB();
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

