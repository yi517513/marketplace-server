const RedisClient = require("ioredis");

class Redis {
  static client = null;

  static async connect() {
    if (!Redis.client) {
      Redis.client = new RedisClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_KEY,
      });

      Redis.client.on("connect", () => console.log("Redis 連線成功"));
      Redis.client.on("error", (err) => console.error("Redis 連線錯誤:", err));

      try {
        await Redis.client.ping();
        console.log("Redis 連線測試成功");
      } catch (err) {
        console.error("Redis 無法連線:", err);
        process.exit(1); // 連線失敗時強制終止應用程式
      }
    }

    return Redis.client;
  }

  static getClient() {
    if (!Redis.client) {
      throw new Error("Redis 尚未連線，請先呼叫 Redis.connect()");
    }
    return Redis.client;
  }

  static async disconnect() {
    if (Redis.client) {
      await Redis.client.quit();
      console.log("Redis 連線已關閉");
      Redis.client = null;
    }
  }
}

module.exports = Redis;
