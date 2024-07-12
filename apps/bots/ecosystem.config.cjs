module.exports = {
  apps: [
    {
      name: 'Verse U bg bot',
      interpreter: 'bun',
      script: './index.ts',
      instances: 1,
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '200M'
    }
  ]
};
