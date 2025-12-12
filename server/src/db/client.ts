// src/db/client.ts
console.log("⚠️  Using DUMMY DB CLIENT — no real database calls are happening");

async function query(_text: string, _params?: any[]) {
  // Fake SELECT for "email exists"
  if (_text.includes("SELECT id FROM users WHERE email")) {
    return { rowCount: 0, rows: [] };
  }

  // Fake SELECT for login
  if (_text.includes("SELECT id, password_hash, username FROM users")) {
    // always return the same fake user with password hash "pass123"
    return {
      rowCount: 1,
      rows: [
        {
          id: "dummy-user-id",
          username: "dummyuser",
          password_hash:
            "$2b$10$QvGd3xzqgQFe1YpNRVseQeQHjwH1q7AEqRCGDpa2BkLomqKgJo0m2" // bcrypt hash for "pass123"
        }
      ]
    };
  }

  // Fake INSERT or anything else
  return { rowCount: 1, rows: [] };
}

module.exports = { query };
