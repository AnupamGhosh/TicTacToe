onmessage = function(input) {
    console.log(input);
    postMessage({r: 0, c: 1});
}