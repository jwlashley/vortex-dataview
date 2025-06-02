import { Redis } from "@upstash/redis";
import { customAlphabet } from "nanoid";

// Initialize Redis from environment variables
const redis = Redis.fromEnv();
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const reportData = request.body;
    const reportId = nanoid();

    await redis.set(reportId, JSON.stringify(reportData), {
      ex: 10800, // Expires in 86400 seconds (24 hours)
    });

    return response.status(200).json({ id: reportId });
  } catch (error) {
    console.error("Error in /api/submit:", error);
    return response.status(500).json({ message: "Error processing report" });
  }
}
