import { Router } from "express";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { UserAuthController } from "./controllers/UserAuthController";
import { UserProfileController } from "./controllers/UserProfileController";
import { authenticated } from "./middleware/authenticated";

const router = Router();

router.post("/auth", new UserAuthController().handle);
router.post("/messages", authenticated, new CreateMessageController().handle);
router.get("/messages/last3", new GetLast3MessagesController().handle);
router.get("/profile", authenticated, new UserProfileController().handle);

export { router };