import app from "./app";
import { envConfig } from "./app/config/env";
import { superAdmin } from "./app/utils/seed";

const port = envConfig.PORT || 5000;

const server = async () => {
  try {
    await superAdmin();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
