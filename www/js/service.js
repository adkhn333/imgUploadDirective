app
.service('AddImage', function($cordovaCamera, $cordovaFile) {
    var Obj = {};
    Obj = {
        options: {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType :   Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions
        },
        uploadImage: function(imageID) {
            $cordovaCamera.getPicture(Obj.options).then(function(imageURI) {
                var image = document.getElementById(imageID);
                image.src = imageURI;
                // $scope.url = imageURI;
                // 4
                onImageSuccess(imageURI);
                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }
                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }
                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    }, fail);
                }
                options.params = {};
                // 6
                function onCopySuccess(entry) {
                    url = 'http://139.162.3.205/api/uploadImage';
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = true;
                    options.fileName = entry.name;
                    options.params.path = "arpit";
                    options.params.size = "100%";
                    var ft = new FileTransfer();
                    ft.upload(entry.nativeURL, url, succesFileTransfer, errorFileTransfer, options);
                    // $scope.$apply(function () {
                    //     $scope.images.push(entry.nativeURL);
                    // });
                }
                function succesFileTransfer(data){
                    // $scope.imurl = (JSON.parse(data.response)).URLs[0].imageUrl;
                    var imurl = (JSON.parse(data.response)).URLs[0].imageUrl;
                    var newPostKey = firebase.database().ref().child('images').push().key;
                    var imageLink = { link: imurl };
                    var updates = {};
                    updates['/images/' + newPostKey] = imageLink;
                    firebase.database().ref().update(updates);
                }
                function errorFileTransfer(data){
                    alert(JSON.stringify(data));
                }
                function fail(error) {
                    console.log("fail: " + error.code);
                }
                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                
                    for (var i=i; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }
            }, function(err) {
                console.log(err);
            });
        }
    };
    return Obj;
})
;