var execBtn = document.getElementById("execute");
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var commandsElm = document.getElementById('commands');
var dbFileElm = document.getElementById('dbfile');
var savedbElm = document.getElementById('savedb');
var testCaseElm = document.getElementById('testcase_output')
var hintBtn = document.getElementById('hint')
var hintAreaElm = document.getElementById('hint_area')
var questionString = document.getElementById('questionOutput')
var nohintClass = document.getElementsByClassName('nohint')

var worker = new Worker("../../dist/worker.sql-wasm-debug.js");
worker.onerror = error;

var attempts = null;
var called = false;
var someBS;
var slicedBS = '';
var questionOutput = "";
var question = "";
var writeExecTime = "";
var hintExecuteTimestamp = "";



//import fs from 'fs';

//fs.readFile('testLine.txt', 'utf8', function (err, data) {
//	if (err) throw err;
//	console.log(data);
//});

// Open a database
worker.postMessage({ action: 'open' });

// Connect to the HTML element we 'print' to
function print(text) {
    outputElm.innerHTML = text.replace(/\n/g, '<br>');
}

function loadBookDB() {
    commands = "PRAGMA foreign_keys=off; \
 	DROP TABLE IF EXISTS TradeTransactions; \
	DROP TABLE IF EXISTS GuildTreasury; \
	DROP TABLE IF EXISTS Items; \
	DROP TABLE IF EXISTS Guilds; \
	DROP TABLE IF EXISTS Players; \
	CREATE TABLE Players( 		\
      		playerID integer primary key,  			\
      		playerName varchar(255),                 	\
      		playerLevel integer,				\
      		guildID integer,				\
      		coins integer,				\
		FOREIGN KEY (guildID) REFERENCES Guilds(guildID)  ON DELETE CASCADE ON UPDATE CASCADE	\
	);						\
	CREATE TABLE Guilds( 				\
      		guildID integer primary key,  			\
      		guildName    varchar(255),                 	\
      		guildLevel integer,				\
		dateCreated date,			\
		leader integer,				\
		FOREIGN KEY (leader) REFERENCES Players(playerID) ON DELETE CASCADE ON UPDATE CASCADE	\
	);						\
	CREATE TABLE Items( 				\
      		itemID integer primary key,  			\
      		itemName    varchar(255),                 	\
      		minLevel integer,				\
		type VARCHAR(255),			\
		handedness int				\
	);						\
	CREATE TABLE GuildTreasury ( 				\
      		guildID integer,  			\
      		itemID integer,                 	\
		quantity integer,			\
		FOREIGN KEY (guildID) REFERENCES Guilds(guildID) ON DELETE CASCADE ON UPDATE CASCADE,	\
		FOREIGN KEY (itemID) REFERENCES Items(itemID) ON DELETE CASCADE ON UPDATE CASCADE	\
	);						\
	CREATE TABLE TradeTransactions ( 				\
		transactionID integer primary key,				\
      		sendingPlayerID integer,  			\
      		receivingPlayerID integer,                 	\
		transactionTime datetime,			\
		itemID integer,					\
		FOREIGN KEY (sendingPlayerID) REFERENCES Players(playerID) ON DELETE CASCADE ON UPDATE CASCADE,	\
		FOREIGN KEY (receivingPlayerID) REFERENCES Players(playerID) ON DELETE CASCADE ON UPDATE CASCADE,	\
		FOREIGN KEY (itemID) REFERENCES Items(itemID) ON DELETE CASCADE ON UPDATE CASCADE	\
	);						\
  INSERT INTO Players VALUES (1, 'Elyse', 21, 10, 1234); \
  INSERT INTO Players VALUES (2, 'Alyma', 18, 20, 2133); \
  INSERT INTO Players VALUES (3, 'Kennis', 8, 10, 453); \
  INSERT INTO Players VALUES (4, 'Blothie', 2, 20, 120); \
  INSERT INTO Players VALUES (5, 'Radix', 8, 20, 529); \
  INSERT INTO Players VALUES (6, 'Apl', 1, NULL, 1); \
  INSERT INTO Players VALUES (7, 'Babbage', 2, 20, 111); \
  INSERT INTO Players VALUES (8, 'Cait', 11, NULL, 742); \
  INSERT INTO Players VALUES (9, 'Mintee', 19, 30, 889); \
  INSERT INTO Players VALUES (10, 'Wraithse', 12, 30, 951); \
  INSERT INTO Players VALUES (11, 'Plucki', 11, 40, 112); \
  INSERT INTO Players VALUES (12, 'Sava', 15, NULL, 1021); \
  INSERT INTO Players VALUES (13, 'Vera', 9, 50, 831); \
  INSERT INTO Players VALUES (14, 'Aventop', 3, 60, 1); \
  INSERT INTO Players VALUES (15, 'Kylomer', 4, 60, 104); \
  INSERT INTO Players VALUES (16, 'Rydomin', 6, 60, 114); \
  INSERT INTO Players VALUES (17, 'Sulin', 5, 60, 117); \
  INSERT INTO Players VALUES (18, 'Xylo', 1, 70, 2); \
  INSERT INTO Players VALUES (19, 'Penni', 4, 20, 201); \
  INSERT INTO Guilds VALUES (10, 'Grey Warriors', 20, '2019-05-03', 1); \
  INSERT INTO Guilds VALUES (20, 'Shocking Power', 18, '2019-05-04', 2); \
  INSERT INTO Guilds VALUES (30, 'Shimmering Light', 1, '2019-04-19', 9); \
  INSERT INTO Guilds VALUES (40, 'Gray Wolf Clan', 2, '2019-04-20', 11); \
  INSERT INTO Guilds VALUES (50, 'Winds of Grey', 4, '2019-04-25', 13); \
  INSERT INTO Guilds VALUES (60, 'Grey Mountaineers', 7, '2019-06-01', 17); \
  INSERT INTO Guilds VALUES (70, 'Bitter Power Pals', 3, '2019-04-25', NULL); \
  INSERT INTO Guilds VALUES (80, 'Vengeful Warriors', 4, '2019-05-11', NULL); \
  INSERT INTO Items VALUES (100, 'Iron Sword', 5, 'sword', 1); \
  INSERT INTO Items VALUES (200, 'Steel Battleaxe', 8, 'axe', 2); \
  INSERT INTO Items VALUES (300, 'Steel Bow', 7, 'bow', 2); \
  INSERT INTO Items VALUES (400, 'Bronze Axe', 10, 'axe', 1); \
  INSERT INTO Items VALUES (500, 'Bronze Bow', 10, 'bow', 2); \
  INSERT INTO Items VALUES (600, 'Silver Dagger', 15, 'dagger', 1); \
  INSERT INTO Items VALUES (700, 'Steel Dagger', 1, 'dagger', 1); \
  INSERT INTO Items VALUES (800, 'Iron Staff', 2, 'staff', 2); \
  INSERT INTO Items VALUES (900, 'Dwarven Axe', 18, 'axe', 1); \
  INSERT INTO GuildTreasury VALUES (10, 300, 3); \
  INSERT INTO GuildTreasury VALUES (10, 900, 1); \
  INSERT INTO GuildTreasury VALUES (20, 700, 2); \
  INSERT INTO GuildTreasury VALUES (20, 200, 11); \
  INSERT INTO GuildTreasury VALUES (60, 100, 6); \
  INSERT INTO GuildTreasury VALUES (10, 100, 12); \
  INSERT INTO GuildTreasury VALUES (50, 400, 1); \
  INSERT INTO GuildTreasury VALUES (30, 200, 14); \
  INSERT INTO GuildTreasury VALUES (20, 600, 4); \
  INSERT INTO GuildTreasury VALUES (20, 800, 1); \
  INSERT INTO GuildTreasury VALUES (20, 900, 1); \
  INSERT INTO GuildTreasury VALUES (40, 300, 4); \
  INSERT INTO GuildTreasury VALUES (30, 300, 10); \
  INSERT INTO GuildTreasury VALUES (30, 400, 7); \
  INSERT INTO GuildTreasury VALUES (20, 400, 8); \
  INSERT INTO GuildTreasury VALUES (40, 200, 6); \
  INSERT INTO GuildTreasury VALUES (40, 600, 4); \
  INSERT INTO GuildTreasury VALUES (20, 100, 14); \
  INSERT INTO GuildTreasury VALUES (40, 800, 2); \
  INSERT INTO GuildTreasury VALUES (50, 200, 2); \
  INSERT INTO GuildTreasury VALUES (10, 700, 1); \
  INSERT INTO GuildTreasury VALUES (50, 900, 3); \
  INSERT INTO GuildTreasury VALUES (30, 100, 16); \
  INSERT INTO GuildTreasury VALUES (60, 400, 3); \
  INSERT INTO TradeTransactions VALUES (1, 2, 4, '2019-04-02 10:01:03', 100); \
  INSERT INTO TradeTransactions VALUES (2, 3, 4, '2019-04-04 10:01:04', 300); \
  INSERT INTO TradeTransactions VALUES (3, 4, 1, '2019-04-04 11:07:15', 100); \
  INSERT INTO TradeTransactions VALUES (4, 10, 6, '2019-04-06 10:01:28', 600); \
  INSERT INTO TradeTransactions VALUES (5, 10, 3, '2019-04-09 10:01:52', 800); \
  INSERT INTO TradeTransactions VALUES (6, 7, 2, '2019-04-17 10:01:21', 900); \
  INSERT INTO TradeTransactions VALUES (7, 9, 11, '2019-04-22 10:01:12', 900); \
  INSERT INTO TradeTransactions VALUES (8, 1, 12, '2019-04-28 10:01:46', 100); \
  INSERT INTO TradeTransactions VALUES (9, 2, 13, '2019-05-03 14:01:03', 200); \
  INSERT INTO TradeTransactions VALUES (10, 2, 13, '2019-05-03 14:01:59', 300); \
  INSERT INTO TradeTransactions VALUES (11, 16, 1, '2019-05-04 05:01:03', 400); \
  INSERT INTO TradeTransactions VALUES (12, 17, 4, '2019-05-12 22:01:53', 300); \
  INSERT INTO TradeTransactions VALUES (13, 6, 3, '2019-05-19 16:42:16', 300); \
  INSERT INTO TradeTransactions VALUES (14, 9, 11, '2019-05-29 10:01:03', 600); \
  INSERT INTO TradeTransactions VALUES (15, 12, 2, '2019-05-30 12:59:21', 600); \
  INSERT INTO TradeTransactions VALUES (15, 12, 2, '2019-05-30 13:01:02', 900); \
  INSERT INTO TradeTransactions VALUES (16, 2, 14, '2019-05-30 13:02:12', 200); \
  INSERT INTO TradeTransactions VALUES (17, 3, 2, '2019-05-30 13:05:38', 700); \
  INSERT INTO TradeTransactions VALUES (18, 7, 4, '2019-05-30 13:07:03', 300); \
  INSERT INTO TradeTransactions VALUES (19, 2, 4, '2019-05-30 13:52:11', 200); \
  INSERT INTO TradeTransactions VALUES (20, 9, 19, '2019-05-30 13:52:44', 200); \
  INSERT INTO TradeTransactions VALUES (21, 9, 19, '2019-05-30 14:00:51', 100); \
  INSERT INTO TradeTransactions VALUES (24, 4, 6, '2019-06-09 08:17:49', 800); \
  INSERT INTO TradeTransactions VALUES (25, 4, 7, '2019-06-10 10:32:00', 700); \
  INSERT INTO TradeTransactions VALUES (26, 6, 4, '2019-06-16 14:31:41', 200); \
  INSERT INTO TradeTransactions VALUES (22, 10, 6, '2019-06-21 10:01:01', 100); \
  INSERT INTO TradeTransactions VALUES (23, 10, 7, '2019-06-21 12:01:04', 300); \
  INSERT INTO TradeTransactions VALUES (27, 5, 12, '2019-06-21 14:01:29', 100); \
  INSERT INTO TradeTransactions VALUES (28, 1, 17, '2019-06-21 14:01:33', 900); \
  INSERT INTO TradeTransactions VALUES (29, 5, 1, '2019-07-12 10:01:30', 700); \
  INSERT INTO TradeTransactions VALUES (30, 7, 3, '2019-07-13 10:01:33', 700); \
  PRAGMA foreign_keys=on; \
";
    worker.postMessage({ action: 'exec', sql: commands });
}
function error(e) {
    console.log(e);
    errorElm.style.height = '2em';
    errorElm.textContent = e.message;
    errorCalled = true;

}

