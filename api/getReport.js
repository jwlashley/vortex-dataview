import { Redis } from "@upstash/redis";

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

export default async function handler(request, response) {
  try {
    const reportId = request.query.id;

    // Data is retrieved as a string
    const reportDataString = await redis.get(reportId);

    if (!reportDataString) {
      return response
        .status(404)
        .json({ message: "Report not found or has expired." });
    }

    // Parse the JSON string back into an object
    const reportData = JSON.parse(reportDataString);

    return response.status(200).json(reportData);
  } catch (error) {
    console.error("Error in /api/getReport:", error);
    return response.status(500).json({ message: "Error fetching report" });
  }
}
