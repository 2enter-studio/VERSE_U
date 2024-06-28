module.exports = {
	apps: [
		{
			name: 'official-website',
			interpreter: 'bun',
			script: './build',
			instances: 1,
			out_file: 'logs/out.log',
			error_file: 'logs/error.log',
			merge_logs: true,
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			max_memory_restart: '200M'
		}
	]
};
