import { exec } from "child_process";

// const { PUBLIC_SUPA_PROJ_ID } = Bun.env;

const targetFiles = ["./functions/types.ts"];
let command =
	`supabase gen types typescript --local --schema public > ./types.ts;`;

for (const targetFile of targetFiles) {
	command += ` cp ./types.ts ${targetFile};`;
}

command += "rm ./types.ts;";

exec(command, (err, stdout, stderr) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(stdout);
	console.error(stderr);
});
