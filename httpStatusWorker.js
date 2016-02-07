importScripts('utils.js');

var maxQueueSize = 20;
var reqQueue = [];
var oReq;

onmessage = function(e) {
    console.log(e.data.cmd);
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
        default:
            // do nothing
    }
}

getStatus = function(addr) {
    oReq = new XMLHttpRequest();
    oReq.timeout = 10000;
    hash = U.hashCode(addr);
    oReq.ontimeout = function() {
        sendUpdate(hash, 'darkgrey');
    }
    oReq.onreadystatechange = function() {
        try {
            if (oReq.readyState === XMLHttpRequest.DONE) {
                switch (oReq.status) {
                    case 200:
                        sendUpdate(hash, 'green');
                        break;
                    case 301:
                        sendUpdate(hash, 'purple');
                        break;
                    default:
                        sendUpdate(hash, 'red');
                }
            } else {
                sendUpdate(hash, 'grey');
            }
        } catch (e) {
            sendUpdate(hash, 'brown');
        }
    }

    try {
        reqQueue[reqQueue.length++] = oReq;
        oReq.open('GET', addr, false);
        oReq.send();
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
