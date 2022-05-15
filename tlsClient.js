// crypto moduli
const crypto = require("crypto");
var tls = require('tls'); 
var fs = require('fs'); 
const PORT = 1234; 
const HOST = 'localhost' 



const algorithm = "des-cbc"; 

// gjenerojmë 8 bajt të dhëna random
const initVector = fs.readFileSync('public-cert.pem').toString().slice(36,44);

// të dhënat e mbrojtura
const message = "A do te i marrim te gjitha piket e projektit?";

// çelësi sekret gjeneron 32 bajt të dhëna të rastësishme
const Securitykey = fs.readFileSync('private-key.pem').toString().slice(36,44);

// cipher funksioni
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

// enkriptimi i mesazhit
// kodimi i mesazhit hyres
// kodimi i mesazhit dales
let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

//console.log("Encrypted message: " + encryptedData);



// Kalojini certifikatat serverit dhe njoftojeni që të përpunojë edhe certifikata të paautorizuara. 
var options = { 
    key:fs.readFileSync('private-key.pem'), 
    cert:fs.readFileSync('public-cert.pem'), 
    rejectUnauthorized:false 
    }; 
var client = tls.connect(PORT, HOST, options, function() { 
 // Kontrolloni nëse autorizimi funksionoi
if (client.authorized) { 
    console.log("Connection authorized by a Certificate Authority."); 
        } else { 
    console.log(`Connection not authorized: ${client.authorizationError}`); 
        } 
 // Dërgo një mesazh miqësor
client.write(encryptedData.toString()); 
    }); 
client.on("data", (data) => { 
    console.log(`Received: ${data}`); 
    }); 
client.on('close', () => { 
    console.log("Connection closed"); 
    });  
 // Kur një gabim shfaqet, tregoje atë.
client.on('error', (error) => { 
    console.error(error); 
// Mbyllni lidhjen pasi ka ndodhur gabimi.
    client.destroy(); 
    }); 