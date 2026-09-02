import app from "./app";

const PORT = process.env.PORT || 4000;
async function server() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error in main function:", error);
    process.exit(1);
  }
}

server();
