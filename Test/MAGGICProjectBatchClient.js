//1. filenames for input and outputs
var input = ""
var output = "CompleteCasesScored.csv"

// 1.5 try load module: axios
try {// check if axios module installed
  var axios = require('axios');
} catch {// first run message
  console.log("\n\n Welcome! Before you can process a batch of data \
  \n there is one more step you need to complete. \
  \n\n Please check you have Internet and \
  \n then use the keyboard to enter:  npm i axios");
  process.exit();
}

//1.75 load rest of modules: file system, readline
var fs = require('fs'); //allows to work with file systems on the computer
var readline = require('readline'); //provides model for reading data, one line at a time

//2. needed variables and create csv skeleton
var read = -1;
var progress = 0;
var announce = 0;
var random_order = "";
var csv_h = ['PatientID', 'IntegerRiskScore', '1YearMortalityRisk', '3YearMortalityRisk'];
var h_all = csv_h.length;

//API Setup <- Is this necessary?
var waitAPI = 1 + progress; //wait API befre next sending rows
var retries = 0; // max 3 retries per API
var API = "";// not selected by user yet
var ask = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//The rest of the code is linked together, one-by-one

//Pul input csv files
findcsv(); //calls the function to find the input csv file
function findcsv() { //defines the function to find the input csv file
  var find_csv = []; //variable for an array holding the csv files found in the folder searched
  var folder = fs.readdirSync("./Test/Inputs"); //Pulls input files from input director in the test folder ****************************************************
  for (var doc in folder) {
    if (require('path').extname(folder[doc]) === ".csv") {
      find_csv.push(folder[doc]); //Asigns any csv files in the Input folder to the find_csv array
    }
  }
  //CSV File found
  if (find_csv.length === 1) { //If only a single file that matches the requested input is found, input is set equal to find_csv
    input = find_csv[0];
    console.log("\nFOUND FILE: ", input, "\n");
  } else if (find_csv.length === 0) { //If no files are found, notify user and reattempt
    console.log("\nNO FILE FOUND");
    ask.question("\nWould you like to try again? \n\n0 -- Retry \n1 -- Close Program", function(answer) {
      if (answer === "0") {
        findcsv();
      } else {
        process.exit();
      }
    })
  } else { //if multiple inputs are available, notify user and end task
    console.log("\n Found more than two CSV files in current folder. \
    \n Please delete or move un-used CSV files ...");
    process.exit();
  }
  extract(input);
}

//Extract data from csv
function extract(csv) {
  process.chdir('./Test/Inputs'); //change the process directory to the folder that the input is being pulled from in the prior code ***************
  var stream = fs.createReadStream(csv,{encoding: 'utf8'});
  var rl = readline.createInterface({input: stream});
  rl.on('line', function(line) {
    if (line.startsWith(",") === false) {
      read++;// valid lines that can be sent to the API, empty lines not counted
      if (read > progress) {// progress usually 0 unless connection issues
        csvtojson(line, read);// only runs after reading to the current line progress
      }
    }
  });
}

//Job 1 - convert the extracted csv data to a json form that can be inputed into the KO
function csvtojson(row, waitlist) {
  var column = row.split(",");
  var schema = {
    "patient": {
      "inputs": {}
  }};
  var spi = schema.patient.inputs;
  //map KO keys to CSV_column values...
  schema.patient["PatientID"] = column[0];
  spi["EF"] = column[1];
  spi["Age"] = column[2];
  spi["SBP"] = column[3];
  spi["BMI"] = column[4];
  spi["Creatinine"] = column[5];
  spi["NYHA"] = column[6];
  spi["Gender"] = column[7];
  spi["Smoker"] = column[8];
  spi["Diabetic"] = column[9];
  spi["COPD"] = column[10];
  spi["BetaBloker"] = column[11];
  spi["ACEiARB"] = column[12];
  spi["DateDiagnosed"] = column[13];
  //Post to KO
  console.log(schema);
  //Post(schema);
}


/*
// 8. job 2, setup host: 0 = local KGrids API, 1 = online API
function POST(data) {
var host = ['http://localhost:8080/ipp/executive/process',
'http://activator.kgrid.org/ipp/executive/process']
axios.post(host[API], data)
.then( function(response) {
jsontocsv(response.data);
if (random_order === "no") {
waitAPI++;// move up waitlist
}
}).catch( function(error) {
if (error.response || error.request) {
// The request was made and the server responded with a status code that falls
// out of the range of 2xx or The request was made but no response received
if (retries < 6) {
if (API === 1) {
API = 0;
} else {
API = 1;
}
setTimeout( function() {
POST(data);
retries++;
}, 2000);
} else {
fs.writeFileSync("thank you/progress.txt", progress);
console.log("\n Server or connection issue. Please try again later.");
process.exit();
}
} else {
// Something happened in setting up the request that triggered an Error
fs.writeFileSync("thank you/progress.txt", progress);
console.log("\n Unknown Error ...", error.message, "\n ... Please try again later.");
}
});
}

// 9. job 3, convert json to csv
function jsontocsv(one) {
var csv_c = [];// fill one row of csv columns output, append later
csv_c.push( one.result.id );// next patient id
csv_c.push( one.result.lifeexpectancy.baseline );// next baseline
var hi = 0;// keep track of header keys processed
while (hi < h_all) {
try {// access header keys
var orl = one.result.lifeexpectancy[h[hi]];// not accessed: .result.rankedreclist
// then add column data
csv_c.push( orl[t][ns] );
csv_c.push( orl[t][s] );
csv_c.push( orl[t][g] );
csv_c.push( orl[bn][ns] );
csv_c.push( orl[bn][s] );
csv_c.push( orl[bn][g] );
} catch (err) {// no header key, no column data
csv_c.push(".", ".", ".", ".", ".", ".");
if (announce > 15) {// announce progress once in a while
process.stdout.write(" Progress:  " + (100*progress/read).toFixed(0) +
" % ... " + progress + "/" + read + " rows processed");
process.stdout.cursorTo(0);
announce = 0;
retries = 0;
}
}// next header key
hi++;
}// append row to csv
fs.appendFileSync(output,csv_c.join() + '\r\n');
progress++;
announce++;
if (read === progress) {
try {// remove file about row progress
fs.unlinkSync("thank you/progress.txt");
} catch {}// no file to remove, connection to API never lost
process.stdout.clearLine(0);
console.log(" Complete:  Processed batch of data ...", progress, "rows, not counting header row");
fs.writeFileSync("thank you/done.txt", progress);
}
}
*/
