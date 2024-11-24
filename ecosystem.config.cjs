require('dotenv/config');
// const PORT = process.env.PORT || 3000;
const { API_PORT, ONE_O_ONE_PORT, APP_PORT, WEBSITE_PORT } = process.env;
// const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;

module.exports = {
  apps: [
    {
      name: 'VERSE_U official website',
      script: './build',
      cwd: './apps/website',
      exec_mode: 'cluster',
      out_file: '../../logs/website/out.log',
      error_file: '../../logs/website/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M',
      env: {
        PORT: WEBSITE_PORT || 3000
        // ORIGIN
      }
    },
    {
      name: 'VERSE_U API Server',
      interpreter: 'bun',
      cwd: './apps/web-app-backend',
      script: './src/server.ts',
      out_file: '../../logs/api/out.log',
      error_file: '../../logs/api/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M',
      env: {
        PORT: API_PORT || 3000
      }
    },
    {
      name: 'Verse U App',
      interpreter: 'serve',
      cwd: './apps/mobile-app',
      script: './build',
      out_file: '../../logs/app/out.log',
      error_file: '../../logs/app/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M',
      env: {
        PORT: APP_PORT || 3000
      }
    },
    {
      name: 'Verse U 101 App',
      interpreter: 'serve',
      cwd: './apps/web-app-frontend',
      script: './build',
      out_file: '../../logs/101/out.log',
      error_file: '../../logs/101/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M',
      env: {
        PORT: ONE_O_ONE_PORT || 3000
      }
    }
  ]
};
