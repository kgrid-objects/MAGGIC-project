/* Table of Contents
Setup:  Steps 1 to 3
Process:  Steps 4 to 9
*/

// 1. filenames for input and output
var input = 'demo.csv';
var output = 'thank you/your_output.csv';

// 1.5 try load module: axios
try {// check if axios module installed
var axios = require('axios');
} catch {// first run message
console.log("\n\n Welcome! Before you can process a batch of data \
\n there is one more step you need to complete. \
\n\n Please check you have Internet and \
\n then use the keyboard to enter:  npm i axios");
process.exit();
}// load rest of modules: file system, readline
var fs = require('fs');
var readline = require('readline');

// 2. check if fully done before
if (fs.existsSync("thank you/done.txt")) {
console.log("\n Completed batch process before? \
\n\n Please move, rename or delete: ", output,
"\n ... and also delete file:  thank you/done.txt");
process.exit();
}

// 3. needed variables and create csv skeleton
var read = -1;// count data rows read (always counts header)
var progress = 0;// count data rows fully processed (does not include header)
var announce = 0;// count interval of data rows fully processed
var random_order = "";// ask user if random order okay
var csv_h = [];// csv headers output, write soon
// keys to get data value
var l = 'lifeexpectancy';
var t = 'total';
var bn = 'beforenext';
var ns = 'noscreening';
var s = 'screening';
var g = 'gain';
// github.com/kgrid-objects/ipp-collection/blob/master/collection/ipp-recommendationtable/recommendationlist.js#L51
// all possible keys for lifeexpectancy
var h = ['aaascreening','aspprev','brca12geneticscreening',
'brcaprevmed','brcascreening','cervicalscreening','crcscreening',
'decreasealcoholuse','depressioncontrol','diabetescontrol',
'diabetesscreening','healthydiet','hivtest','lose10lb',
'loseweight','lowerbp','lowercholesterol','lungcscreening',
'osteoporosisscreening','quitsmoking','statinuse'];
var h_all = h.length;
if (fs.existsSync(output)) {// check if processed before but not finished
progress = Number(fs.readFileSync("thank you/progress.txt", {encoding: "utf8"}));// 1 = add header
console.log("\n Resuming batch process from row: ", progress);
} else {// make csv headers custom template
csv_h.push( "id" );// header A requested by Glen
csv_h.push( "baseline" );// header B requested by Glen
for (var i = 0; i < h_all; i++) {
csv_h.push( [l, h[i], t, ns].join('.') );
csv_h.push( [l, h[i], t, s].join('.') );
csv_h.push( [l, h[i], t, g].join('.') );
csv_h.push( [l, h[i], bn, ns].join('.') );
csv_h.push( [l, h[i], bn, s].join('.') );
csv_h.push( [l, h[i], bn, g].join('.') );
} if (fs.existsSync('thank you/') === false) {
fs.mkdirSync('thank you/');
}
}

// API setup
var waitAPI = 1 + progress;// wait API before next sending row
var retries = 0;// max 3 retries per API
var API = "";// not selected by user yet
/* step 3 done...

The rest of the steps are linked together one by one.

The next line of code will run step 4 until the last step.
*/

selectAPI();// 3.5 ask user to select the preferred API
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

