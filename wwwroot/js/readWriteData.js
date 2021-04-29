
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBLgMQlksXG0DEvTzPJAzj-B2ecsq3aIqQ",
    authDomain: "scaffold-sql.firebaseapp.com",
    databaseURL: "https://scaffold-sql-default-rtdb.firebaseio.com",
    projectId: "scaffold-sql",
    storageBucket: "scaffold-sql.appspot.com",
    messagingSenderId: "163714277862",
    appId: "1:163714277862:web:4d4b2f73ddcc73a3747627",
    measurementId: "G-177TCV719C"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();


//This data var, you fill out what you want to add to the database
//var question_Data = {
//    Questions: "Another question"
//}

//this will add a child to qid, in this case '2_2', .set(data) is what writes the information to that destination
//database.ref('qid').child('2_2').child('Questions').set(question_Data);

//This data var, you fill out what you want to add to the database
/*var data = {
    ParsonProblems: "no",
    attempts: 244,
    question: "This is another question",
}
*/
//this will add a child to qid, in this case '2_2', .set(data) is what writes the information to that destination
//database.ref('qid').child('2_2').set(data);

//this will go to qid/2_2/attempts and increment attempts by 100 to 344 from 244
//database.ref('qid').child('2_2').child('attempts').set(firebase.database.ServerValue.increment(100));

//database.ref('2_2').child('Entry #' + 1).child('attempts').set(firebase.database.ServerValue.increment(100));


//console.log("Attempts is " + attemptsMade);

var attemptsMade = database.ref('qid');
attemptsMade.on('value', gotData, errData);

//prints out the values in the database to the console
function gotData(data) {
    var attempts = data.val();
    //var keys = Object.keys(attempts);
    //console.log(keys);
    console.log(attempts);
}

function errData(err) {
    console.log('Error!');
    console.log(err);
}