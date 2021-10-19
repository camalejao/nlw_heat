import { httpServer } from "./app";

const port = process.env.NODE_PORT || 4000;
httpServer.listen(port, () => { console.log(`server running on port ${port}`); });