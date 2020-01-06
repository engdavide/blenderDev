const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        pdf2base64 = require('pdf-to-base64');
        
        
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));



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
    console.log("blender results");
    console.log(req.body);
    var newData = JSON.parse(req.body.json_data);
    console.log(newData);
    var newCtId = newData["ctId"];
    let filename = newCtId + ".pdf";
    console.log(filename);
    
    
    let inputFile = "public/" + filename;
    let outputFile = "public/output/filename.txt"
    var outputString
    
    pdf2base64(inputFile)
        .then(
            (response) => {
                outputString = response;
                fs.writeFile(outputFile, 
                    response, (err) => {
                        if(err) console.log(err);
                        console.log("file write success");
                    });
            },
                res.send(
                    {ctId: newCtId,
                    soNumber: newData["soNumber"],
                    pdfB64: outputString,
                    }
                )
        )
        .catch(
            (error) => {
                console.log(error); //Exepection error....
            },
                res.send(
                    {Error: "FTP ERROR"
                    }
                )
        )

});


console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})