function noerror() {
    errorElm.style.height = '2em';
    errorElm.textContent = " ";
}

// Run a command in the database
function execute(commands) {
    testCaseElm.innerHTML = ""

    writeExecTime = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleString('en-US', 'best-fit', 'short')

    var username = document.getElementsByClassName("fs-block");
    if (username) {
        console.log(username)
        console.log("USERNAME: " + username)
    }
    noerror();
    tic();
    worker.onmessage = function (event) {
        if (event.data.error) {
            event.message = event.data.error;
            error(event);
        }

        var results = event.data.results;
        toc("Executing SQL");

        tic();
        outputElm.innerHTML = "";
        for (var i = 0; i < results.length; i++) {
            runAsserts(results[i])
            outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
        }
        toc("Displaying results");
    }

    worker.postMessage({ action: 'exec', sql: commands });
    outputElm.textContent = "Fetching results...";


}

var runAsserts = function (results) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('q')) {
        question = params.get('q')
        //console.log("THIS IS THE QUESTION " + question);
        question.replace(/./, _)
        //console.log("THIS IS THE QUESTION " + question);

        //question needs to be changed to format of #_# as opoposed to #.#
        //submit altered question string to database

        // What I'd really like to do is load a file with the assert list
        let url = question + '.txt';
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'text';
        request.onload = function () {
            //readQuestions(request.response);
            checkAsserts(results, request.response)
            //checkParson(request.response)
            setGlobalVariable(request.response);

        };
        request.send()
    }
}



