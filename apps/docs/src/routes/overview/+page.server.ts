import fs from 'fs';
export const load = async () => {
	const pkg = fs.readFileSync('../../package.json', 'utf-8');
	return {
		packageJson: JSON.parse(pkg)
	};
};
