import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import { router } from "./routes";

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log(`user connected on socket ${socket.id}`);
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "../..", "web/dist")));
app.set("views", path.join(__dirname, "../..", "web/dist"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(router);

app.get("/github_signin", (req: Request, res: Response) => {
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
});

app.get("/signin/callback", (req: Request, res: Response) => {
    const { code } = req.query;
    return res.json(code);
});

export { httpServer, io };