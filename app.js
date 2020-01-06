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
    console.log("POST");
    res.send(
        {success: "true",
        ftp_path: "/var/www/gcsm.dev/public",
        ftp_host: "gcsm.dev",
        expected_file: "nan"
        }
    );
});


console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})