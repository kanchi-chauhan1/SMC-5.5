(function () {

    function miniBasketChanges() {
        var targetNode = document.querySelector('.sticky-inner-wrapper > section > div');
        targetNode.insertAdjacentHTML('beforebegin', '<h2 class="custom-basket-heading">Your Trial Box</h2>');
        targetNode.insertAdjacentHTML('afterend', '<p class="custom-basket-count">Choose 4 recipes</p>');

        var configObject = {
            childList:true,
            characterData: true,
            subtree: true
        };
        var basketObserver = new MutationObserver(function () {
            var basketCounter = document.querySelector('.custom-basket-count');
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
            }
        });   
        basketObserver.observe(targetNode, configObject);  
    }

    function filterLinkChanges() {
        var filterLinkHTML = '<button class="custom-recipe-filter-link">asdf</button>';
        document.querySelector('.sticky-outer-wrapper').insertAdjacentHTML('afterend', filterLinkHTML);
        document.querySelector('.custom-recipe-filter-link').addEventListener('click', function () {
            document.querySelector('header + .container-fluid>div:nth-of-type(2) button').click();
        });
    }

    function veganLabel() {
        document.querySelectorAll('.card-body div .card-text').forEach(function (label) {
           if (label.textContent.trim().toLowerCase() === "vegan" || label.textContent.trim().toLowerCase() === "vegetarian") {
               label.classList.add("custom-veg-label");
           } 
        });
    }

    function recipeCtaChanges() {
        document.querySelectorAll('.card-body > div:last-child').forEach(function (cta) {
            var ctaObject = {
                attributes: true,
                subtree: true,
                childList: true
            };
            var CtaObserver = new MutationObserver(function () {
                var count = cta.querySelector('p');
                if (count) {
                    count.textContent = count.textContent.replace(/\D/g, "");
                }
            });
            CtaObserver.observe(cta, ctaObject);
        });
    }
    function init() {
        miniBasketChanges();
        filterLinkChanges();
        veganLabel();
        recipeCtaChanges();
    }
    init();
}());
