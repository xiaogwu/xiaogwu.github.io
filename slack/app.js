'use strict';

var App = (function() {
    var coordinates = {};
    var images;
    var imageIds;

    var ready = function(fn) {
        if ( typeof fn !== 'function' ) return;

        // Feature detection
        var supports = !!document.querySelector && !!window.addEventListener;
        if ( !supports ) return;

        if ( document.readyState === 'complete' ) {
            return fn();
        }

        document.addEventListener('DOMContentLoaded', fn, false);
    };

    var geoLocation = function(callback0) {

        if ( !navigator.geolocation ) {
            alert('Geolocation is not supported in your browser');
            return;
        }

        var options = {
            enableHighAccuracy: false,
            timeout: Infinity,
            maximumAge: 60000
        };

        var success = function(position) {
            coordinates.lat = position.coords.latitude;
            coordinates.long = position.coords.longitude;
            var coordinatesElement = document.querySelector('#coordinates');
            coordinatesElement.textContent = 'longitude: ' + coordinates.long.toFixed(4) + '  latitude: ' + coordinates.lat.toFixed(4);
            if ( typeof callback0 === 'function' ) {
                callback0();
            }
        };

        var error = function(err) {
            switch(err.code) {
            case err.PERMISSION_DENIED:
                console.log(err.message);
                break;
            case err.POSITION_UNAVAILABLE:
                console.log(err.message);
                break;
            case err.TIMEOUT:
                console.log(err.message);
                break;
            default:
                console.log('Unknown geolocation error has occurred');
            }
        };

        navigator.geolocation.watchPosition(success, error, options);
    };

    var instagramClientSideAuthenticate = function() {
        window.location.href =
            'https://instagram.com/oauth/authorize/?' +
            'client_id=5711d67def8e44f2b00de392ed6d3597' +
            '&redirect_uri=http://xiaogwu.com/slack/' +
            '&response_type=token';
    };

    var storeAccessToken = function(hash0) {
       var hash = hash0.substring(hash0.indexOf('=') + 1);

       if ( sessionStorage.getItem('access_token') === hash ) {
           return;
       }

       sessionStorage.setItem('access_token', hash);

    };

    var displayImages = function(response0) {
        var container = document.querySelector('#container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        if ( response0.meta.code === 200 ) {
            var data = response0.data;
            imageIds = data.map(function(obj0) {
                return obj0.id;
            });

            data.forEach(function(obj0) {
                var anchorElement = document.createElement('a');
                if ( obj0.caption ) {
                    anchorElement.title = obj0.caption.text || null;
                }
                anchorElement.href = obj0.images.standard_resolution.url;
                anchorElement.target = '_blank';
                var imgElem = document.createElement('img');
                imgElem.src = obj0.images.thumbnail.url;
                imgElem.dataset.id = obj0.id;
                anchorElement.appendChild(imgElem);
                container.appendChild(anchorElement);
            });

            images = data;
        }
    };

    var getImagesService = function() {
        // Get Images using JSONP
        var getImagesService = document.createElement('script');
        var accessToken = sessionStorage.getItem('access_token');

        if ( accessToken === null ) {
            return;
        }

        var url =
            'https://api.instagram.com/v1/media/search?' +
            'lat=' + coordinates.lat +
            '&lng=' + coordinates.long +
            '&access_token=' + accessToken +
            '&callback=App.displayImages';

        getImagesService.setAttribute('src', url);
        document.body.appendChild(getImagesService);
    };

    var center = function() {

        var modalImageContainer = document.querySelector('#modal-image-container');

        if ( modalImageContainer === undefined ) {
            return;
        }

        if ( modalImageContainer ) {
            var top = Math.max(window.innerHeight - modalImageContainer.offsetHeight, 0) / 2;
            modalImageContainer.style.top = (top === 0) ? '0' : top + 'px';
        }
    };

    var refreshLightbox = function(event) {
        event.preventDefault();

        var modalImageContainer = document.querySelector('#modal-image-container');
        var prevElement = document.querySelector('#prev');
        var nextElement = document.querySelector('#next');
        var closeElement = document.querySelector('#close');

        // Remove previous modal image element if it exists in DOM
        if ( document.querySelector('#modal-image') ) {
            var modalImageElement = document.querySelector('#modal-image');
            modalImageElement.parentNode.removeChild(modalImageElement);
        }

        // Remove previous modal title element if it exist in DOM
        if ( document.querySelector('#title') ) {
            var modalImageTitleElement = document.querySelector('#title');
            modalImageTitleElement.parentNode.removeChild(modalImageTitleElement);
        }
        // Use event dataset id (i.e. image id) to determine index of image from images array
        var index = imageIds.indexOf(event.target.dataset.id);

        // Darken background
        var modalOuter = document.querySelector('#modal-outer');
        modalOuter.className = 'modal-open';

        // Prevent background scrolling
        var bodyElement = document.querySelector('body');
        bodyElement.className = 'modal-open';

        // Create title if there is a caption
        if ( images[index].caption ) {
            var modalImageTitleElement = document.createElement('div');
            modalImageTitleElement.textContent = images[index].caption.text;
            modalImageTitleElement.id = 'title';
            if ( modalImageTitleElement.textContent.length > 18 ) {
                modalImageTitleElement.setAttribute('title', modalImageTitleElement.textContent);
            }
            // Insert Title Element into DOM first
            var firstChildElement = modalImageContainer.firstChild;
            modalImageContainer.insertBefore(modalImageTitleElement, firstChildElement);
        }

        // Create image
        var modalImageElement = document.createElement('img');
        modalImageElement.src = images[index].images.standard_resolution.url;
        modalImageElement.id = 'modal-image';
        // Insert Modal Image into DOM second
        var firstChildElement = modalImageContainer.firstChild;
        modalImageContainer.insertBefore(modalImageElement, firstChildElement);

        // Add Event Event Listener for Image to load to determine height
        modalImageElement.addEventListener('load', center);

        // Add Prev/Next chevrons
        prevElement.className = 'arrow arrow--left';
        nextElement.className = 'arrow arrow--right';
        closeElement.className = 'close';

        // Apply Polaroid border styling
        modalImageElement.className = 'modal-image-border';

        // Calculate previous and next button indexes to provide an "infinite loop" carousel
        var prevIndex = (index - 1) < 0 ? images.length - 1 : index - 1;
        prevElement.dataset.id = images[prevIndex].id;
        var nextIndex = (index + 1) === images.length ? 0 : index + 1;
        nextElement.dataset.id = images[nextIndex].id;
    };

    var closeLightbox = function() {
        var modalImageContainer = document.querySelector('#modal-image-container');
        var modalImageElement = document.querySelector('#modal-image');
        var prevElement = document.querySelector('#prev');
        var nextElement = document.querySelector('#next');
        var closeElement = document.querySelector('#close');
        var modalOuter = document.querySelector('#modal-outer');
        var bodyElement = document.querySelector('body');

        if ( document.querySelector('#title') ) {
            var modalImageTitleElement = document.querySelector('#title');
            modalImageTitleElement.parentNode.removeChild(modalImageTitleElement);
        }

        modalImageElement.parentNode.removeChild(modalImageElement);

        modalImageContainer.className = '';
        prevElement.className = '';
        nextElement.className = '';
        closeElement.className = '';

        // Un-darken background
        modalOuter.className = '';

        // Re-enable background scrolling
        bodyElement.className = '';
    };

    var addListeners = function() {
        // Authentication Button
        var authenticateButton = document.querySelector('#authenticate-button');
        if ( authenticateButton ) {
            authenticateButton.addEventListener('click', instagramClientSideAuthenticate);
        }

        // Image container
        var imagesContainer = document.querySelector('#container');
        if ( imagesContainer ) {
            imagesContainer.addEventListener('click', refreshLightbox);
        }

        // Resize window re-center modal image
        window.addEventListener('resize', center);

        // Controls
        var prevElement = document.querySelector('#prev');
        if ( prevElement ) {
            prevElement.addEventListener('click', refreshLightbox);
        }
        var nextElement = document.querySelector('#next');
        if ( nextElement ) {
            nextElement.addEventListener('click', refreshLightbox);
        }
        var closeElement = document.querySelector('#close');
        if ( closeElement ) {
            closeElement.addEventListener('click', closeLightbox);
        }
    };

    var isTouchDevice = function() {
        var el = document.createElement('div');
        el.setAttribute('ongesturestart', 'return;');
        return ( typeof el.ongesturestart == 'function' ) ? true : false
    };

    var loadCSS = function(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
        return link;
    };

    var run = function() {
        // Detect if we do not a touch device then load hover styling
        if ( !isTouchDevice() ) {
            loadCSS('css/hovers.css');
        }

        // Handle authentication redirect
        if (window.location.hash) {
            // Remove Authenticate button after successful authentication
            var authenticateButton = document.querySelector('#authenticate-button');
            authenticateButton.parentNode.removeChild(authenticateButton);

            // Refresh Access Token
            storeAccessToken(window.location.hash);
            geoLocation(getImagesService);
            addListeners();

            // Cleanup URL and remove access token
            var url = window.location.toString();
            var cleanUrl = url.substring(0, url.indexOf('#'));
            window.history.replaceState({}, document.title, cleanUrl);

        } else {
            if ( sessionStorage.getItem('access_token') ) {
                // Remove Authenticate button after successful authentication
                var authenticateButton = document.querySelector('#authenticate-button');
                authenticateButton.parentNode.removeChild(authenticateButton);
                geoLocation(getImagesService);
            }
            geoLocation();
            addListeners();
        }
    };

    ready(run);

    // Public API
    return {
        displayImages: displayImages
    };

})();
