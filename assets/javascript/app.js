// Initialize Firebase
var config = {
    apiKey: "AIzaSyCoaAt0Jn4yqdSxGteMyKqituTnX0VPAfs",
    authDomain: "train-scheduler-304d3.firebaseapp.com",
    databaseURL: "https://train-scheduler-304d3.firebaseio.com",
    projectId: "train-scheduler-304d3",
    storageBucket: "train-scheduler-304d3.appspot.com",
    messagingSenderId: "307828762676"
};
firebase.initializeApp(config);
database = firebase.database();

$(function() {
    $('button[type=submit]').on('click', function(event) {
        event.preventDefault();
        database.ref().push({
            name: $("#form-name").val().trim(),
            destination: $("#form-destination").val().trim(),
            time: $("#form-time").val().trim(),
            frequency: $("#form-frequency").val().trim()
        })
        $("#form-name").val('');
        $("#form-destination").val('');
        $("#form-time").val('');
        $("#form-frequency").val('');

    })
    database.ref().on("child_added", function(snapshot) {
        var newTrain = snapshot.val();
        var tr = $('<tr>');
        var td = $('<td>');


        var tFrequency = newTrain.frequency;

        var firstTime = newTrain.time;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");


        tr.append(td.clone().text(newTrain.name));
        tr.append(td.clone().text(newTrain.destination));
        tr.append(td.clone().text(newTrain.frequency));
        tr.append(td.clone().text(moment(nextTrain).format("hh:mm A")));
        tr.append(td.clone().text(tMinutesTillTrain));
        $("tbody").append(tr);
    })
})