//pass test case result from checkAsserts function to check if the string contains '100%'
var checkIncorrectAnswer = function (result, parsonInterface) {
    var questionO = window.questionOutput
    var newQuestionO = questionO.replace(/\r/, "");
    //var parsonInterface = window.

    //var newQuestionOutput = newQuestionO.replace(/"\"/g, "");
    var questionNumber = window.question;
    questionNumber.replace(/./, _)
    console.log("THIS IS THE QUESTION " + questionNumber);

    //var writeExecTime = window.executeTimestamp;
    //console.log("The timestamp is " + writeExecTime);

    var writeHintTime = window.hintExecuteTimestamp;
    console.log("This hint timestamp is " + writeHintTime);


    console.log("QuestionO is " + newQuestionO);
    const falseBool = "false";
    const subString = "100%";
    //if string does not contain '100%', increment attempts and print to console
    if (!result.includes(subString)) {
        console.log("Not a 100%, sorry!");
        attempts += 1;
        console.log("You have answered a question incorrectly " + attempts + " times.");
    }
    //else includes the substring of '100%' in results
    else {
        attempts += 1;
        console.log("You have answered a question correctly, it only took " + attempts + " times");
        //write_Attempt_To_FireBase(attempts);

        //hint was not clicked
        if (called == false) {
            //write_Attempt_To_FireBase(attempts);
            write_Parsons_To_FireBase(called, attempts, newQuestionO, questionNumber);
        }
        //hint was used
        else if (called == true) {
            //write_Attempt_To_FireBase(attempts);
            write_Attempts_To_FireBase(called, attempts, newQuestionO, questionNumber);
            console.log("You hit hint button " + called);
        }

        attempts = 0;
    }

    //if attempts == 5 and the hint button was not clicked, click the hint button. Test case interface informs Parsons interface
    if (attempts == 5 && called == false && parsonInterface.includes(falseBool)) {
        write_Attempts_To_FireBase(called, attempts, newQuestionO, questionNumber);
        console.log("You have answered a question incorrectly " + attempts + " times.");
        //attempts += 1;

        //attempts = 0;
    }
    else if (attempts == 5 && called == false) {
        document.getElementById('hint').click();
        write_Attempts_To_FireBase(called, attempts, newQuestionO, questionNumber);
        console.log("You have answered a question incorrectly " + attempts + " times.");
    }




}

