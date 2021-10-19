import { Request, Response } from "express";
import { CreateMessageService } from "../services/CreateMessageService";

class CreateMessageController {
    async handle(req: Request, res: Response) {
        
        const { text } = req.body;
        const { user_id } = req;
        
        const service = new CreateMessageService();
        try {
            const result = await service.execute(text, user_id);
            return res.json(result);
        } catch (err) {
            return res.json({ error: err.message });
        }

    }
}

export { CreateMessageController };