import { config } from "dotenv";

// Carga las variables definidas en el archivo .env
config();

// Variables de entorno requeridas para que la app pueda iniciar
const REQUIRED_ENV_VARS = ["PORT", "NODE_ENV"];

/**
 * Valida que todas las variables de entorno requeridas existan.
 * Si falta alguna, corta la ejecución de la app con un mensaje claro.
 */
function validateEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `❌ Error de configuración: faltan las siguientes variables de entorno: ${missingVars.join(
        ", "
      )}.\n` +
        `Revisá tu archivo .env (podés basarte en .env.example) y volvé a intentar.`
    );
    process.exit(1);
  }
}

validateEnv();

export const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
};
