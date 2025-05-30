// api/getReport.js
import { Redis } from "@upstash/redis";

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

export default async function handler(request, response) {
  // getReport should handle GET requests
  if (request.method !== "GET") {
    return response.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get the reportId from the URL query parameters (e.g., /api/getReport?id=xyz123)
    const { id } = request.query;

    if (!id) {
      return response.status(400).json({ message: "Report ID is required" });
    }

    // Fetch the data (which is a JSON string) from Redis using the ID
    const reportDataString = await redis.get(id);

    if (reportDataString === null) {
      // Check for null, as 'get' returns null if key doesn't exist
      return response
        .status(404)
        .json({ message: "Report not found or has expired." });
    }

    // Parse the JSON string back into an object before sending
    const reportData = reportDataString;
    console.log(typeof reportData);

    return response.status(200).json(reportData); // Send the actual report data
  } catch (error) {
    console.error("Error in /api/getReport:", error);
    // Differentiate error message from submit
    return response.status(500).json({ message: "Error fetching report" });
  }
}
