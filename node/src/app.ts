import express, { Request, Response } from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());
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

const port = process.env.NODE_PORT || 4000;
app.listen(port, () => { console.log(`server running on port ${port}`); });
