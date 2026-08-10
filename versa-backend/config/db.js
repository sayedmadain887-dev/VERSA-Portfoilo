const mongoose = require('mongoose');
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000
      })
      .then((mongooseInstance) => {
        console.log('[db] MongoDB connected');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('[db] Connection failed:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;