// scripts/createDailyReportsTable.js
// Script to create daily_reports table

const db = require("../config/db");

const createTable = async () => {
  try {
    console.log("Creating daily_reports table...");

    // Create table
    await db.query(`
      CREATE TABLE IF NOT EXISTS daily_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        report_date DATE NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, report_date)
      );
    `);

    console.log("✅ Table created successfully");

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_reports_user_id ON daily_reports(user_id);
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(report_date);
    `);

    console.log("✅ Indexes created successfully");

    // Create trigger function
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    console.log("✅ Trigger function created successfully");

    // Create trigger
    await db.query(`
      DROP TRIGGER IF EXISTS update_daily_reports_updated_at ON daily_reports;
      
      CREATE TRIGGER update_daily_reports_updated_at 
        BEFORE UPDATE ON daily_reports 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("✅ Trigger created successfully");
    console.log("🎉 All done! daily_reports table is ready.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating table:", error);
    process.exit(1);
  }
};

createTable();
