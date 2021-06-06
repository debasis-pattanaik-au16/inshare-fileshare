const File = require('../models/file');
const fs = require('fs');
const connectDB = require('../config/db');

connectDB();

const fetchData = async () => {
  try {
    // 24 hours ago
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });

    if (files.length) {
      for (const file of files) {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      }
    }
  } catch (error) {
    console.log(`Error while deleting file ${error}`);
  }
  console.log('Link deleted successfully');
};

fetchData().then(process.exit);
