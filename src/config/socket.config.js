import { Server } from "socket.io";
export const initSocket = (httpServer) => {
const io = new Server(httpServer);
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    });
});
return io;
};