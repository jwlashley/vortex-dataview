// api/getReport.js
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = request.query;
  console.log(`[api/getReport] Received request for ID: ${id}`); // Log 1

  if (!id) {
    console.log("[api/getReport] Report ID is missing from query"); // Log 2
    return response.status(400).json({ message: "Report ID is required" });
  }

  try {
    console.log(
      `[api/getReport] Attempting to fetch data from Redis for ID: ${id}`,
    ); // Log 3
    const reportDataString = await redis.get(id);

    // CRUCIAL LOGS: See what Redis actually returns
    console.log(
      `[api/getReport] Data fetched from Redis for ID ${id}. Type: ${typeof reportDataString}`,
    ); // Log 4
    console.log(`[api/getReport] Raw data from Redis:`, reportDataString); // Log 5

    if (reportDataString === null) {
      console.log(`[api/getReport] Report not found in Redis for ID: ${id}`); // Log 6
      return response
        .status(404)
        .json({ message: "Report not found or has expired." });
    }

    console.log(`[api/getReport] Attempting to JSON.parse data for ID: ${id}`); // Log 7
    const reportData = JSON.parse(reportDataString); // This is where the SyntaxError happened
    console.log(`[api/getReport] Successfully parsed JSON for ID: ${id}`); // Log 8

    return response.status(200).json(reportData);
  } catch (error) {
    // CRUCIAL LOG for errors
    console.error(
      `[api/getReport] Error processing ID ${id}:`,
      error.message,
      error.stack,
    ); // Log 9
    return response
      .status(500)
      .json({ message: "Error fetching report", errorDetails: error.message });
  }
}
