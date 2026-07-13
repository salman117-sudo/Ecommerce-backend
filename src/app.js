import env from "#env";
import { connectDB } from "#connection";
import app from "#server";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📍 API base: http://localhost:${env.PORT}/api`);
  });
};

startServer();