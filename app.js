const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        pdf2base64 = require('pdf-to-base64');
        
        
const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.set("view engine", "ejs");

var data = [
    {entry: "test data point"}
]

app.get("/api/blender/view", function(req, res){
    res.render("landing", {data: data})
});

app.post("/api/blender/view", function(req, res){
    console.log("POST");
    var newEntry = JSON.parse(req.body.json_data);
    var newData = {entry: newEntry};
    data.push(newData);
    res.redirect("/");
});


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

async function pdf_base64(input, output){
    try {
        var outputString = await pdf2base64(input)
        fs.writeFile(output, 
            outputString, (err) => {
                if(err) console.log(err);
                console.log("file write success");
            });
        console.log("from function:");
        console.log(outputString);
        return outputString;

    } catch(e) {
        console.log(e.message)
    }
        
}


app.post("/api/blender/results", async (req, res) => {

        console.log("blender results");
        console.log(req.body);
        var newData = JSON.parse(req.body.json_data);
        console.log(newData);
        var newCtId = newData["ctId"];
        let filename = newCtId + ".pdf";
        console.log(filename);

        let inputFile = "public/" + filename;
        let outputFile = "public/output/" + newCtId + ".txt";
        
        let base64String = await pdf_base64(inputFile, outputFile);
        console.log("from route:")
        console.log(base64String)
        
        
        console.log("res send")
        res.send(
            {ctId: newCtId,
            soNumber: newData["soNumber"],
            pdfB64: base64String,
            }
        );



});


console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})