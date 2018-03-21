var db = window.openDatabase('healthCamp', '1.0', 'Health DB', 2 * 1024 * 1024);

fetchRecords = function(callback){

    var record1 = "";
    var record2 = "";

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM record1', [],
            function(SQLTransaction, data1){
                record1= data1;
                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM record2', [],
                        function(SQLTransaction, data2){
                            record2 = data2;
                            callback(record1,record2);
                        });
                });
            });
    });
};

getDataAJAXCall = function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var finalRecord1 = [];
            var result = JSON.parse(this.response);
            var records  = result.result;
            for (var i = 0; i < records.length; i++) {
                finalRecord1.push({
                    name: records[i].name,
                    gender: records[i].gender,
                    age: records[i].age,
                    medication: records[i].medication,
                    notes: records[i].notes,
                    image: records[i].image
                });
            }
            console.log(finalRecord1);

            var html = '';
            for (var j = 0; j < finalRecord1.length; j++) {
                var photo = "<img src=" + finalRecord1[j].image + " width='250px' height='200px'>";
                html += '<tr><td>' + (j + 1) + '</td><td>' + finalRecord1[j].name + '</td><td>' + finalRecord1[j].age + '</td>' +
                    '<td>' + finalRecord1[j].gender + '</td><td>' + photo + '</td><td>' + finalRecord1[j].medication + '</td>' +
                    '<td>' + finalRecord1[j].notes + '</td></tr>';
            }
            $('#report_table tr').first().after(html);
        }
    };
    xhttp.open("GET", "http://localhost:3001/getData",true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
};

$(function(){

    var finalRecord1 = [];

    if(navigator.onLine) {
        fetchRecords(function(record1, record2){
            for (var i = 0; i < record1.rows.length && i < record2.rows.length; i++) {
                var row1 = record1.rows.item(i);
                var row2 = record2.rows.item(i);

                var firstName = row1['firstName'];
                var lastName = row1['lastName'];
                var gender = row1['gender'];
                var age = row1['age'];
                var details = row1['details'];
                var image = row1['image'];
                var height = row2['height'];
                var weight = row2['weight'];
                var temp = row2['temp'];
                var rate = row2['rate'];
                var bp = row2['bp'];
                var medication = row2['medication'];
                var notes = row2['notes'];

                var name = firstName + " " + lastName;
                finalRecord1.push({name: name, gender:gender, age: age,
                    details: details, image: image, height:height,
                    weight: weight, temp: temp, rate: rate, bp:bp,
                    medication: medication,
                    notes: notes });
            }
            // AJAX call to save the data and delete call to delete from the table
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM record1', [],
                            function(tx, result){
                                db.transaction(function(tx) {
                                    tx.executeSql('DELETE FROM record2', [],
                                        function(tx, result){
                                            console.log("deleted");
                                        });
                                });
                            });
                    });

                    getDataAJAXCall();
                }
            };
            xhttp.open("POST", "http://localhost:3001/saveHealthRecord",true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(finalRecord1));
        });


        //call to display the data on the record screen
    } else {
        var finalRecord = [];
        fetchRecords(function (record1, record2) {
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
                finalRecord.push({
                    name: name,
                    gender: gender,
                    age: age,
                    medication: medication,
                    notes: notes,
                    image: image
                });
            }
            console.log(finalRecord);

            var html = '';
            for (var j = 0; j < finalRecord.length; j++) {
                var photo = "<img src=" + finalRecord[j].image + " width='250px' height='200px'>";
                html += '<tr><td>' + (j + 1) + '</td><td>' + finalRecord[j].name + '</td><td>' + finalRecord[j].age + '</td>' +
                    '<td>' + finalRecord[j].gender + '</td><td>' + photo + '</td><td>' + finalRecord[j].medication + '</td>' +
                    '<td>' + finalRecord[j].notes + '</td></tr>';
            }
            $('#report_table tr').first().after(html);
        });
    }
});
