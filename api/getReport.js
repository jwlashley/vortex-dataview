// api/getReport.js
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = request.query;
  // You can keep this log if you like
  console.log(`[api/getReport] Received request for ID: ${id}`);

  if (!id) {
    console.log("[api/getReport] Report ID is missing from query");
    return response.status(400).json({ message: "Report ID is required" });
  }

  try {
    // You can keep this log
    console.log(
      `[api/getReport] Attempting to fetch data from Redis for ID: ${id}`,
    );
    const reportDataObject = await redis.get(id); // Renamed to reflect it's an object

    // You can keep these logs for verification if you want, or remove them later
    console.log(
      `[api/getReport] Data fetched from Redis for ID ${id}. Type: ${typeof reportDataObject}`,
    );
    console.log(
      `[api/getReport] Raw data object from Redis:`,
      reportDataObject,
    );

    if (reportDataObject === null) {
      // redis.get() returns null if key doesn't exist
      console.log(`[api/getReport] Report not found in Redis for ID: ${id}`);
      return response
        .status(404)
        .json({ message: "Report not found or has expired." });
    }

    // ---- THE FIX: REMOVE JSON.parse() ----
    // console.log(`[api/getReport] Attempting to JSON.parse data for ID: ${id}`);
    // const reportData = JSON.parse(reportDataObject); // NO LONGER NEEDED!
    // console.log(`[api/getReport] Successfully parsed JSON for ID: ${id}`);

    // Directly use the object returned by redis.get()
    return response.status(200).json(reportDataObject);
  } catch (error) {
    // This catch block might now only catch very unexpected errors,
    // as the main SyntaxError should be gone.
    console.error(
      `[api/getReport] Error processing ID ${id}:`,
      error.message,
      error.stack,
    );
    return response
      .status(500)
      .json({ message: "Error fetching report", errorDetails: error.message });
  }
}
