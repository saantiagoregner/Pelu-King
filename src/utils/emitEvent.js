export const emitEvent = (req, event, payload) => {
const io = req.app.get("io");
if (io) io.emit(event, payload);
};