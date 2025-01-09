//RV download client
const https = require('https');
const fs = require('fs');

const url = 'https://academy.idsa.support/abs/downloadclientlauncher/getDownloadJAR?configuration=ARIS&language=en-US&tenant=default&jar=true';
//const url = 'https://ceskaposta.idsa.support/abs/downloadClient/aris_database.jsp';

const outputFile = 'ARIS_Clinet_default.jar';

let startTime = Date.now();
let downloadedBytes = 0;


async function downloadFile(index) {
  
https.get(url, (response) => {
    const totalBytes = parseInt(response.headers['content-length'], 10);
    console.log(`Total size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

    const file = fs.createWriteStream(index+"_"+outputFile);

    response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const speed = (downloadedBytes / elapsedTime) / 1024; // KB/s
        console.log(`Downloaded: ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB | Speed: ${speed.toFixed(2)} KB/s`);
    });

    response.pipe(file);

    response.on('end', () => {
        console.log('Download complete!' + "(" +index+")");
       
    });

    response.on('error', (err) => {
        console.error('Error downloading file:', err);
    });
});
}


var totalDownload = 5;
// Simulate 10 downloads in parallel
async function simulateDownloads() {
    const downloadPromises = [];
    for (let i = 1; i <= totalDownload; i++) {
       downloadPromises.push(downloadFile(i));
    }

    
}


simulateDownloads().then(() => console.log("Script fully completed."));
