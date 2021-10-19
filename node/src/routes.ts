import { Router } from "express";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { UserAuthController } from "./controllers/UserAuthController";
import { authenticated } from "./middleware/authenticated";

const router = Router();

router.post("/auth", new UserAuthController().handle);
router.post("/messages", authenticated, new CreateMessageController().handle);

export { router };