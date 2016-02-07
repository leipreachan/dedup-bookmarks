var button = document.querySelector('.run');
var result = document.querySelector('.result');
var download = document.querySelector('.download');
var statusChecker = document.querySelector('.statusChecker');
if (window.Worker) {
    var myW = new Worker('duplicateFinderWorker.js');
    button.onclick = function () {
        button.textContent = 'STOP';
        myW.postMessage({
            'cmd': 'calculate',
            'body': v
        });
    };
    stop.onclick = function () {
        myW.postMessage({
            'cmd': 'stop'
        });
        button.textContent = 'RUN';
    }
    myW.onmessage = function (e) {
        if (typeof e.data !== 'undefined') {
            if (typeof e.data.result != 'undefined') {
                result.innerHTML = e.data.result;
                statusChecker.textContent = 'check HTTP status of bookmarked pages';
            } else {
                result.innerHTML = e.data;
            }
            if (typeof e.data.file != 'undefined') {
                download.textContent = 'Download unique bookmarks as a backup file';
                href = 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(e.data.file);
                download.onclick = function () {
                    this.href = href;
                }
            }
            button.textContent = 'RUN';
        }
    }
}
