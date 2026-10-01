import { env } from "./config/env.config.js";
import app from "./app.js";

app.listen(env.port, () => {
console.log(
`🚀 Peluking API corriendo en modo "${env.nodeEnv}" - http://localhost:${env.port}`
);
});