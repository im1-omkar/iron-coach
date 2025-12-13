const { Client } = require('pg');

/**
 * Connects to a PostgreSQL database using the provided config.
 * @param {Object} config - PG connection config object.
 * @returns {Promise<Client|null>} Resolves to pg Client instance if successful, or null on failure.
 */
async function connectPgDatabase(config) {
    const client = new Client(config);
    try {
        await client.connect();
        console.log("pg database is connected successfully");
        return client;
    } catch (error) {
        console.log("pg database connection failed:", error.message);
        return null;
    }
}

module.exports = { connectPgDatabase };
