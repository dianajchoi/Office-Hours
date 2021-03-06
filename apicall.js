var http = require('http');
var url = require('url');
var fs = require('fs');

//start server
var server = http.createServer(function(request, response)
{
	//get url for server
	var path = url.parse(request.url).pathname;
	switch (path)
	{
		//if apicall detected, get it ready for a post request from officehours.html
		case '/apicall':
			let body = "";
			request.on('data', chunk => {
				body += chunk.toString();
			});
			request.on('end', () =>{
				body = decodeURI(body);
				console.log(body);
				analyzeSentiment(body).then((result)=>{
					console.log(result);
					response.end(""+result.toString());
				})
				
			});
			break;
		//if html page detected, return page
		case '/officehours.html':
			fs.readFile(__dirname + path, function(error, data)
			{
				if (error)
				{
					response.writeHead(404);
					response.writeError(error);
					response.end();
				}
				else
				{					
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write(data);
					response.end();
				}
			})
			break;
		default:
			response.writeHead(404);
			response.write("Oops, this doesn't exist - 404");
			response.end();
			break;
	}
});
server.listen(8082);

async function analyzeSentiment(message)
{
	//extract "string=" string from message
	message.substring(7);
	return await start(message);
}

async function start(message){
	let temp=await sentimentFunction(message);
	return temp;
}

const sentimentFunction = async function(message)
{
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient();

	const text = message;

	// Prepares a document, representing the provided text
	const document = {
	  content: text,
	  type: 'PLAIN_TEXT',
	};

	// Detects the sentiment of the document
	const [result] = await client.analyzeSentiment({document});

	const sentiment = result.documentSentiment;
	console.log(`${sentiment.score}`);
	var sent = sentiment.score;
	//send back to frontend
	return sent;
}

