import { Request } from "express";
import { createClient } from "redis";
import config from "../config";

const redisClient = createClient({
  password: config.REDIS.PASSWORD,
  socket: {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    connectTimeout: 5000
  }
});

redisClient.on("error", (err: any) => console.error("Redis Client Error", err));

redisClient.connect();

export const getRedisKey = (req: Request) => {
  const key = `${req.url}|+|${
    (req as any).user ? (req as any).user.email : "-"
  }|+|${JSON.stringify(req.query)}|+|${JSON.stringify(req.params)}`;
  return key;
};

export const deleteKeysByPattern = async (pattern: string) => {
  let cursor = 0; // Initialize cursor as a number
  const keysToDelete: string[] = [];
  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100
    });
    keysToDelete.push(...reply.keys);
  } while (cursor !== 0);

  if (keysToDelete.length > 0) {
    await redisClient.del(...(keysToDelete as any));
  }
};

export default redisClient;