// 4.5 find the user's csv
function findcsv() {
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

// 6. job 1
function csvtojson(row, waitlist) {
var column = row.split(",");
if (column[0] !== "") {// skip empty rows at the beginning or before the end of the CSV
// create JSON with custom headers
var schema = {"patient": {"id": "","features": {} }};
var spf = schema.patient.features;
// map KO keys to CSV_column values...
var y = "Yes";// then convert to boolean, integers, etc
schema.patient["id"] = column[0];// column A
spf["age"] = Number(column[3]);// column D
spf["race"] = column[1];// column B
spf["gender"] = column[2];// column C
spf["height"] = Number(column[4]);
spf["weight"] = Number(column[5]);
spf["systolic"] = Math.round(column[8]);
spf["diastolic"] = Math.round(column[9]);
spf["totalcholesterol"] = Number(column[7]);
spf["LDL"] = Number(column[6]);
spf["triglycerides"] = Number(column[10]);
// HDL estimated --> HDL = TC - LDL - (TGLC/5)
spf["HDL"] = (spf["totalcholesterol"] - spf["LDL"] - (spf["triglycerides"]/5));
spf["a1c"] = Math.round(column[11]);
spf["cvd"] = (column[12] === y);
spf["cad"] = (column[13] === y);
spf["afib"] = (column[14] === y);
spf["lvh"] = (column[15] === y);
spf["cerebrovascular"] = (column[16] === y);
spf["diabetestype1"] = (column[17] === y);
spf["diabetes"] = column[18];
spf["hxglucose"] = (column[19] === y);
spf["colitis"] = (column[20] === y);
spf["hx_aaa"] = (column[21] === y);
spf["priorgipain"] = (column[22] === y);
spf["priorgiulcer"] = (column[23] === y);
spf["chestrx_childhood"] = (column[24] === y);
spf["hepatitis"] = (column[25] === y);
spf["hx_std"] = (column[26] === y);
spf["hx_tb"] = (column[27] === y);
spf["hx_unknownillness"] = (column[28] === y);
spf["hx_weakimmune"] = (column[29] === y);
spf["hiv"] = column[30];
spf["hiv_symptoms"] = (column[31] === y);
spf["antihypertensive"] = (column[32] === y);
spf["aspirin"] = (column[34] === y);
spf["statins"] = (column[33] === y);
spf["warfarin"] = (column[35] === y);
spf["nsaids"] = (column[36] === y);
spf["meds_bcapreventive"] = (column[37] === y);
spf["smoker"] = (column[38] === y);
spf["smoking_agebegan"] = (column[41] === "999") ? 16 : Number(column[41]);
spf["smoking_packsday"] = (column[42] === "999") ? 1 : Number(column[42]);
spf["history_smoker"] = (column[39] === y);
// columns with 999
// 40, 41, 42, 72, 74, 75
spf["years_since_quit"] = (column[40] === "999") ? 20 : Number(column[40]);
spf["prison"] = (column[43] === y);
// worked with George
spf["auditc1"] = (column[45] === "LessThanMonthly") ? "<=Monthly"
: (column[45] === "TwoToThreePerWeek") ? "2-4x per Month"
: (column[45] === "MoreThanFourPerWeek") ? "2-4x per Month"
: (column[45] === "TwoToFourPerMonth") ? "2-4x per Month" : column[45];
spf["auditc2"] = (column[46] === "10") ? "3-4"
// Glen said be 3-4, 5-6
: (column[46] === "3/4/2020") ? "3-4"
: (column[46] === "5/6/2020") ? "3-4" : column[46];
spf["auditc3"] = (column[47] === "Weekly") ? "<Monthly" : column[47];
spf["alcoholdrinks"] = Math.round(column[44]);
spf["alcohol_harmful_input"] = (column[49] === y);
spf["alcohol_dependent_input"] = (column[50] === y);
spf["sdds1"] = (column[51] === y);
spf["sdds2"] = (column[52] === y);
spf["depression_intake"] = (column[53] === y);
spf["depression_mdd"] = (column[54] === y);
spf["regular_colonoscopy"] = (column[55] === y);
spf["hx_screenaaa"] = (column[56] === y);
spf["famiy_aaa"] = (column[58] === y);
// https://github.com/kgrid-objects/ipp-collection/blob/master/collection/ipp-crcscreening/netbenefit.js
spf["firstdegree_colorectal"] = (column[59] === "ZeroOrDontKnow") ? "0 or Don't Know"
: (column[59] === "OneDiagnosedUnderFifty") ? "1 Diagnosed Age <=49y"
: (column[59] === "OneDiagnosedOverSixty") ? "1 Diagnosed Age >=60y" : column[59];
// end work
spf["fap_hnpcc"] = (column[60] === y);
spf["sti_learned"] = (column[61] === y);
spf["tested_syphilis"] = (column[62] === y);
spf["sex_msm"] = (column[63] === y);
spf["ivdrugs"] = (column[64] === y);
spf["sex_unprotecteddirect"] = (column[65] === y);
spf["sex_unprotectedindirect"] = (column[66] === y);
spf["sex_new"] = (column[67] === y);
spf["sex_multiple"] = (column[68] === y);
spf["sex_condom"] = (column[69] === y);
spf["sex_drugsmoney"] = (column[70] === y);
spf["menarche"] = Number(column[71]);
spf["menopause"] = (column[72] === "999") ? 50 : Number(column[72]);
spf["parity"] = Number(column[73]);
spf["agefirstbirth"] = (column[74] === "999") ? 25 : Number(column[74]);
spf["agefirstintercourse"] = (column[75] === "999") ? 17 : Number(column[75]);
spf["sexualpartners"] = Number(column[76]);
spf["oralcontraception"] = (column[77] === y);
spf["hrt"] = (column[78] === y);
spf["hx_bca"] = (column[79] === y);
spf["regular_mammogram"] = (column[80] === y);
spf["mastectomy_double"] = (column[81] === y);
spf["regular_pap"] = column[82];
spf["normal3_pap"] = column[83];
spf["abnormal_pap"] = column[84];
spf["cervix"] = (column[85] === y);
spf["ashkenazi"] = (column[86] === y);
spf["firstdegree_breast"] = column[87];
spf["firstdegree_breast50"] = (column[88] === y);
spf["firstdegree_breastbilateral"] = (column[89] === y);
spf["seconddegree_breastany"] = column[90];
spf["seconddegree_breastsame"] = column[91];
spf["male_breast"] = (column[92] === y);
spf["firstdegree_ovarian"] = column[93];
spf["seconddegree_ovarianany"] = column[94];
spf["seconddegree_ovariansame"] = column[95];
spf["breastovarian"] = (column[96] === y);
spf["brca1brca2"] = column[97];
spf["osteoporosis"] = column[98];
spf["ra"] = (column[99] === y);
spf["hxfracture"] = (column[100] === y);
spf["parentfracture"] = (column[101] === y);
spf["hxglucocorticoids"] = (column[102] === y);
spf["osteogenesis"] = (column[103] === y);
spf["hyperthyroid"] = (column[104] === y);
spf["malnutrition"] = (column[105] === y);
spf["malabsorption"] = (column[106] === y);
spf["hypogonadism"] = (column[107] === y);
spf["liver"] = (column[108] === y);
spf["tested_gonorrhea"] = (column[109] === y);
spf["tested_chlamydia"] = (column[110] === y);// column DG
if (random_order === "no") {
hold(schema, waitlist);// wait to send data
} else {
POST(schema);// don't wait to send data
}
}
}

// 7. holding data optional to get ordered rows returned
function hold(data, position) {
if (waitAPI === position) {// put data on hold
POST(data);// ready to call API
} else {
setTimeout( function() {
hold(data, position);
},0);
}
}

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
