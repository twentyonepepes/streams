import { client as wsClient } from 'websocket';
import { Subject } from "rxjs";
import delay from "delay";

let warned = false;

export function SocketStreamConverter(wsurl){

	const stream$ = new Subject();
	const client = new wsClient();

	client.on('connect', function(connection) {

		console.info(`[socket-stream-converter] Connection to ${wsurl} successful"`);
	
		connection.on('close', function(){
	
			connect();
	
		})
		connection.on('message', function({utf8Data}) {
	
			stream$.next(JSON.parse(utf8Data));
	
		});
	});
	
	client.on('connectFailed', async function() {
	
		if (!warned) {

			console.warn(`[socket-stream-converter] Connection to ${wsurl} failed, retrying continuously.`);
			warned = true;
			
		}
		await delay(5000);
		connect();
	
	});
	
	function connect() {
		
		client.connect(wsurl);
		
	}

	connect();
	return stream$;
}