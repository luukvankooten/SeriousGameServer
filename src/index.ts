import { Server } from "socket.io";

const server = new Server();

server.on("connection", () => {
	console.log("connected")
});

server.listen(Number(process.env.PORT) || 3001);