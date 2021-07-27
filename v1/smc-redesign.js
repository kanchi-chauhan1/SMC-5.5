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
        targetNode.insertAdjacentHTML('beforebegin', '<div class="head-count-container"><p class="custom-basket-heading">Your trial box</p> <p class="custom-basket-count">Choose 4 recipes</p></div>');
        var configObject = {
            childList:true,
            characterData: true,
            subtree: true
        };
        var basketObserver = new MutationObserver(function () {
            var basketCounter = document.querySelector('.custom-basket-count');
            var continueButton=document.querySelector('.custom-continue-link');
            var recipeCount = document.querySelectorAll('.sticky-inner-wrapper > section > div > img').length;
            if (recipeCount === 0) {
                basketCounter.textContent = "Choose 4 recipes";
                continueButton.classList.remove("custom-continue-button");
            } else if (recipeCount === 1) {
                basketCounter.textContent = "Add 3 more recipes";
                continueButton.classList.remove("custom-continue-button");
            } else if (recipeCount === 2) {
                basketCounter.textContent = "Add 2 more recipes";
                continueButton.classList.remove("custom-continue-button");
            }  else if (recipeCount === 3) {
                basketCounter.textContent = "Add 1 more recipe";
                continueButton.classList.remove("custom-continue-button");
            } else {
                basketCounter.textContent = "You're all set!";
                continueButton.classList.add("custom-continue-button");
            }
        });   
        basketObserver.observe(targetNode, configObject);  
    }

    function continueLink() {
        if (document.querySelector('.custom-continue-link')) {
            document.querySelector('.custom-continue-link').remove();
        }
        var targetNode = document.querySelector('.sticky-inner-wrapper > section > div:nth-of-type(2) > p');
        targetNode.insertAdjacentHTML('beforebegin','<a href="https://www.simplycook.com/recipes/checkout-multi-step/summary" class="custom-continue-link">Continue</a>');
        document.querySelector('.custom-continue-link').addEventListener('click', function (event) {
            event.stopImmediatePropagation();
        });
        document.querySelector('.sticky-inner-wrapper > section > div:nth-of-type(2)').addEventListener('click', function (event) {
            event.stopImmediatePropagation();
        });
    }

    function filterLinkChanges() {
        if (document.querySelector('.custom-recipe-filter-link-container')) {
            document.querySelector('.custom-recipe-filter-link-container').remove();
        }
        var filterLinkHTML = '<div class="custom-recipe-filter-link-container"><button class="custom-recipe-filter-link">Got allergies or dietary requirements?</button></div>';
        document.querySelector('.sticky-outer-wrapper').insertAdjacentHTML('afterend', filterLinkHTML);
        document.querySelector('.custom-recipe-filter-link').addEventListener('click', function () { 
            document.querySelector('header + .container-fluid div:nth-of-type(3) button:nth-of-type(1)').click(); 
        });
    }

    function filterToggleList(ul) {
        console.log('working');
        if (document.querySelector('.MuiPaper-root').innerHTML.toLowerCase().indexOf('>spiciness<') > -1) {
            ul.querySelectorAll('li').forEach(function (li) {
                var text = li.innerText.toLowerCase().trim();
                if (text !== 'spiciness' && text !== 'dietary requirements' && text !== 'allergens') {
                    li.classList.add('custom-filter-li-hide');
                } else {
                    li.classList.remove('custom-filter-li-hide');
                }
            });
        }
    }

    function filterMenuChanges(ul) {
        console.log('asdf');
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

    function ctaTextChange(cta) {
            var count = cta.querySelector('p');
            if (count) {
                count.textContent = count.textContent.replace(/\D/g, "");
            }
        }

    function recipeCtaChanges(cta) {
        document.querySelectorAll('.card-body > div:last-child').forEach(function (cta) {
            var ctaObject = {
                attributes: true,
                subtree: true
            };
            var CtaObserver = new MutationObserver(function () {
                ctaTextChange(cta);
            });
            CtaObserver.observe(cta, ctaObject);
            ctaTextChange(cta);
        });
    }

    function removePopup(){
        if (document.querySelector('.MuiPaper-root>div>span') && document.querySelector('.MuiPaper-root>div>span').innerText === "Your first box") {
            document.body.classList.remove("custom-popup-show");
            console.log('remove show');
        }
        else {
            document.body.classList.add("custom-popup-show");
            console.log('add show');
        }
    }
    
    function init() {
        miniBasketChanges();
        continueLink();
        filterLinkChanges();
    }

    waitUntil(function () {
        return document.querySelectorAll('.card-body > div:last-child').length > 0 && document.querySelectorAll('.card-body > div .card-text').length>0;
    }, function () {
        init();
    });
    window.optiReady('.MuiDrawer-root', function () {
        removePopup();
    });
    window.optiReady('.MuiPaper-root div ul', function (ele) {
        filterMenuChanges(ele);
    });
    window.optiReady('header + .container-fluid > section:nth-of-type(1) .card:first-child .card-body', function () {
        recipeCtaChanges();
        veganLabel();
    });
}());
