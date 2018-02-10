window.onload = function () {
    setupBrowserFS();

    runJVM();
};

function runJVM() {
    new Doppio.VM.JVM({
        // '/sys' is the path to a directory in the BrowserFS file system with:
        // * vendor/java_home/*
        doppioHomePath: '/sys',
        // Add the paths to your class and JAR files in the BrowserFS file system
        classpath: ['.']
    }, function (err, jvmObject) {
        if (err) {
            console.warn(err);
            return;
        }
    });
}

function setupBrowserFS() {
    var mfs = new BrowserFS.FileSystem.MountableFileSystem();
    var fs = BrowserFS.BFSRequire('fs');

    BrowserFS.initialize(mfs);
    // Temporary storage.
    mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
    // 10MB of writable storage
    // Use BrowserFS's IndexedDB file system for more storage.
    mfs.mount('/home', new BrowserFS.FileSystem.LocalStorage());
    // The first argument is the filename of the listings file
    // The second argument is the relative URL to the folder containing the listings file
    // and the data it indexes.
    // In this example, the listings file and DoppioJVM's data is at
    // <thiswebpage>/doppio/listings.json
    mfs.mount('/sys', new BrowserFS.FileSystem.XmlHttpRequest('listings.json', '/node_modules/doppiojvm/dist/dev'));
}
