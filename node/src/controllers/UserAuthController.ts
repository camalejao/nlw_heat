import { Request, Response } from "express";
import { UserAuthService } from "../services/UserAuthService";

class UserAuthController {
    async handle(req: Request, res: Response) {
        
        const { code } = req.body;
        
        const service = new UserAuthService();
        try {
            const result = await service.execute(code);
            return res.json(result);
        } catch (err) {
            return res.json({ error: err.message });
        }

    }
}

export { UserAuthController };