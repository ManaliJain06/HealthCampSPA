var db = window.openDatabase('healthCamp', '1.0', 'Health DB', 2 * 1024 * 1024);

fetchRecords = function(callback){

    var record1 = "";
    var record2 = "";

    db.transaction(function(tx) {
        tx.executeSql('SELECT firstName, lastName, gender, age, image FROM record1', [],
            function(SQLTransaction, data1){
                record1= data1;
                db.transaction(function(tx) {
                    tx.executeSql('SELECT medication, notes FROM record2', [],
                        function(SQLTransaction, data2){
                            record2 = data2;
                            callback(record1,record2);
                        });
                });
            });
    });
};

$(function(){

    // deleteNote();
    var finalRecord = [];
    fetchRecords(function(record1,record2){
        for (var i = 0; i < record1.rows.length && i < record2.rows.length; i++) {
            var row1 = record1.rows.item(i);
            var row2 = record2.rows.item(i);

            // var id1 = row1['id'];
            var firstName = row1['firstName'];
            var lastName = row1['lastName'];
            var gender = row1['gender'];
            var age = row1['age'];
            var image = row1['image'];
            // var id2 = row2['id'];
            var medication = row2['medication'];
            var notes = row2['notes'];

            var name = firstName + " " + lastName;
            finalRecord.push({name: name, gender:gender, age: age, medication: medication, notes: notes, image: image });
        }
        console.log(finalRecord);

        var html = '';
        for(var j = 0; j < finalRecord.length; j++) {
            var photo = "<img src="+ finalRecord[j].image +" width='250px' height='200px'>";
            html += '<tr><td>' + (j+1) + '</td><td>' + finalRecord[j].name + '</td><td>' + finalRecord[j].age + '</td>' +
                '<td>' + finalRecord[j].gender + '</td><td>' + photo + '</td><td>' + finalRecord[j].medication + '</td>' +
                '<td>' + finalRecord[j].notes + '</td></tr>';
        }
        $('#report_table tr').first().after(html);
    });
});
