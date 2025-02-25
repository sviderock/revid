import waw from 'whatsapp-web.js';

const { Client, LocalAuth } = waw;

let WAClient = new Client({
	authStrategy: new LocalAuth({
		dataPath: '../../session',
	}),
});

console.log('init Whatsapp client');
WAClient.initialize();

export default WAClient;
