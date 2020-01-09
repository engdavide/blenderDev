const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        path = require('path');

const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public/output')))
app.set("view engine", "ejs");

//Test runs...FULL

    function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    
    function base64_decode(base64str, file) {
        var bitmap = new Buffer(base64str, 'base64')
        fs.writeFileSync(file, bitmap);
        console.log('file conversion complete');
    }
    
    // // convert to base64 encoded string
    // var base64str = base64_encode('test.pdf');
    // fs.writeFileSync('testB64.txt', base64str);
    // // convert base64 string back to file
    // let base64StrRead = fs.readFileSync('testB64.txt').toString();
    // base64_decode(base64StrRead, 'testDecoded.pdf');


var data = [
    {entry: "test data point"}
]

app.get("/api/blender/view", function(req, res){
    res.render("landing", {data: data})
});

app.post("/api/blender/view", function(req, res){
    console.log("POST");
    var newEntry = JSON.parse(req.body.json_data);
    let newCtId = newEntry["ctId"];
    let filename = newCtId + "-decoded.pdf";
    let filepath = "./public/output/"

    let base64StrRead = fs.readFileSync('testB64.txt').toString();
    base64_decode(base64StrRead, filepath + filename);
    
    var anchorLink = '<a href=\"/static/' + filename + '\">re-converted PDF</a>';
    var newLink = {entry: anchorLink};
    newEntry.pdfB64 = base64StrRead;
    var newData = {entry: JSON.stringify(newEntry)};
    data.push(newLink, newData);
    res.send(
        {success: "true"}
    );
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


app.post("/api/blender/results", (req, res) => {
    console.log("blender results");
    console.log(req.body);
    var newData = JSON.parse(req.body.json_data);
    console.log(newData);
    var newCtId = newData["ctId"];
    let filename = newCtId + ".pdf";
    console.log(filename);

    let inputFile = "public/" + filename;
    let outputFile = "public/output/" + newCtId + ".txt";
    
    var base64Str = base64_encode(inputFile);
    fs.writeFileSync(outputFile, base64str);
    
    // let base64Buff = urlEncode(new Buffer(fs.readFileSync(inputFile)).toString('base64'));
    
    res.send(
        {ctId: newCtId,
        soNumber: newData["soNumber"],
        pdfB64: base64Str,
        }
    );
});




console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})