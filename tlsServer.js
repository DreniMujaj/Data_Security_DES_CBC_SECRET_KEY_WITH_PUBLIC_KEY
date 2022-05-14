var tls = require('tls'); 
var fs = require('fs'); 
// crypto module
const crypto = require("crypto");

const PORT = 1234; 
const HOST = 'localhost' 

// generate 16 bytes of random data
const initVector = fs.readFileSync('public-cert.pem').toString().slice(36,44);

// secret key generate 32 bytes of random data
const Securitykey = fs.readFileSync('private-key.pem').toString().slice(36,44);

const algorithm = "des-cbc"; 

var options = { 
key:fs.readFileSync('private-key.pem'), 
cert:fs.readFileSync('public-cert.pem') 
}; 

// the decipher function
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);




var server = tls.createServer(options, function(socket) { 
// Send a friendly message 
socket.write("I will decrypt your data"); 
// Decrypt the data that we received 
socket.on('data', (data) => { 

    let decryptedData = decipher.update(data.toString(), "hex", "utf-8");

    decryptedData += decipher.final("utf8");
    console.log("Encrypted message recived: " + data);
    console.log("Decrypted message from server: " + decryptedData);
    //console.log(`Received:${data.toString()}`) 
    }); 
// Let us know when the transmission is over 
socket.on('end', function() { 
console.log('EOT (End Of Transmission)'); 
    }); 
}); 
// Start listening on a specific port and address 
server.listen(PORT, HOST, function() { 
console.log("I'm listening at %s, on port %s", HOST, PORT); 
}); 
// When an error occurs, show it. 
server.on('error', function(error) { 
console.error(error); 
// Close the connection after the error occurred. 
server.destroy(); 
}); 