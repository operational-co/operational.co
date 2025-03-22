import { Prisma } from "@prisma/client";

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  //console.error("Error:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known database errors specifically
    //console.error("Database error occurred:", err.message);
    return res.status(500).send("A database error occurred.");
  }

  if (err instanceof Error) {
    // Operational error (runtime problems)
    return res.status(500).send(err.message);
  }

  // For unhandled errors, perform a graceful shutdown
  process.on("uncaughtException", (err) => {
    //console.error("Unhandled Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    //console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  // If it's not a recognized type of error, send a generic response
  res.status(500).send("An unexpected error occurred");
};

export default errorHandler;