var write_Parsons_To_FireBase = function (called, attempts, questionOutput, questionNumber, executeTimestamp) {
    //if (typeof called === "boolean") {
    //    this.called = called;
    //} else if (typeof called === 'string') {
    //    this.attempts = attempts;
    //}
    //console.log("in write_Parsons_To_Firebase, timestamp is " + executeTimestamp)
    //This parsonData var, you fill out what you want to add to the database

    //var writeExecTime = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toUTCString()
    //var writeExecTime = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toUTCString()
    var executeTime = window.writeExecTime;


    //var newWriteExecTime = writeExecTime.toDate().toLocaleTimeString('en-US')




    //const timeStampDate = record.createdAt;
    //const dateInMillis = timeStampDate._seconds * 1000

    //var date = new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString()


    var parsonsData = {
        ExecuteTimestamp: executeTime,
        Parson: called,
        Attempts: attempts,
        Question: questionOutput,
        QuestionNumber: questionNumber
       
    }

    var i = 0;


    var number = i;

    str = number.toString();
    var string = "entry";

    var ref = database.ref('parsons').child(string);
    ref.push(parsonsData);
    //database.ref('qid').child('2_2').set(parsonsData);


    //}

    //this will add a child to qid, in this case '2_2', .set(data) is what writes the information to that destination
    //database.ref('qid').child('2_2').child('ParsonProblems').set(parsonsData);

    //for (var i = 1; i < 1000; i++) {
    //database.ref('qid').child('2_2').child('entry').set(firebase.database.ServerValue.increment(1));

    //database.ref('qid').child('2_2').child('entry').child('ParsonProblems').set(parsonsData);


    //

    //}
}

