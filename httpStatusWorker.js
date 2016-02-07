importScripts('utils.js');

var maxQueueSize = 20;
var reqQueue = [];

onmessage = function(e) {
    switch (e.data.cmd) {
        case 'stop':
            reqQueue.forEach(function(item) {
                // sendUpdate(U.hashCode(item.))
                item.abort();
            });
            break;
        case 'close':
            reqQueue.forEach(function(item) {
                // sendUpdate(U.hashCode(item.))
                item.abort();
            });
            close();
            break;
        case 'checkStatus':
            main(e.data.body);
            break;
    }
}

getStatus = function(addr) {
    hash = U.hashCode(addr);
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
            sendUpdate(hash, 'darkgrey');
        }
        //cross-domain XHR, duh
        // add php-grabber with curl
    xhr.onreadystatechange = function() {
        console.log(addr + ' readyState ' + this.readyState);
        if (this.readyState === XMLHttpRequest.DONE) {
            console.log(addr + ' status ' + this.status);
            switch (this.status) {
                case 200:
                    console.log(addr + ' ' + 200);
                    sendUpdate(hash, 'green');
                    break;
                case 302:
                    console.log(addr + ' ' + 302);
                    sendUpdate(hash, 'purple');
                    break;
            }
        } else {
            sendUpdate(hash, 'grey');
        }
    }

    try {
        reqQueue[reqQueue.length++] = xhr;
        xhr.open('GET', addr, false);
        xhr.send();
    } catch (e) {
        sendUpdate(hash, 'brown');
    }
}

main = function(lAddr) {
    for (var i in lAddr) {
        if (reqQueue.length > 10) return;
        getStatus(i);
    }
    postMessage({
        'cmd': 'result'
    })
}

sendUpdate = function(hash, color) {
    postMessage({
        'cmd': 'update',
        'node': hash,
        'color': color
    })
}
