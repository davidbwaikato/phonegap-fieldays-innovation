document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.error("Device is ready!");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    console.error("Filesystem name = " + fileSystem.name);
    console.error("Filesystem root name = " + fileSystem.root.fullPath);

    fileSystem.root.getFile("readme.txt", null, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){
    readDataUrl(file);
    readAsText(file);
}

function readDataUrl(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as data URL");
        console.log(evt.target.result);
    };
    reader.readAsDataURL(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as text");
        alert(evt.target.result);
    };
    reader.readAsText(file);
}

function fail(error) {
    alert(error.code);
}
