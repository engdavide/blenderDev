const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        pdf2base64 = require('pdf-to-base64'),
        base64url = require('base64-url'),
        path = require('path');
        
        
const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public/output')))
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
    let newCtId = newEntry["ctId"];
    let filename = newCtId + "-decoded.pdf";
    let filepath = "./public/output/"
    
    let base64Buff = new Buffer(urlDecode(newEntry.pdfB64.toString('base64')), 'base64');
    fs.writeFileSync(filepath + filename, base64Buff);
    
    var anchorLink = '<a href=\"/static/' + filename + '\">re-converted PDF</a>';
    var newLink = {entry: anchorLink};
    newEntry.pdfB64 = base64Buff;
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
    
    let base64Buff = urlEncode(new Buffer(fs.readFileSync(inputFile)).toString('base64'));
    fs.writeFileSync(outputFile, base64Buff);

    res.send(
        {ctId: newCtId,
        soNumber: newData["soNumber"],
        pdfB64: base64Buff,
        }
    );
});






function urlEncode (unencoded) {
  return unencoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function urlDecode (encoded) {
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4)
    encoded += '=';
  return encoded;
};




// app.post("/api/blender/results", async (req, res) => {
//     console.log("blender results");
//     console.log(req.body);
//     var newData = JSON.parse(req.body.json_data);
//     console.log(newData);
//     var newCtId = newData["ctId"];
//     let filename = newCtId + ".pdf";
//     console.log(filename);

//     let inputFile = "public/" + filename;
//     let outputFile = "public/output/" + newCtId + ".txt";
    
//     let base64String = await pdf_base64(inputFile, outputFile);
//     // console.log("from route:")
//     // console.log(base64String)

//     // console.log("res send")
//     res.send(
//         {ctId: newCtId,
//         soNumber: newData["soNumber"],
//         pdfB64: base64String,
//         }
//     );



// });


// async function pdf_base64(input, output){
//     try {
//         var outputString = await pdf2base64(input)
//         fs.writeFile(output, 
//             outputString, (err) => {
//                 if(err) console.log(err);
//                 console.log("file write success");
//             });
//         // console.log("from function:");
//         // console.log(outputString);
//         return outputString;

//     } catch(e) {
//         console.log(e.message)
//     }
        
// }


console.log("PORT: ", process.env.PORT);
console.log("IP: ", process.env.IP);
app.listen(process.env.PORT, process.env.IP, function(){
        console.log("It's dead!");
})