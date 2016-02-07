var button = U.$('.run.start');
var runstop = U.$('.run.stop');
var result = U.$('.result');
var download = U.$('.download');
var checkStatus = U.$('.checkStatus.start');
var checkStatusStop = U.$('.checkStatus.stop');

var list;

stopWorker = function(worker, btnOn, btnOff, forceStop) {
    btnOn.style.visibility = 'visible';
    btnOff.style.visibility = 'hidden';

    worker.postMessage({
        'cmd': 'stop'
    });
}
errorHandler = function(event) {
    console.log(event);
}

if (window.Worker) {
    var dupWorker = new Worker('duplicateFinderWorker.js');
    var statusWorker = new Worker('httpStatusWorker.js');
    dupWorker.onerror = errorHandler;
    statusWorker.onerror = errorHandler;

    button.onclick = function() {
        stopWorker(statusWorker, checkStatus, checkStatusStop, false);
        checkStatus.style.visibility = 'hidden';
        runstop.style.visibility = 'visible';
        this.style.visibility = 'hidden';
        dupWorker.postMessage({
            'cmd': 'calculate',
            'body': v
        });
    };
    runstop.onclick = function() {
        stopWorker(dupWorker, button, runstop, false);
    };

    checkStatus.onclick = function() {
        checkStatusStop.style.visibility = 'visible';
        this.style.visibility = 'hidden';
        statusWorker.postMessage({
            'cmd': 'checkStatus',
            'body': list
        });
    };
    checkStatusStop.onclick = function() {
        console.log('click');
        statusWorker.postMessage({
            'cmd': 'stop'
        });
        stopWorker(statusWorker, checkStatus, checkStatusStop, false);
    };

    dupWorker.onmessage = function(e) {
        switch (e.data.cmd) {
            case 'result':
                stopWorker(dupWorker, button, runstop, false);
                stopWorker(statusWorker, checkStatus, checkStatusStop,
                    false);

                if (typeof e.data.file != 'undefined') {
                    download.textContent =
                        'Download unique bookmarks as a backup file';
                    href = 'data:text/plain;charset=utf-8,' +
                        encodeURIComponent(e.data.file);
                    download.onclick = function() {
                        this.href = href;
                    }
                }
                if (typeof e.data.list != 'undefined') {
                    list = e.data.list;
                }
                break;
            default:
                // do nothing
        }
        if (typeof e.data.txt !== 'undefined') {
            result.innerHTML = e.data.txt;
        }
    };

    statusWorker.onmessage = function(e) {
        switch (e.data.cmd) {
            case 'update':
                node = e.data.node;
                color = e.data.color;
                U.$('[data-link-id="' + node + '"]').style.backgroundColor =
                    color;
                break;
            case 'result':
                stopWorker(statusWorker, checkStatus, checkStatusStop,
                    false);
                break;
            default:
                // do nothing
        }
    };
}
