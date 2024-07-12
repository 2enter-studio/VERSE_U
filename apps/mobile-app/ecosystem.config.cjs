require('dotenv/config');

const PORT = process.env.PORT || 3000;

module.exports = {
	apps: [
		{
			name: 'Verse U App',
			interpreter: 'serve',
			script: './build',
			instances: 'max',
			out_file: 'logs/out.log',
			error_file: 'logs/error.log',
			merge_logs: true,
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			max_memory_restart: '200M',
			env: {
				PORT
			}
		}
	]
};
