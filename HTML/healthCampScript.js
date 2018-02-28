
var db = window.openDatabase('healthCamp', '1.0', 'Health DB', 2 * 1024 * 1024);

//Create the table method
createRecordsTable = function()
{
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS record1 (firstName TEXT, lastName TEXT, gender TEXT, age TEXT, details TEXT, image TEXT)');
    });
};

//Insert record into Table.
insertNote = function(firstName, lastName, gender, age, details, image) {
    db.transaction(function(tx){
        tx.executeSql('insert into record1 (firstName, lastName, gender, age, details, image) values(?,?,?,?,?,?)', [firstName.val(), lastName.val(), gender.val(), age.val(), details.val(), image], function(tx, result) {
            console.log(result.insertId);
            alert("record inserted");
        }, function(tx, error) {
            console.log(error);
        });
    });
};


$(function(){
    'use strict';
    var video = document.querySelector('video');
    var canvas;

    function capturePhoto() {
        var img = document.querySelector('img') || document.createElement('img');
        var context;
        var width = video.offsetWidth;
        var height = video.offsetHeight;

        canvas = canvas || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);

        img.src = canvas.toDataURL('image/png');
        document.getElementById("capturedImage").appendChild(img);
    }

    // using MediaDevices API
    // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices) {
        // below line is used to access the web cam
        navigator.mediaDevices.getUserMedia({video: true})
        // if permission is granted then:
            .then(function(stream) {
                video.src = window.URL.createObjectURL(stream);
                document.getElementById("capture").addEventListener('click', capturePhoto);
            })
            // if permission is denied then:
            .catch(function(error) {
                document.body.textContent = 'Cannot access the Video camera of your device';
            });
    }


    $("#save_button").click(function(event){
        event.preventDefault();
        createRecordsTable();
        var firstName = $("#firstname");
        var lastName = $("#lastname");
        var gender = $("#gender");
        var age = $("#age");
        var details = $("#notes");
        var image = $("#capturedImage");
        var imagePath = $("script[src^='/modules/']").context.images[0].currentSrc;

        // var image = localStorage.getItem("testimage");
        // var html = "<img src="+ image +">";
        // var dataImage = localStorage.getItem('testimage');
        // var bannerImg = document.getElementById('recordtable');
        // bannerImg.src = dataImage;
        // document.getElementById("capturedImage1").appendChild(html);
        // $('#capturedImage1').appendChild(html);

        insertNote(firstName, lastName, gender, age, details, imagePath);
        window.location.assign("/HealthCampSPA/HTML/healthVital.html");
    });

});