var write_Attempts_To_FireBase = function (called, attempts, questionOutput, questionNumber) {

    this.attempts = window.attempts
    console.log("This is attempts in writeAttempts" + attempts);


    var executeTime = window.writeExecTime;
    var writeHintTime = window.hintExecuteTimestamp;

    //This data var, you fill out what you want to add to the database
    var attemptsData = {
        ExecuteTimestamp: executeTime,
        HintTimestamp: writeHintTime,
        Parson: called,
        Attempts: attempts,
        Question: questionOutput,
        QuestionNumber: questionNumber
        //Something: dis,

        //Hint_Timestamp: hintTimestamp
    }

    //database.ref('qid').child('2_2').child('entry').set(attemptsData);

    var i = 0;
    //var s = 2;
    //for (i = 1; i < 2; i++) {

    var number = i;
    //var str;

    str = number.toString();
    var string = "entry";
    //var entryString = string.concat(str);

    var ref = database.ref('parsons').child(string);
    ref.push(attemptsData);
    //database.ref('qid').child('2_2').child(entryString).removeValue(attemptsData);
    //database.ref().set(attemptsData);
    //database.ref('qid').child('2_2').set(attemptsData);


    //database.ref('qid').child('2_2').child(entryString).child('attempts').set(attemptsData);

    //}
}

