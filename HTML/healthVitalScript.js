var db = window.openDatabase('healthCamp', '1.0', 'Health DB', 2 * 1024 * 1024);

createRecordsVitalTable = function()
{
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS record2 (height TEXT, weight TEXT, temp TEXT, rate TEXT, bp TEXT, medication TEXT, notes TEXT)');
    });
};

insertNoteVital = function(height, weight, temp, rate, bp, medication, notes) {
    db.transaction(function(tx){
        tx.executeSql('insert into record2 (height, weight, temp, rate, bp, medication, notes) values(?,?,?,?,?, ?, ?)', [height.val(), weight.val(), temp.val(), rate.val(), bp.val(), medication.val(), notes.val()], function(tx, result) {
            console.log(result.insertId);
            alert("record inserted");
        }, function(tx, error) {
            console.log(error);
        });
    });
}

$(function(){
    $("#save-vital").click(function(event){
        event.preventDefault();
        createRecordsVitalTable();
        var height = $("#height");
        var weight = $("#weight");
        var temp = $("#temp");
        var rate = $("#rate");
        var bp = $("#bp");
        var medication = $("#medication");
        var notes = $("#notes");

        insertNoteVital(height, weight, temp, rate, bp, medication, notes);
        window.location.assign("/HealthCampSPA/HTML/report.html");
    });

});

