onmessage = function(input) {
    // console.log(input);
    setTimeout(function () {
        postMessage({r: 0, c: 1});
    }, 2000);
}