import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const VIEWS_PATH = path.join(__dirname, "../views");
export const PUBLIC_PATH = path.join(__dirname, "../public");
export const handlebarsEngine = engine({
extname: ".handlebars",
defaultLayout: "main",
layoutsDir: path.join(VIEWS_PATH, "layouts"),
partialsDir: path.join(VIEWS_PATH, "partials"),
helpers: {
formatPrice: (price) => `$${Number(price).toLocaleString("es-AR")}`,
},
});