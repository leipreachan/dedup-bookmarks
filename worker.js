var lAddr = {
};
log = function (txt) {
    //     console.log(txt);
    postMessage(txt);
}
onmessage = function (e) {
    switch (e.data.cmd) {
        case 'calculate':
            calculateDuplicates(e.data.body);
            break;
        case 'stop':
            log('Stopped from inside');
            close();
            break
    }
}
calculateDuplicates = function (root)
{
    lAddr = {
    };
    log('Started ...');
    uniq = getDuplicateCount(root);
    log('Done!');
    result = '';
    count = 0;
    dup = 0;
    result += '<table>';
    for (var i in lAddr) {
        result += '<tr><td>' + lAddr[i] + '</td><td class="addr"><a href="' + i + '" target="blank">' + i + '</a></td></tr>';
        if (lAddr[i] > 1) {
            dup += lAddr[i];
        }
        count++;
    }
    result += '</table>'
    result += 'Total: ' + count + ' unique bookmarks and ' + dup + ' duplicates<br>';
    postMessage({
        'result': result,
        'file': JSON.stringify(uniq)
    });
}
getDuplicateCount = function (node)
{
    var copy = JSON.parse(JSON.stringify(node));
    if (node != null) {
        if (typeof node.children !== 'undefined') {
            copy.children = [
            ];
            node.children.forEach(function (item, i) {
                result = getDuplicateCount(item);
                if (result !== false) {
                    copy.children[i] = result;
                }
            })
        }
        if (typeof node.uri !== 'undefined')
        {
            if (typeof lAddr[node.uri] == 'undefined') {
                lAddr[node.uri] = 0;
            }
            lAddr[node.uri]++;
            return (lAddr[node.uri] > 1) ? false : node;
        }
    }
    return copy;
}
