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
				analyzeSentiment(body);
				console.log(body);
				response.end('ok');
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

function analyzeSentiment(message)
{
	//extract "string=" string from message
	message.substring(7);
	start()
}

async function start(){
	const result = await sentimentFunction();
}

const sentimentFunction = async function()
{
	// Imports the Google Cloud client library
	const language = require('@google-cloud/language');

	// Creates a client
	const client = new language.LanguageServiceClient();

	const text = 'and i oop';

	// Prepares a document, representing the provided text
	const document = {
	  content: text,
	  type: 'PLAIN_TEXT',
	};

	// Detects the sentiment of the document
	const [result] = await client.analyzeSentiment({document});

	const sentiment = result.documentSentiment;
	console.log(`Document sentiment:`);
	console.log(`  Score: ${sentiment.score}`);
	console.log(`  Magnitude: ${sentiment.magnitude}`);

	const sentences = result.sentences;
	sentences.forEach(sentence => {
	  console.log(`Sentence: ${sentence.text.content}`);
	  console.log(`  Score: ${sentence.sentiment.score}`);
	  console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
	});
}

