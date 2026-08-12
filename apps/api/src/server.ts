import { buildApp } from "./app/app.js";

const app = buildApp()

async function start() {
   const port = Number(process.env.PORT) || 3333;

   try {
      await app.listen({
         port,
         host: "0.0.0.0",
      });

      app.log.info(`Server running on port ${port}`);

   } catch (err) {
      app.log.error(err);
      process.exit(1);
   }
}


start();