//filenames for input and outputs
var input = ""
var output = "CompleteCasesScored.csv" //Update based on intended output************

//try load module: axios
try {// check if axios module installed
  var axios = require('axios');
} catch {// first run message
  console.log("\n\n Welcome! Before you can process a batch of data \
  \n there is one more step you need to complete. \
  \n\n Please check you have Internet and \
  \n then use the keyboard to enter:  npm i axios");
  process.exit();
}

//load rest of modules: file system, readline
var fs = require('fs'); //allows to work with file systems on the computer
var readline = require('readline'); //provides model for reading data, one line at a time
var axios = require('axios');

//needed variables and create csv skeleton
var read = -1;
var progress = 0;
var announce = 0;
var random_order = "";
var csv_h = ['PatientID', 'IntegerRiskScore', '1YearMortalityRisk', '3YearMortalityRisk'];
var h_all = csv_h.length;
process.chdir('Outputs') //****************************************************** Check
fs.writeFileSync(output, csv_h.join() + '\r\n');

//API Setup
var waitAPI = 1 + progress; //wait API befre next sending rows
var retries = 0; // max 3 retries per API
var API = "";// not selected by user yet
var ask = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//The rest of the code is linked together, one-by-one

//Pull input csv files
findcsv(); //calls the function to find the input csv file
function findcsv() { //defines the function to find the input csv file
  var find_csv = []; //variable for an array holding the csv files found in the folder searched
  process.chdir('../'); //*****************************************************************************check
  var folder = fs.readdirSync("Inputs"); //Pulls input files from input director in the test folder ****************************************************
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
  process.chdir('Inputs'); //change the process directory to the folder that the input is being pulled from in the prior code ***************
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
  var t = "TRUE";
  schema.patient["PatientID"] = column[0];
  spi["EF"] = Number(column[1]);
  spi["Age"] = Number(column[2]);
  spi["SBP"] = Number(column[3]);
  spi["BMI"] = Number(column[4]);
  spi["Creatinine"] = Number(column[5]);
  spi["NYHA"] = Number(column[6]);
  spi["Gender"] = column[7];
  spi["Smoker"] = (column[8] === t);
  spi["Diabetic"] = (column[9] === t);
  spi["COPD"] = (column[10] === t);
  spi["DateDiagnosed"] = Number(column[13]);
  spi["BetaBlocker"] = (column[11] === t);
  spi["ACEiARB"] = (column[12] === t);
  //Post to KO
  cleave(schema, waitlist);
}

//Split up data to retain pt ID's
function cleave(schema, waitlist) {
  var ids = schema.patient["PatientID"];
  var data = schema.patient.inputs;
  hold(data, waitlist, ids)
}

//hold data to get ordered rows returned
function hold(data, position, ids) {
  if (waitAPI === position) {
    POST(data, ids);
  } else {
    setTimeout( function() {
      hold(data, position, ids);
    }, 0);
  }
}

//Setup host and pass data :
function POST(data, ids) {
  var data = JSON.stringify(data);
  var config = {
    method: 'post',
    url: 'http://localhost:9090/99999/pb4jh3tk9s/1.0/maggicRiskScore',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data : data
    };
    axios(config)
    .then(function (response) {
      jsontocsv(response.data, ids);
      waitAPI++;
    })
    .catch(function (error) {
    console.log(error);
    });
  }


////KO is spitting out appropriate results, now convert back in csv.

//Convert json to csv
function jsontocsv(one, ids) {
  //var one = JSON.stringify(one);
  var csv_c = [];
  csv_c.push(ids);
  csv_c.push(one.result.riskOutputs['Integer Risk Score']);
  csv_c.push(one.result.riskOutputs['One Year Mortality Probability']);
  csv_c.push(one.result.riskOutputs['Three Year Mortality Probability']);
  console.log(csv_c);

  //append row to csv
  process.chdir('../'); //******************************************check
  process.chdir('Outputs') //*************************************check
  fs.appendFileSync(output, csv_c.join() + '\r\n');
}
