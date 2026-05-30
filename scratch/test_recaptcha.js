const apiKey = 'AIzaSyB8Jb6ybtjSz2CjGBenuKxXZWUlDFNQj7E';
const projectId = 'tai-sdhnv';
const siteKey = '6Lctk_IsAAAAAKpZkGQeKZ9qsCi7xWdqEK34AseJ';
const token = 'test-token'; // This will probably be invalid, but we want to see the API's response format and behavior.

async function run() {
	const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				event: {
					token: token,
					siteKey: siteKey,
					expectedAction: 'submit'
				}
			})
		});

		console.log('Status:', response.status, response.statusText);
		const data = await response.json();
		console.log('Response Body:', JSON.stringify(data, null, 2));
	} catch (err) {
		console.error('Error:', err);
	}
}

run();
