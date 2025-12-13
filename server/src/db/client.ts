const connectToDatabase = require("../lib/db");

/**
 * Runs a database query using a newly acquired client.
 * @param {string} queryText - The SQL query string.
 * @param {Array} values - The query parameters.
 * @returns {Promise<object>} - The query result.
 */
async function query(queryText: string, values: any[]) {
  // You should configure these with your real DB config/environment variables.
  const config = {
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "postgres",
    password: process.env.PGPASSWORD || "password",
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  };

  const client = await connectToDatabase(config);
  try {
    const result = await client.query(queryText, values);
    return result;
  } finally {
    await client.end();
  }
}

module.exports = { query };
