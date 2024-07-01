require('dotenv/config');
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;

module.exports = {
  apps: [
    {
      name: 'VERSE_U official website',
      script: './build/index.js',
      exec_mode: 'cluster',
      instances: 'max',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M',
      env: {
        PORT,
        ORIGIN
      }
    }
  ]
};