//    //entryIncrement(attemptsData);


//    //this will add a child to qid, in this case '2_2', .set(data) is what writes the information to that destination
//    //database.ref('qid').child('2_2').child('attempts').set(attemptsData);
//    //var entry = 0;
//}

//var entryIncrement = function (attemptsData, parsonsData) {
//	this.attemptsData = attemptsData;
//	var i = 0;

//	for (i = 1; i < 4; i++) {

//		var number = i;
//		var str;

//		str = number.toString();
//		var string = 'entry';
//		var entryString = string.concat(str);
//		console.log("This is " + entryString);


//		database.ref('qid').child('2_2').child(entryString).child('attempts').set(attemptsData);
//		database.ref('qid').child('2_2').child(entryString).child('Parsons').set(parsonsData);


//	}

//}






var checkAsserts = function (result_table, test_list) {
    var tests = test_list.split(/\n/);
    //for loop i = 0 < 1, we read in question and sumbit it to firebase
    for (var i = 0; i < 1; i++) {
        questionOutput = tests.shift();

        for (var i = 0; i < 2; i++) {
            if (i == 0) {
                var parsonInterfaceInput = tests.shift();
                //console.log("parsons interface is " + parsonInterfaceInput);
                var parsonInterface = parsonInterfaceInput.toLowerCase();
                console.log("parsons interface is " + parsonInterface);
                var falseBool = "false";

                //const subString = "100%";
                ////if string does not contain '100%', increment attempts and print to console
                //if (!result.includes(subString))

                if (parsonInterface.includes(falseBool)) {


                    $("#execute").click(function () {
                        $("#hint").addClass("invisible")
                    });

                }

            }
            else if (i == 1) {

            }


        }

        //check 499
        //output = "<div>" + questionOutput + "</div>"
        //questionString.innerHTML += output

        //questionString.innerHTML = questionOutput;

    }
    for (var i = 0; i < 3; i++) {
        if (i == 1) {
            this.code_word = tests.shift();
        }
        else {
            this.ppCode_Word = tests.shift();

        }
    }

    //this.code_word = tests.shift();
    this.passed = 0;
    this.failed = 0;
    // Tests should be of the form
    // assert row,col oper value for example
    // assert 4,4 == 3
    var result = "";
    for (let test of tests) {
        let wlist = test.split(/\s+/);
        //console.log(wlist)
        let assertType = wlist.shift();
        if (assertType == 'V') {
            let loc = wlist.shift();
            let oper = wlist.shift();
            let expected = wlist.join(" ").trim();
            let [row, col] = loc.split(",");
            result += this.testValueAssert(
                row,
                col,
                oper,
                expected,
                result_table
            );
        } else if (assertType == "C") {
            let loc = wlist.shift();
            let oper = wlist.shift();
            let expected = wlist.join(" ").trim();
            result += this.testColumnAssert(
                loc,
                oper,
                expected,
                result_table
            );

        } else if (assertType == "L") {
            let length_type = wlist.shift();
            let expected = wlist.shift();
            result += this.testLengthAssert(
                length_type,
                expected,
                result_table
            );
        }
        result += "\n";
    }
    let pct = (100 * this.passed) / (this.passed + this.failed);
    pct = pct.toLocaleString(undefined, { maximumFractionDigits: 2 });
    result += `You passed ${this.passed} out of ${this.passed + this.failed
        } tests for ${pct}%`;
    if (this.failed == 0 && called == false) {
        result += "\nCodeword is " + Decryption(code_word);
        console.log("this is the code word " + code_word);

    }
    else if (this.failed == 0 && called == true) {
        result += "\nCodeword is " + Decryption(ppCode_Word);
    }
    testCaseElm.innerHTML += result

    checkIncorrectAnswer(result,parsonInterface);
}

