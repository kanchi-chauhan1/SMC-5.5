(function () {
    function waitUntil(predicate, success, error) {
        var int = setInterval(function () {
            if (predicate()) {
                clearInterval(int);
                int = null;
                success();
            }
        }, 500);

        setTimeout(function () {
            if (int !== null) {
                clearInterval(int);
                if (typeof (error) === 'function') {
                    error();
                }
            }
        }, 15000);
    }

    waitUntil(function () {
        return document.querySelectorAll('header + .container-fluid div:nth-of-type(3) button:nth-of-type(1)').length > 0;
    }, function () {
        document.querySelector('header + .container-fluid div:nth-of-type(3) button:nth-of-type(1)').addEventListener('click'),function () {
            Kameleoon.API.Goals.processConversion(239186);
        }
    });
})