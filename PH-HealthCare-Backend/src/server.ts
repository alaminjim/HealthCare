import app from "./app";
import { envConfig } from "./app/config/env";

const port = envConfig.PORT || 5000;

const server = () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