function Decryption(code_word) {
    var decrypted = CryptoJS.AES.decrypt(code_word, "SQL is the best");
    return decrypted.toString(CryptoJS.enc.Utf8);;
    console.log("Decrypted is " + decrypted);
}



var addPassMessage = function (message) {
    output = "<div class='pass'>" + message + "</div>"
    //Remove this to turn off testcase
    testCaseElm.innerHTML += output
}

var addFailMessage = function (message) {
    output = "<div class='fail'>" + message + "</div>"
    //remove this to turn off textcase
    testCaseElm.innerHTML += output
}

var testLengthAssert = function (length_type, expected, result_table) {
    if (length_type == "R") {
        var actual = result_table.values.length
    } else if (length_type == "C") {
        var actual = result_table.columns.length
    }
    let output = "";
    let res = expected == actual;
    if (res) {
        if (length_type == "R") {
            addPassMessage(`Pass: ${actual} == ${expected} for number of rows</div>`);
        } else if (length_type == "C") {
            addPassMessage(`Pass: ${actual} == ${expected} for number of columns`);
        }
        this.passed++;
    } else {
        if (length_type == "R") {
            addFailMessage(`Fail: ${actual} == ${expected} for number of rows`);
        } else if (length_type == "C") {
            addFailMessage(`Fail: ${actual} == ${expected} for number of columns`);
        }
        this.failed++;
    }
    return output;
}

const operators = {
    "==": function (operand1, operand2) {
        return operand1 == operand2;
    },
    "!=": function (operand1, operand2) {
        return operand1 != operand2;
    },
    ">": function (operand1, operand2) {
        return operand1 > operand2;
    },
    "<": function (operand1, operand2) {
        return operand1 > operand2;
    },
};


var testColumnAssert = function (loc, oper, expected, result_table) {
    let actual = result_table.columns[loc];
    let output = "";
    console.log(actual == expected)
    console.log("'" + actual + "'")
    console.log("'" + expected + "'") //are we comparing two strings to one string

    let res = operators[oper](actual, expected);
    if (res) {
        addPassMessage(`Pass: ${actual} ${oper} ${expected} for column name in column ${loc}`);
        this.passed++;
    } else {
        addFailMessage(`Fail: ${actual} ${oper} ${expected} for column name in column ${loc}`);
        this.failed++;
    }
    return output;
}



//2nd line parsons on or off, 3rdline, move secrets to 4 and 5

var testValueAssert = function (row, col, oper, expected, result_table) {
    let actual = result_table.values[row][col];
    let output = "";

    let res = operators[oper](actual, expected);
    if (res) {
        addPassMessage(`Pass: ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`);
        this.passed++;
    } else {
        addFailMessage(`Fail: ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`);
        this.failed++;
    }
    return output;
}


// Create an HTML table
var tableCreate = function () {
    function valconcat(vals, tagName) {
        if (vals.length === 0) return '';
        // Replace empty null values with NULL text
        for (var i = 0; i < vals.length; i++) {
            if (vals[i] === null) {
                vals[i] = "NULL";
            }
        }

        var open = '<' + tagName + '>', close = '</' + tagName + '>';
        return open + vals.join(close + open) + close;
    }
    return function (columns, values) {
        var tbl = document.createElement('table');
        var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
        var rows = values.map(function (v) { return valconcat(v, 'td'); });
        html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
        tbl.innerHTML = html;
        return tbl;
    }
}();

// Execute the commands when the button is clicked
function execEditorContents() {
    // Start the worker in which sql.js will run
    noerror()
    execute(editor.getValue() + ';');
}
execBtn.addEventListener("click", execEditorContents, true);

//var checkParson = function (test_list) {
//    var test = test_list;
//    //console.log("Test is here LOOK LOOK\n" + test);
//    var lookFor = 'Parson';
//    if (test.includes(lookFor)) {
//        //console.log("TEST INCLUDES PP\n" + test);
//        someBS = test.split('Parson');
//        slicedBS = someBS[1];
//        slicedBS = slicedBS.replace(/^\s+|\s+$/g, '');

