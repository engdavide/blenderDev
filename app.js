const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        pdf2base64 = require('pdf-to-base64');
        
        
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let inputFile = "public/CTtest.pdf"
let outputFile = "public/output/jsonOut.txt"

pdf2base64(inputFile)
    .then(
        (response) => {
            // console.log(response); //cGF0aC90by9maWxlLmpwZw==
            fs.writeFile(outputFile, 
                response, (err) => {
                    if(err) console.log(err);
                    console.log("file write success");
                });
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )

app.post("/api/blender", function(req, res){
    console.log("blender");
    res.send(
        {success: "true",
        ftp_path: "/var/www/gcsm.dev/public",
        ftp_host: "gcsm.dev",
        expected_file: "nan"
        }
    );
});

app.post("/api/blender/results", function(req, res){
    console.log("blend results");
    console.log(req.body);
    var newData = req.body.json_data;
    var newCtId = req.body.json_data.ctId;
    console.log(newData);
    let filename = newCtId + ".pdf";
    console.log(filename);
    res.send(
        {ctId: newCtId,
        soNumber: req.body.json_data.soNumber,
        pdfB64: "148hasdjnfd",
        }
    );
});


console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})