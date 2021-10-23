import { httpServer } from "./app";

const port = process.env.PORT || 4000;
httpServer.listen(port, () => { console.log(`server running on port ${port}`); });