//        console.log("SOMEBS[1] is " + someBS[1]);
//        console.log("Substring of slicedBS is " + slicedBS.split(/\n/));
//        //console.log("SlicedBS is " + slicedBS)
//        //return slicedBS;
//    }
//}

var setGlobalVariable = function (test_list) {
    var test = test_list;
    someBS = test.split('Parsons');
    slicedBS = someBS[1];
    slicedBS = slicedBS.replace(/^\s+|\s+$/g, '');


}

// Execute the commands when the button is clicked
function hintClicked() {
    called = true;

    var hintTimestamp = Date.now();
    hintExecuteTimestamp = new Date(hintTimestamp);

    hintExecuteTimestamp = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleString('en-US', 'best-fit', 'short');

    var initial = slicedBS;
    //    "SELECT $$toggle::*::playerId::minLevel$$ , " +
    //"$$toggle::*::playerId::type$$\n" +
    //"INSERT INTO $$toggle::Players$$" +
    //"($$toggle::playerName$$ , " + "$$toggle::playerLevel$$ , " +
    //"$$toggle::coins$$ )\n" +
    //"VALUES ('$$toggle::Rakem$$' , " + "$$toggle::1$$ , " + "$$toggle::0$$ );\n" +
    //"SELECT $$toggle::*::playerId::minLevel$$\n" +
    //"FROM $$toggle::Players::Guilds::Items$$;\n" +
    //"FROM $$toggle::Guilds::GuildTreasury::Items$$ , " +
    //"$$toggle::Guilds::GuildTreasury::Items$$\n" +
    //"WHERE $$toggle::playerId::playerName$$ = " +
    //"$$toggle::1::6$$;\n" +
    //"WHERE $$toggle::Guilds.guildID::GuildTreasury.guildID$$ = " +
    //"$$toggle::Guilds.guildID::GuildTreasury.guildID$$\n" +
    //"DELETE FROM $$toggle::Players::Guilds::Items$$\n" +
    //"AND $$toggle::Guilds.guildName$$ = " + "  '$$toggle::Shimmering Light::Shocking Power::Winds of Grey$$';  \n";

    $(document).ready(function () {
        var parson = new ParsonsWidget({
            'sortableId': 'sortable',
            'trashId': 'sortableTrash',
            'vartests': [],
            lang: "en",
            'grader': ParsonsWidget._graders.LanguageTranslationGrader,
            'executable_code': initial,
            'programmingLang': "pseudo",
            can_indent: false
        });
        parson.init(initial);
        parson.shuffleLines();
        $("#newInstanceLink").click(function (event) {
            event.preventDefault();
            parson.shuffleLines();
        });
        $("#feedbackLink").click(function (event) {
            executable_code = parson.grader._replaceCodelines()
            console.log(executable_code);
            execute(executable_code + ';');

        });
        //setGlobalVariable(request.response);
    });



    //Remove the SQL interpreter


    var hintAreaElm = document.getElementById("hint_area");
    if (hintAreaElm.style.display === "none") {
        hintAreaElm.style.display = "block";
    } else {
        hintAreaElm.style.display = "none";
    }
    [].forEach.call(document.querySelectorAll('.nohint'), function (el) {
        el.style.display = 'none';
    });
    [].forEach.call(document.querySelectorAll('.CodeMirror'), function (el) {
        el.style.display = 'none';
    });
}

hintBtn.addEventListener("click", hintClicked, true);




// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
    var dt = performance.now() - tictime;
    console.log((msg || 'toc') + ": " + dt + "ms");
}

// Add syntax highlighting to the textarea
var editor = CodeMirror.fromTextArea(commandsElm, {
    mode: 'text/x-mysql',
    viewportMargin: Infinity,
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: false,
    lineWrapping: true,
    extraKeys: {
        "Ctrl-Enter": execEditorContents,
        //"Ctrl-S": savedb,
    }
});