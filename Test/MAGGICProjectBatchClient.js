//1. filenames for input and outputs
var input = "CompleteCases.csv"
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

//The rest of the code is linked together, one-by-One

// 3.5 ask user to select the preferred API
/*selectAPI();
function selectAPI() {
  if (API === "" || API === "again") {
    API = "";// in case again
    var localAPI = "Local API";
    var onlineAPI = "Online API";
    var ask = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    ask.question("\n Select your preference ... \
    \n\n 0 -- " + localAPI + "\
    \n 1 -- " + onlineAPI + "\
    \n\n Please enter 0 or 1:  ", function(answer) {
      if (answer === "0") {
        API = 0;
        console.log("\n Thank you. The", localAPI, "will be called first to process \
        \n each row of data. If the", localAPI, "goes down, the", onlineAPI,
        "\n will be called second and the batch process will be slightly slower.");
      } else if (answer === "1") {
        API = 1;
        console.log("\n Thank you. The", onlineAPI, "will be called first to process \
        \n each row of data. If the", onlineAPI, "goes down, the\n"
        , localAPI, "(if available) will be called.");
      } else {
        API = "again";
        console.log("\n Please try again. Enter 0 or 1. Do not enter zero or one.");
      }
      ask.close();
    });
    ask.on('close', function() {
      while (API === "") {// wait for answer
      }
      selectAPI();// ask again if needed
    });
  } else {// run step 4 to the end
    selectOrder();
  }
}

// step 4. select ordered rows returned
function selectOrder() {
  if (random_order === "" || random_order === "again") {
    random_order = "";// in case again
    var ask = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    ask.question("\n Also, is it okay if CSV rows are returned in random order? \
    \n\n 0 -- Yes\
    \n 1 -- No\
    \n\n Please enter 0 or 1:  ", function(answer) {
      if (answer === "0") {
        random_order = "yes";
        console.log("\n CSV rows will come back in random order.\
        \n The batch processing may finish FASTER however the connection may be less stable.");
      } else if (answer === "1") {
        random_order = "no";
        console.log("\n CSV rows will not come back in random order.\
        \n The batch processing may finish SLOWER; the connection may be more stable.");
      } else {
        random_order = "again";
        console.log("\n Please try again. Enter 0 or 1. Do not enter zero or one.");
      }
      ask.close();
    });
    ask.on('close', function() {
      while (random_order === "") {// wait for answer
      }
      selectOrder();// ask again if needed
    });
  } else {// next line adds created headers to csv
    fs.writeFileSync(output, csv_h.join() + '\r\n');
    csv_h = null;// headers no longer needed in memory
    findcsv();// run step 4 to the end
  }
}
*/

//Pul input csv files
findcsv(); //calls the function to find the input csv file
function findcsv() { //defines the function to find the input csv file
  var find_csv = [];
  var folder = fs.readdirSync("./");
  for (var doc in folder) {
    if (require('path').extname(folder[doc]) === ".csv") {
      if (folder[doc] !== input) {
        find_csv.push(folder[doc]);
      }
    }
  }
// CSV files found
  if (find_csv.length === 0) {// use demo.csv
    console.log("\n DEMO FILE:  ", input, "\n");
  } else if (find_csv.length === 1) {// use your CSV
    input = find_csv[0];
    console.log("\n FOUND FILE:  ", input, "\n");
  } else {
    console.log("\n Found more than two CSV files in current folder. \
    \n Please delete or move un-used CSV files ...");
    process.exit();
  }
  extract(input);
}

// 5. extract data from csv
function extract(csv) {
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

//Job 1
function csvtojson(row, waitlist) {
  var column = row.split(",");
  if (column[0] !== "") {
    var schema
  }
}
