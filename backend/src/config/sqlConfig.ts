import mssql from "mssql";
import dotenv from "dotenv";

dotenv.config();
export const sqlConfig = {
  user: "sa",
  password: "I@mrich254",
  database: "week8",
  server: "DESKTOP-E7G5E3R\\MSSQLSERVER01",
  // port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true, 
  },
};

export async function testConnection() {


  const pool = await mssql.connect(sqlConfig);

  if (pool.connected) {
    console.log("connected to database");
  } else {
    console.log("connection failed");
  }
}

testConnection()