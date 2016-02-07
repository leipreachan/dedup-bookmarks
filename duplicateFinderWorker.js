var lAddr = {};
importScripts('utils.js');
log = function(txt) {
    //     console.log(txt);
    postMessage({
        'cmd': 'log',
        'txt': txt
    });
}
onmessage = function(e) {
    try {
        switch (e.data.cmd) {
            case 'close':
                close();
                break;
            case 'stop':
                break;
            case 'calculate':
                main(e.data.body);
                break;
            default:
                // do nothing
        }
    } catch (e) {}
}
main = function(root) {
    lAddr = {};
    log('Started ...');
    uniq = getDuplicateCount(root);
    log('Done!');
    result = '';
    count = 0;
    dup = 0;
    result += '<table>';
    for (var i in lAddr) {
        result += '<tr><td data-link-id="' +
            U.hashCode(i) + '">' + lAddr[i] +
            '</td><td class="addr"><a href="' +
            i +
            '" target="blank">' + i + '</a></td></tr>';
        if (lAddr[i] > 1) {
            dup += lAddr[i];
        }
        count++;
    }
    result += '</table>'
    result += 'Total: ' + count + ' unique bookmarks and ' + dup +
        ' duplicates<br>';
    postMessage({
        'cmd': 'result',
        'txt': result,
        'file': JSON.stringify(uniq),
        'list': lAddr
    });
}
getDuplicateCount = function(node) {
    var copy = JSON.parse(JSON.stringify(node));
    if (node != null) {
        if (typeof node.children !== 'undefined') {
            copy.children = [];
            node.children.forEach(function(item, i) {
                result = getDuplicateCount(item);
                if (result !== false) {
                    copy.children[i] = result;
                }
            })
        }
        if (typeof node.uri !== 'undefined') {
            if (typeof lAddr[node.uri] == 'undefined') {
                lAddr[node.uri] = 0;
            }
            lAddr[node.uri]++;
            return (lAddr[node.uri] > 1) ? false : node;
        }
    }
    return copy;
}
