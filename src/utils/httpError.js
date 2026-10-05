export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const sendError = (res, error) => {
  const status = error.status || 500;
  if (!error.status) console.error(error);
  const message = error.status ? error.message : "Error interno del servidor";
  return res.status(status).json({ status: "error", message });
};