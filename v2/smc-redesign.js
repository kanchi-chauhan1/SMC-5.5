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

    (function (win) {
        'use strict';

        var listeners = [],
            doc = win.document,
            MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
            observer;

        function ready(selector, fn) {
            // Store the selector and callback to be monitored
            listeners.push({
                selector: selector,
                fn: fn
            });
            if (!observer) {
                // Watch for changes in the document
                observer = new MutationObserver(check);
                observer.observe(doc.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
            // Check if the element is currently in the DOM
            check();
        }

        function check() {
            // Check the DOM for elements matching a stored selector
            for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
                listener = listeners[i];
                // Query for elements matching the specified selector
                elements = doc.querySelectorAll(listener.selector);
                for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                    element = elements[j];
                    if (!element.ready) {
                        element.ready = [];
                    }
                    // Make sure the callback isn't invoked with the
                    // same listener more than once
                    // due to other mutations
                    if (!element.ready[i]) {
                        element.ready[i] = true;
                        // Invoke the callback with the element
                        listener.fn.call(element, element);
                    }
                }
            }
        }

        // Expose 'ready'
        win.optiReady = ready;

    })(this);

    function miniBasketChanges() {
        if (document.querySelector('.head-count-container')) {
            document.querySelector('.head-count-container').remove();
        }
        var targetNode = document.querySelector('.sticky-inner-wrapper > section > div');
        targetNode.insertAdjacentHTML('beforebegin', '<div class="head-count-container"><p class="custom-basket-heading">Your Trial Box</p> <p class="custom-basket-count">Choose 4 recipes</p></div>');

        var configObject = {
            childList:true,
            characterData: true,
            subtree: true
        };
        var basketObserver = new MutationObserver(function () {
            var basketCounter = document.querySelector('.custom-basket-count');
            var continueButton=document.querySelector('.sticky-inner-wrapper > section > div button');
            var recipeCount = document.querySelectorAll('.sticky-inner-wrapper > section > div > img').length;
            if (recipeCount === 0) {
                basketCounter.textContent = "Choose 4 recipes";
            } else if (recipeCount === 1) {
                basketCounter.textContent = "Add 3 more recipes";
            } else if (recipeCount === 2) {
                basketCounter.textContent = "Add 2 more recipes";
            }  else if (recipeCount === 3) {
                basketCounter.textContent = "Add 1 more recipe";
            } else {
                basketCounter.textContent = "You're all set!";
                continueButton.classList.add('custom-continue-button');
                console.log('working');
                continueButton.click();
            }
        });
        basketObserver.observe(targetNode, configObject);
    }

    function filterLinkFunctionality() {
        var filterLinkHTML = '<div class="custom-recipe-filter-link-container"><button class="custom-recipe-filter-link">Got allergies or dietary requirements?</button></div>';
            document.querySelector('.sticky-outer-wrapper').insertAdjacentHTML('afterend', filterLinkHTML);
            document.querySelector('.custom-recipe-filter-link').addEventListener('click', function () { 
            document.querySelector('header + .container-fluid div:nth-of-type(3) > button:nth-of-type(1)').click();         
        });
    }
    function filterLinkChanges() {
        if (document.querySelector('.custom-recipe-filter-link-container')) {
            document.querySelector('.custom-recipe-filter-link-container').remove();
        }
        if (document.querySelector('header + .container-fluid div:nth-of-type(3) > button:nth-of-type(1)')) {
            filterLinkFunctionality();
        } else {
            waitUntil( function () {
                return document.querySelector('header + .container-fluid div:nth-of-type(3) > button:nth-of-type(1)');
            }, function () {
                console.log('working');
                if (document.querySelector('header + .container-fluid div:nth-of-type(3) > button:nth-of-type(1)')) {
                    console.log('inside if');
                    filterLinkFunctionality();
                }
            });
        }
    }
    
    function filterToggleList(ul) {
        if (document.querySelector('.MuiPaper-root').innerHTML.toLowerCase().indexOf('>spiciness<') > -1) {
            ul.querySelectorAll('li').forEach(function (li) {
                var text = li.innerText.toLowerCase().trim();
                if (text.indexOf('spiciness') < 0  && text.indexOf('dietary requirements')  < 0 && text.indexOf('allergens') < 0) {
                    li.classList.add('custom-filter-li-hide');
                } else {
                    li.classList.remove('custom-filter-li-hide');
                }
            });
        }
    }

    function filterMenuChanges(ul) {
        var filterObserver = new MutationObserver(function () {
            filterToggleList(ul);
        });
        filterObserver.observe(ul, {
            childList: true
        });
        filterToggleList(ul);
    }

    function veganLabel(label) {
        document.querySelectorAll('.card-body div .card-text').forEach(function (label) {
           if (label.textContent.trim().toLowerCase() === "vegan" || label.textContent.trim().toLowerCase() === "vegetarian") {
               label.classList.add("custom-veg-label");
           }
        });
    }
    
    function ctaTextChange(ctaWrapper) {
        var count = ctaWrapper.querySelector('p');
        var btn = ctaWrapper.querySelector('.btn.disabled:first-child');
            waitUntil(function () {
                return [].filter.call(document.querySelectorAll('.card-body > div:last-child p'), function (para) {
                    return para.innerText.toLowerCase().indexOf('adding') >= 0;
                }).length === 0;
            }, function () {
                if (btn && btn.innerText !== "" && btn.innerText !== "Add"){
                    console.log('add1 ', btn.innerText);
                    btn.innerText = "Add";
                }
            });
        if (count) {
            count.textContent = count.textContent.replace(/\D/g, "");
        } else {
            waitUntil(function () {
                return ctaWrapper.querySelector('p');
            }, function () {
                var count = ctaWrapper.querySelector('p');
                if (count) {
                    count.textContent = count.textContent.replace(/\D/g, "");
                }
            });
        }
    }

    function recipeCtaChanges() {
    document.querySelectorAll('.card-body > div:last-child').forEach(function (cta) {
        var ctaObject = {
            attributes: true,
            subtree: true,
        };
        var CtaObserver = new MutationObserver(function () {
            ctaTextChange(cta);
        });
        CtaObserver.observe(cta, ctaObject);
        ctaTextChange(cta);
    });
    }

    function addCartHeading() {
        var targetnode=document.querySelector('.MuiPaper-root>div>span');
        targetnode.innerText="Your trial box";
        document.querySelector('.MuiDrawer-root div:nth-of-type(3) div:nth-of-type(2) div:nth-of-type(5) div:nth-of-type(1) p:nth-of-type(1)').innerText="Trial box";
    }
    
    function init() {
        miniBasketChanges();
        filterLinkChanges();
    }
    window.addEventListener('load', function () {
        [].forEach.call(document.querySelectorAll('.card'), function(e) {
            e.addEventListener('click', function() {
                Kameleoon.API.Goals.processConversion(239188)
            });
       });
       [].forEach.call(document.querySelectorAll('[data-testid="Add recipe"]'), function(e) {
            e.addEventListener('click', function() {
                Kameleoon.API.Goals.processConversion(239191)
        });
   });
    })
    window.optiReady('.MuiDrawer-root', function () {
        addCartHeading();
    });
    window.optiReady('.MuiPaper-root div ul', function (ele) {
        filterMenuChanges(ele);
    });
    window.optiReady('.container-fluid > section:nth-of-type(1) .card:first-child .card-body', function () {
        recipeCtaChanges();
        veganLabel();
    });
    window.optiReady('.container-fluid > .sticky-outer-wrapper', function () {
        init();    
    });
}());
