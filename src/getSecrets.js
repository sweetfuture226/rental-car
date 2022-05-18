
const AWS = require("aws-sdk");
const fs = require("fs");

module.exports = () => {
	//configure AWS SDK
	require("dotenv").config();
	const config = {
    region: "us-east-1",
    accessKeyId: "AKIA6KPKNIC3KSSENZXJ",
    secretAccessKey: "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",
  };
	AWS.config.update(config);
	const region = "us-east-1";
	const client = new AWS.SecretsManager({ region });
  console.log({
		secretName: process.env.secretName,
	}, 'SECRET NAME LOG', process.env, 'PROCESS ENV')
	const SecretId = process.env.secretName || "quikinfluence-dev-backend";
	return new Promise(async (resolve, reject) => {
		//retrieving secrets from secrets manager
		client.getSecretValue({ SecretId }, async (err, data) => {
			if (err) {
				reject(err);
			} else {
				//parsing the fetched data into JSON
				const secretsJSON = JSON.parse(data.SecretString);
				let secretsString = "";
				Object.keys(secretsJSON).forEach((key) => {
					secretsString += `${key}=${secretsJSON[key]}\n`;		
				});
				// write and create an env file on the root directory
				fs.writeFileSync(".env", secretsString);
				require("dotenv").config();
				resolve(secretsString);
			}
		});
	});
};