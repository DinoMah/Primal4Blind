(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.promise = require('./src/promise.js');
var talkify = require('./src/talkify.js');
var talkifyConfig = require('./src/talkify-config.js');
var talkifyUtils = require('./src/talkify-utils.js');
var talkifyMessageHub = require('./src/talkify-messagehub.js');
var talkifyHttp = require('./src/talkify-ajax.js');
var TalkifyTextextractor = require('./src/talkify-textextractor.js');
var TalkifyWordHighlighter = require('./src/talkify-word-highlighter.js');
var BasePlayer = require('./src/talkify-player-core.js');
var Html5Player = require('./src/talkify-html5-speechsynthesis-player.js');
var TtsPlayer = require('./src/talkify-player.js');
var talkifyPlaylist = require('./src/talkify-playlist.js');
var talkifyPlaybar = require('./src/talkify-controlcenter.js');
var talkifyKeyCommands = require('./src/talkify-keyboard-commands.js');
var talkifyVoiceCommands = require('./src/talkify-speech-recognition.js');
var talkifyFormReader = require('./src/talkify-formreader.js');

},{"./src/promise.js":2,"./src/talkify-ajax.js":3,"./src/talkify-config.js":4,"./src/talkify-controlcenter.js":5,"./src/talkify-formreader.js":6,"./src/talkify-html5-speechsynthesis-player.js":7,"./src/talkify-keyboard-commands.js":8,"./src/talkify-messagehub.js":9,"./src/talkify-player-core.js":10,"./src/talkify-player.js":11,"./src/talkify-playlist.js":12,"./src/talkify-speech-recognition.js":13,"./src/talkify-textextractor.js":14,"./src/talkify-utils.js":15,"./src/talkify-word-highlighter.js":16,"./src/talkify.js":17}],2:[function(require,module,exports){
/*
 *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
 *  Licensed under the New BSD License.
 *  https://github.com/stackp/promisejs
 */
(function(a){function b(){this._callbacks=[];}b.prototype.then=function(a,c){var d;if(this._isdone)d=a.apply(c,this.result);else{d=new b();this._callbacks.push(function(){var b=a.apply(c,arguments);if(b&&typeof b.then==='function')b.then(d.done,d);});}return d;};b.prototype.done=function(){this.result=arguments;this._isdone=true;for(var a=0;a<this._callbacks.length;a++)this._callbacks[a].apply(null,arguments);this._callbacks=[];};function c(a){var c=new b();var d=[];if(!a||!a.length){c.done(d);return c;}var e=0;var f=a.length;function g(a){return function(){e+=1;d[a]=Array.prototype.slice.call(arguments);if(e===f)c.done(d);};}for(var h=0;h<f;h++)a[h].then(g(h));return c;}function d(a,c){var e=new b();if(a.length===0)e.done.apply(e,c);else a[0].apply(null,c).then(function(){a.splice(0,1);d(a,arguments).then(function(){e.done.apply(e,arguments);});});return e;}function e(a){var b="";if(typeof a==="string")b=a;else{var c=encodeURIComponent;var d=[];for(var e in a)if(a.hasOwnProperty(e))d.push(c(e)+'='+c(a[e]));b=d.join('&');}return b;}function f(){var a;if(window.XMLHttpRequest)a=new XMLHttpRequest();else if(window.ActiveXObject)try{a=new ActiveXObject("Msxml2.XMLHTTP");}catch(b){a=new ActiveXObject("Microsoft.XMLHTTP");}return a;}function g(a,c,d,g){var h=new b();var j,k;d=d||{};g=g||{};try{j=f();}catch(l){h.done(i.ENOXHR,"");return h;}k=e(d);if(a==='GET'&&k){c+='?'+k;k=null;}j.open(a,c);var m='application/x-www-form-urlencoded';for(var n in g)if(g.hasOwnProperty(n))if(n.toLowerCase()==='content-type')m=g[n];else j.setRequestHeader(n,g[n]);j.setRequestHeader('Content-type',m);function o(){j.abort();h.done(i.ETIMEOUT,"",j);}var p=i.ajaxTimeout;if(p)var q=setTimeout(o,p);j.onreadystatechange=function(){if(p)clearTimeout(q);if(j.readyState===4){var a=(!j.status||(j.status<200||j.status>=300)&&j.status!==304);h.done(a,j.responseText,j);}};j.send(k);return h;}function h(a){return function(b,c,d){return g(a,b,c,d);};}var i={Promise:b,join:c,chain:d,ajax:g,get:h('GET'),post:h('POST'),put:h('PUT'),del:h('DELETE'),ENOXHR:1,ETIMEOUT:2,ajaxTimeout:0};if(typeof define==='function'&&define.amd)define(function(){return i;});else a.promise=i;})(this);
},{}],3:[function(require,module,exports){
talkify = talkify || {};
talkify.http = (function ajax() {

    var get = function(url) {
        var call = new promise.promise.Promise();

        var keypart = (url.indexOf('?') !== -1 ? "&key=" : "?key=") + talkify.config.remoteService.apiKey;

        promise.promise
            .get(window.talkify.config.remoteService.host + url + keypart)
            .then(function(error, data) {
                try {
                    var jsonObj = JSON.parse(data);
                    call.done(error, jsonObj);
                } catch (e) {
                    call.done(e, data);
                }

            });

        return call;
    };

    return {
        get: get
    };
})();
},{}],4:[function(require,module,exports){
talkify = talkify || {};
talkify.config = {
    debug: false,
    ui:
    {
        audioControls: {
            enabled: false,
            container: document.body
        }
    },
    formReader: {
        voice: null,
        rate: 0,
        remoteService: true,
        requiredText: "This field is required",
        valueText: "You have entered {value} as: {label}.",
        selectedText: "You have selected {label}.",
        notSelectedText: "{label} is not selected."
    },
    remoteService: {
        active: true,
        host: 'https://talkify.net',
        apiKey: '',
        speechBaseUrl: '/api/speech/v1',
        languageBaseUrl: '/api/language/v1'
    },
    keyboardCommands: {
        enabled: false,
        commands: {
            playPause: 32,
            next: 39,
            previous: 37
        }
    },
    voiceCommands: {
        enabled: false,
        keyboardActivation: {
            enabled: true,
            key: 77
        },
        commands: {
            playPause: ["play", "pause", "stop", "start"],
            next: ["play next", "next"],
            previous: ["play previous", "previous", "back", "go back"]
        }
    }
}
},{}],5:[function(require,module,exports){
talkify = talkify || {};
talkify.playbar = function (parent, correlationId) {
    var settings = {
        parentElement: parent || talkify.config.ui.audioControls.container || document.body
    }

    var playElement, pauseElement, rateElement, volumeElement, progressElement, voiceElement, currentTimeElement, textHighlightingElement, wrapper;
    var attachElement, detatchedElement, dragArea, loader;

    function hide(element) {
        if (element.classList.contains("talkify-hidden")) {
            return;
        }

        element.className += " talkify-hidden";
    }

    function show(element) {
        element.className = element.className.replace("talkify-hidden", "");
    }

    function play() {
        hide(loader);
        hide(playElement);
        show(pauseElement);
    }

    function pause() {
        hide(loader);
        hide(pauseElement);
        show(playElement);
    }

    function addClass(element, c) {
        if (element.classList.contains(c)) {
            return;
        }

        element.className += (" " + c);
    }

    function removeClass(element, c) {
        element.className = element.className.replace(c, "");
    }

    function createElement(type, classes) {
        var element = document.createElement(type);

        element.className = classes;

        return element;
    }

    function render() {
        var existingControl = document.getElementsByClassName("talkify-control-center")[0];
        if (existingControl) {
            existingControl.parentNode.removeChild(existingControl);
        }

        wrapper = createElement("div", "talkify-control-center attached");

        wrapper.innerHTML =
            ' <ul> ' +
            '<li class="drag-area"> ' +
            ' <i class="fa fa-grip-horizontal"></i> ' +
            ' </li> ' +
            ' <li> ' +
            ' <button class="talkify-play-button talkify-disabled" title="Play"> ' +
                ' <i class="fa fa-play"></i> ' +
            ' </button> ' +
            ' <button class="talkify-pause-button talkify-disabled" title="Pause"> ' +
                ' <i class="fa fa-pause"></i> ' +
            ' </button> ' +
            ' <i class="fa fa-circle-notch fa-spin audio-loading"></i>' +
            ' </li> ' +
            ' <li class="progress-wrapper"> ' +
            ' <progress value="0.0" max="1.0"></progress> ' +
            '<span class="talkify-time-element"> 00:00 / 00:00 </span>' +
            ' </li> ' +
            ' <li> ' +
            ' <button class="volume-button" title="Volume"> ' +
            ' <i class="fa fa-volume-up"></i> ' +
            ' <div class="volume-slider"> ' +
            ' <input type="range" value="10" min="0" max="10" title="Adjust playback volume"> ' +
            ' </div> ' +
            ' </button></li> ' +
            '<li> ' +
            '<button class="rate-button" title="Rate of speech"> ' +
            '<i class="fa fa-tachometer-alt"></i> ' +
            ' <div class="rate-slider"> ' +
            '<input type="range" value="10" min="0" max="10" title="Adjust playback rate"> ' +
            '</div> ' +
            ' </button> ' +
            ' </li> ' +
            ' <li> ' +
            ' <button class="talkify-cc-button" title="Enable/disable text highlighting"> ' +
            '<i class="fa fa-closed-captioning"></i> ' +
            '      </button> ' +
            ' </li> ' +
            // ' <li> ' +
            // ' <button title="Download"> ' +
            // '<i class="fa fa-download"></i> ' +
            // ' </button> ' +
            // ' </li> ' +
            ' <li> ' +
            ' <button class="talkify-detatched" title="Dock player to screen"> ' +
            ' <i class="fa fa-window-minimize"></i> ' +
            ' </button> ' +
            ' <button class="talkify-attached" title="Detach player"> ' +
            '<i class="fa fa-window-maximize"></i> ' +
            '</button> ' +
            '</ul> ' +
            ' <div class="talkify-voice-selector"> ' +
            // '<div class="talkify-voice-indicators"></div><div class="talkify-voice-indicators"></div><div class="talkify-voice-indicators"></div>' +
            ' Voice: <span></span>' +
            '</div>';

        playElement = wrapper.getElementsByClassName("talkify-play-button")[0];
        pauseElement = wrapper.getElementsByClassName("talkify-pause-button")[0];
        loader = wrapper.getElementsByClassName("audio-loading")[0];
        rateElement = wrapper.querySelector(".rate-button input[type=range]");
        volumeElement = wrapper.querySelector(".volume-button input[type=range]");
        progressElement = wrapper.getElementsByTagName("progress")[0];
        textHighlightingElement = wrapper.getElementsByClassName("talkify-cc-button")[0];
        currentTimeElement = wrapper.getElementsByClassName("talkify-time-element")[0];
        attachElement = wrapper.getElementsByClassName("talkify-detatched")[0];
        detatchedElement = wrapper.getElementsByClassName("talkify-attached")[0];
        voiceWrapperElement = wrapper.querySelector(".talkify-voice-selector select");
        dragArea = wrapper.getElementsByClassName("drag-area")[0];

        settings.parentElement.appendChild(wrapper);

        hide(loader);

        pause();
    }

    function setupBindings() {
        var controlCenter = document.getElementsByClassName("talkify-control-center")[0];

        playElement.addEventListener("click", function () {
            if (playElement.classList.contains("talkify-disabled")) {
                return;
            }

            talkify.messageHub.publish(correlationId + ".controlcenter.request.play");
        });

        pauseElement.addEventListener("click", function () {
            if (pauseElement.classList.contains("talkify-disabled")) {
                return;
            }
            talkify.messageHub.publish(correlationId + ".controlcenter.request.pause");
        });

        rateElement.addEventListener("change", function () {
            talkify.messageHub.publish(correlationId + ".controlcenter.request.rate", parseInt(this.value));
        });

        volumeElement.addEventListener("change", function (e) {
            talkify.messageHub.publish(correlationId + ".controlcenter.request.volume", parseInt(this.value));
        });

        textHighlightingElement.addEventListener("click", function (e) {
            if (textHighlightingElement.classList.contains("talkify-disabled")) {
                removeClass(textHighlightingElement, "talkify-disabled");
                talkify.messageHub.publish(correlationId + ".controlcenter.texthighlightoggled", true);
            } else {
                addClass(textHighlightingElement, "talkify-disabled");
                talkify.messageHub.publish(correlationId + ".controlcenter.texthighlightoggled", false);
            }
        });

        progressElement.addEventListener("click", function (e) {
            var clickedValue = (e.offsetX * this.max) / this.offsetWidth;

            if (clickedValue > 1.0) {
                clickedValue = 1.0;
            }

            if (clickedValue < 0.0) {
                clickedValue = 0.0;
            }

            talkify.messageHub.publish(correlationId + ".controlcenter.request.seek", clickedValue);
        });

        attachElement.addEventListener("click", function () {
            addClass(controlCenter, "attached");
        });

        detatchedElement.addEventListener("click", function () {
            removeClass(controlCenter, "attached");
        });

        dragArea.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove);
        }

        function onMouseDown(e) {
            document.addEventListener("mousemove", onMouseMove);
        }

        function onMouseMove(e) {
            controlCenter.style.top = e.clientY + "px";
            controlCenter.style.left = e.clientX + "px";
        }
    }

    function initialize() {
        render();
        setupBindings();

        talkify.messageHub.subscribe("controlcenter", [correlationId + ".player.*.pause", correlationId + ".player.*.disposed"], pause);
        talkify.messageHub.subscribe("controlcenter", [correlationId + ".player.*.play", correlationId + ".player.*.resume"], play);
        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.disposed", dispose);
        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.loading", function(){
            hide(playElement);
            hide(pauseElement);
            show(loader);
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.loaded", function () {
            removeClass(pauseElement, "talkify-disabled");
            removeClass(playElement, "talkify-disabled");
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.texthighlight.enabled", function () {
            removeClass(textHighlightingElement, "talkify-disabled");
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.texthighlight.disabled", function () {
            addClass(textHighlightingElement, "talkify-disabled");
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.ratechanged", function (rate) {
            rateElement.value = rate;;
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.*.voiceset", function (voice) {
            featureToggle(voice);
            setVoiceName(voice);
        });

        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.tts.timeupdated", updateClock);
        talkify.messageHub.subscribe("controlcenter", correlationId + ".player.html5.timeupdated", function (value) {
            progressElement.setAttribute("value", value);
        });
    };

    function updateClock(timeInfo) {
        var currentTime = timeInfo.currentTime;
        var duration = timeInfo.duration;
        //TODO: Over tunnels duration === NaN. Look @ http://stackoverflow.com/questions/10868249/html5-audio-player-duration-showing-nan
        progressElement.setAttribute("value", currentTime / duration);

        if (!currentTimeElement) {
            return;
        }

        var currentminutes = Math.floor(currentTime / 60);
        var currentseconds = Math.round(currentTime) - (currentminutes * 60);

        var totalminutes = !!duration ? Math.floor(duration / 60) : 0;
        var totalseconds = !!duration ? Math.round(duration) - (totalminutes * 60) : 0;

        currentTimeElement.textContent = currentminutes + ":" + ((currentseconds < 10) ? "0" + currentseconds : currentseconds) +
            " / " +
            totalminutes + ":" + ((totalseconds < 10) ? "0" + totalseconds : totalseconds);
    }

    function isTalkifyHostedVoice(voice) {
        return voice && voice.constructor.name !== "SpeechSynthesisVoice";
    }

    function featureToggle(voice) {
        show(progressElement);
        show(textHighlightingElement);

        if (!voice) {
            return;
        }

        if (isTalkifyHostedVoice(voice)) {
            return;
        }

        hide(currentTimeElement);

        if (!voice.localService) {
            hide(progressElement);
            hide(textHighlightingElement);
        }
    }

    function setVoiceName(voice) {
        var voiceElement = document.querySelector(".talkify-voice-selector > span");

        if (!voice) {
            voiceElement.textContent = "Automatic voice detection";
            return;
        }

        if (isTalkifyHostedVoice(voice)) {
            voiceElement.textContent = voice.description;
            return;
        }

        voiceElement.textContent = voice.name;
    }

    function dispose() {
        var existingControl = document.getElementsByClassName("talkify-control-center")[0];

        if (existingControl) {
            existingControl.parentNode.removeChild(existingControl);
        }

        talkify.messageHub.unsubscribe("controlcenter", [correlationId + ".player.*.pause", correlationId + ".player.*.disposed"]);
        talkify.messageHub.unsubscribe("controlcenter", [correlationId + ".player.*.play", correlationId + ".player.*.resume"]);
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.disposed");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.loaded");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.loading");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.texthighlight.enabled");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.texthighlight.disabled");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.ratechanged");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.*.voiceset");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.tts.timeupdated");
        talkify.messageHub.unsubscribe("controlcenter", correlationId + ".player.html5.timeupdated");
    }

    initialize();

    return {
        setMaxRate: function (value) {
            rateElement.setAttribute("max", value);
            return this;
        },
        setMinRate: function (value) {
            rateElement.setAttribute("min", value);
            return this;
        },
        dispose: dispose
    }
}
},{}],6:[function(require,module,exports){
talkify = talkify || {};

talkify.formReader = function () {
    var player;
    var timeout;

    function setupForm(formElement) {
        var elements = formElement.elements;

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("focus", onFocus);
        }
    }

    function removeForm(formElement) {
        var elements = formElement.elements;

        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener("focus", onFocus);
        }
    }

    function onFocus(e) {
        if (timeout) {
            clearTimeout(timeout);
        }

        var me = this;

        timeout = setTimeout(function () {
            if (!player) {
                player = talkify.config.formReader.remoteService ? new talkify.TtsPlayer() : new talkify.Html5Player();
            }

            var config = talkify.config.formReader;

            if (config.voice) {
                player.forceVoice({ name: config.voice });
            }

            player.setRate(config.rate);

            if (me.type === "button" || me.type === "submit") {
                player.playText(me.value || me.innerText);
                return;
            }

            var requiredText = me.attributes.required ? config.requiredText : "";

            var label = findLabelFor(me);

            var text = getTextForCheckboxes(me, label) || getTextForSelects(me, label) || getTextForInputs(me, label) || "";

            player.playText(text + ". " + requiredText);
        }, 100);
    }

    function getTextForCheckboxes(element, label) {
        var config = talkify.config.formReader;

        if (element.type === "checkbox") {
            var labelText = label ? label.innerText : "checkbox";

            if (element.checked) {
                return config.selectedText.replace("{label}", labelText);
            } else {
                return config.notSelectedText.replace("{label}", labelText);
            }
        }

        return null;
    }

    function getTextForSelects(element, label) {
        var config = talkify.config.formReader;

        if (element.tagName.toLowerCase() === "select") {
            var labelText = label ? label.innerText : "option";

            var value = element.options[element.options.selectedIndex].text;

            return config.valueText.replace("{value}", value).replace("{label}", labelText);
        }

        return null;
    }

    function getTextForInputs(element, label) {
        var config = talkify.config.formReader;

        if (!label) {
            return element.value;
        }

        if (element.value) {
            return config.valueText.replace("{value}", element.value).replace("{label}", label.innerText);
        } else {
            return label.innerText + ".";
        }
    }

    function findLabelFor(input) {
        var labels = document.getElementsByTagName('label');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor === input.id) {
                return labels[i];
            }
        }

        return null;
    }

    return {
        addForm: function (formElement) {
            setupForm(formElement);
        },
        removeForm: function(formElement) {
            removeForm(formElement);
        }
    };
}();
},{}],7:[function(require,module,exports){
//TODO: Verify all events. Especially for this player. Trigger play, pause, stop and add console outputs and see what happens
talkify = talkify || {};

talkify.Html5Player = function () {
    this.isStopped = false;
    this.volume = 1;

    this.currentContext = {
        item: null,
        utterances: [],
        currentUtterance: null
    };

    var timeupdater;

    var me = this;

    this.playbar = {
        instance: null
    };

    this.audioSource = {
        play: function () {
            if (me.currentContext.item) {
                playCurrentContext();
            }
        },
        pause: function () {
            window.speechSynthesis.pause();

            talkify.messageHub.publish(me.correlationId + ".player.html5.pause");
        },
        ended: function () { return !window.speechSynthesis.speaking; },
        isPlaying: function () { return window.speechSynthesis.speaking; },
        paused: function () { return !window.speechSynthesis.speaking; },
        currentTime: function () { return 0; },
        cancel: function (asPause) {
            if (asPause) {
                stop();
            } else {
                window.speechSynthesis.cancel();
            }
        },
        stop: function () {
            stop();
        },
        dispose: function () {
            talkify.messageHub.unsubscribe("html5player", me.correlationId + ".controlcenter.request.play");
            talkify.messageHub.unsubscribe("html5player", me.correlationId + ".controlcenter.request.pause");
            talkify.messageHub.unsubscribe("html5player", me.correlationId + ".controlcenter.request.volume");
            talkify.messageHub.unsubscribe("html5player", me.correlationId + ".controlcenter.request.rate");

            if (timeupdater) {
                clearInterval(timeupdater);
            }    
        }
    };

    talkify.BasePlayer.call(this, this.audioSource, this.playbar);

    this.playAudio = function (item) {
        // me.currentContext.endedCallback = onEnded;
        me.currentContext.item = item;
        me.currentContext.utterances = [];
        me.currentContext.currentUtterance = null;
        // me.mutateControls(function (instance) {
        //     instance.audioLoaded();
        // });

        //if (me.settings.lockedLanguage !== null) {
        playCurrentContext();
        //}

        //TODO: Need better server side help here with refLang
        //var p = new promise.Promise();

        //talkifyHttp.get("/api/Language?text=" + item.text)
        //    .then(function (error, data) {
        //        me.settings.referenceLanguage = data;

        //        me.playCurrentContext().then(function () {
        //            p.done();
        //        });
        //    });

        //return p;
    };

    this.setVolume = function (volume) {
        me.volume = volume;

        return this;
    };

    talkify.messageHub.subscribe("html5player", me.correlationId + ".controlcenter.request.play", function () { me.audioSource.play(); });
    talkify.messageHub.subscribe("html5player", me.correlationId + ".controlcenter.request.pause", function () { me.pause(); });
    talkify.messageHub.subscribe("html5player", me.correlationId + ".controlcenter.request.volume", function (volume) { me.volume = volume / 10; });
    talkify.messageHub.subscribe("html5player", me.correlationId + ".controlcenter.request.rate", function (rate) { me.settings.rate = rate / 5; });

    function playCurrentContext() {
        if (timeupdater) {
            clearInterval(timeupdater);
        }

        var item = me.currentContext.item;

        var chuncks = chunckText(item.text);

        me.currentContext.utterances = [];
        me.isStopped = false;

        chuncks.forEach(function (chunck) {
            var utterance = new window.SpeechSynthesisUtterance();

            utterance.text = chunck;
            utterance.lang = me.settings.lockedLanguage || me.settings.referenceLanguage.Culture;
            utterance.rate = me.settings.rate;
            utterance.volume = me.volume;

            me.currentContext.utterances.push(utterance);
        });

        var wordIndex = 0;
        var previousCharIndex = 0;
        var words = extractWords(item.text);

        me.currentContext.utterances[me.currentContext.utterances.length - 1].onend = function (e) {
            talkify.messageHub.publish(me.correlationId + ".player.html5.utterancecomplete", item);

            if (timeupdater) {
                clearInterval(timeupdater);
            }

            if (!me.currentContext.currentUtterance) {
                return;
            }

            if (me.currentContext.currentUtterance.text !== e.currentTarget.text) {
                return;
            }

            if (!me.isStopped) {
                talkify.messageHub.publish(me.correlationId + ".player.html5.ended", item);
            }
        };

        me.currentContext.utterances.forEach(function (u, index) {
            if (index === 0) {
                u.onstart = function (e) {
                    me.currentContext.currentUtterance = e.utterance;
                    talkify.messageHub.publish(me.correlationId + ".player.html5.loaded", me.currentContext.item);
                    talkify.messageHub.publish(me.correlationId + ".player.html5.play", { item: me.currentContext.item, positions: [], currentTime: 0 });

                    if (timeupdater) {
                        clearInterval(timeupdater);
                    }

                    timeupdater = setInterval(function () {
                        talkify.messageHub.publish(me.correlationId + ".player.html5.timeupdated", (wordIndex + 1) / words.length);
                    }, 100);
                };
            } else {
                u.onstart = function (e) {
                    me.currentContext.currentUtterance = e.utterance;
                };
            }

            u.onpause = function () {
                if (timeupdater) {
                    clearInterval(timeupdater);
                }

                talkify.messageHub.publish(me.correlationId + ".player.html5.pause");
            };

            u.onresume = function () { };

            u.onboundary = function (e) {
                if (e.name !== "word" || !words[wordIndex]) {
                    return;
                }

                if (!me.settings.useTextHighlight || !u.voice.localService) {
                    return;
                }

                var fromIndex = 0;

                for (var k = 0; k < wordIndex; k++) {
                    fromIndex += words[k].length + 1;
                }

                var isCommaOrSimilair = previousCharIndex + 1 === e.charIndex;

                if (isCommaOrSimilair) {
                    previousCharIndex = e.charIndex;
                    return;
                }

                me.wordHighlighter.highlight(item, words[wordIndex], fromIndex);
                wordIndex++;
                previousCharIndex = e.charIndex;
            };

            getVoice().then(function (voice) {
                if (words.length && me.settings.useTextHighlight && voice.localService) {
                    me.wordHighlighter.highlight(item, words[0], 0);
                }

                u.voice = voice;

                console.log(u); //Keep this, speech bugs out otherwise

                window.speechSynthesis.cancel();

                talkify.messageHub.publish(me.correlationId + ".player.html5.voiceset", voice);

                window.setTimeout(function () {
                    window.speechSynthesis.speak(u);
                }, 100);
            });
        });
    };

    function chunckText(text) {
        var language = me.settings.lockedLanguage || me.settings.referenceLanguage.Culture;
        var chunckSize = language.indexOf('zh-') > -1 ? 70 :
            language.indexOf('ko-') > -1 ? 130 : 200;

        var chuncks = [];
        var sentences = text.split(/(\?|\.|???)+/g); //('.');
        var currentChunck = '';

        sentences.forEach(function (sentence) {
            if (sentence === '' || sentence === '.' || sentence === '???' || sentence === '?') {
                if (currentChunck) {
                    currentChunck += sentence;
                }

                return;
            }

            if (currentChunck && ((currentChunck.length + sentence.length) > chunckSize)) {
                chuncks.push(currentChunck);
                currentChunck = '';
            }

            if (sentence.length > chunckSize) {
                var words = extractWords(sentence, language);

                words.forEach(function (word) {
                    if (currentChunck.length + word.length > chunckSize) {
                        chuncks.push(currentChunck);
                        currentChunck = '';
                    }

                    currentChunck += word.trim() + ' ';
                });

                if (currentChunck.trim()) {
                    chuncks.push(currentChunck.trim() + '.');
                    currentChunck = '';
                }

                return;
            }

            currentChunck += sentence;
        });

        chuncks.push(currentChunck);

        return chuncks;
    };

    function extractWords(text, language) {
        var wordRegex = new RegExp(/[&\$\-|]|([("\-&])*(\b[^\s]+[.:,"-)!&?]*)/g);

        if (language) {
            if (language.indexOf('zh-') > -1) {
                return text.split('???');
            }

            if (language.indexOf('ko-') > -1) {
                return text.split('.');
            }
        }

        var words = [];
        var m;

        while ((m = wordRegex.exec(text)) !== null) {
            if (m.index === wordRegex.lastIndex) {
                wordRegex.lastIndex++;
            }

            words.push(m[0]);
        }

        return words;
    };

    function selectVoiceToPlay(voices) {
        var matchingVoices = [];
        var voice = null;

        var language = me.settings.lockedLanguage || me.settings.referenceLanguage.Culture;

        for (var i = 0; i < voices.length; i++) {
            if (voices[i].lang === language) {
                matchingVoices.push(voices[i]);
                voice = voices[i];
            }
        }

        for (var j = 0; j < matchingVoices.length; j++) {
            if (matchingVoices[j].localService) {
                voice = matchingVoices[j];

                break;
            }
        }

        if (!voice && matchingVoices.length) {
            voice = matchingVoices[0];
        }

        if (!voice && voices.length) {
            voice = voices[0];
        }

        return voice;
    };

    function getVoice() {
        var p = new promise.promise.Promise();

        if (me.forcedVoice) {
            p.done(me.forcedVoice);

            return p;
        }

        if (window.speechSynthesis.getVoices().length) {
            var voices = window.speechSynthesis.getVoices();

            p.done(selectVoiceToPlay(voices));

            return p;
        }

        window.speechSynthesis.onvoiceschanged = function () {
            var voices = window.speechSynthesis.getVoices();

            p.done(selectVoiceToPlay(voices));
        };

        return p;
    };

    function stop() {
        me.isStopped = true;
        talkify.messageHub.publish(me.correlationId + ".player.html5.pause");
        window.speechSynthesis.cancel();

        if (timeupdater) {
            clearInterval(timeupdater);
        }

        if (me.currentContext.utterances.indexOf(me.currentContext.currentUtterance) < me.currentContext.utterances.length - 1) {
            console.log('Not the last, finishing anyway...');
            talkify.messageHub.publish(me.correlationId + ".player.html5.utterancecomplete", me.currentContext.item);
        }
    };
};

talkify.Html5Player.prototype.constructor = talkify.Html5Player;
},{}],8:[function(require,module,exports){
talkify = talkify || {};

talkify.KeyboardCommands = function (keyboadCommands) {
    if (!keyboadCommands.enabled) {
        return {
            onPrevious: function () { },
            onNext: function () { },
            onPlayPause: function () { },
            dispose: function () { }
        }
    }


    var onNextCallback = function () { };
    var onPreviousCallback = function () { };
    var onPlayPauseCallback = function () { };

    document.addEventListener("keyup", keyupEventHandler);

    function keyupEventHandler(e) {
        if (!e.ctrlKey) {
            return;
        }

        var key = e.keyCode ? e.keyCode : e.which;

        if (key === keyboadCommands.commands.previous) {
            onPreviousCallback();
        } else if (key === keyboadCommands.commands.next) {
            onNextCallback();
        } else if (key === keyboadCommands.commands.playPause) {
            onPlayPauseCallback();
        }
    }

    return {
        onPrevious: function (callback) {
            onPreviousCallback = callback;
        },
        onNext: function (callback) {
            onNextCallback = callback;
        },
        onPlayPause: function (callback) {
            onPlayPauseCallback = callback;
        },
        dispose: function () {
            document.removeEventListener("keyup", keyupEventHandler);
        }
    }
};
},{}],9:[function(require,module,exports){
talkify = talkify || {};
talkify.messageHub = function () {
    var subscribers = {};

    function publish(topic, message) {
        if (topic.indexOf("timeupdate") === -1) {
            talkify.log("Publishing", topic);
        }

        var topics = topic.split('.');
        var candidates = [];

        Object.keys(subscribers).forEach(function (subscriberKey) {
            if(subscriberKey === '*'){
                candidates.push(subscriberKey);
                return;
            }

            var s = subscriberKey.split('.');

            if (s.length != topics.length) {
                return;
            }

            var match = true;

            for (var i = 0; i < s.length; i++) {
                if (topics[i] === '*') {
                    match = true;
                }
                else if (s[i] === topics[i]) {
                    match = true;
                } else if (s[i] === "*") {
                    match === true;
                } else {
                    match = false;
                    break;
                }
            }

            if (match) {
                candidates.push(subscriberKey);
            }
        });

        if (candidates.length === 0) {
            console.warn("No subscriber found", topic)
        }

        candidates.forEach(function (c) {
            subscribers[c].forEach(function (subscriber) {
                if (c.indexOf("timeupdate") === -1) {
                    talkify.log("Calling subscriber", subscriber, c, message);
                }

                subscriber.fn(message, topic);
            });
        })

    }

    function subscribe(key, topic, fn) {
        topic = Array.isArray(topic) ? topic : [topic];

        for (var i = 0; i < topic.length; i++) {
            subscribers[topic[i]] = subscribers[topic[i]] || [];

            subscribers[topic[i]].push({ key: key, fn: fn });
        }
    }

    function unsubscribe(key, topic) {
        topic = Array.isArray(topic) ? topic : [topic];

        talkify.log("Unsubscribing", key, topic);

        Object.keys(subscribers).filter(function (subscriberKey) {
            return topic.indexOf(subscriberKey) > -1 ;
        }).forEach(function (subscriberKey) {
            subscribers[subscriberKey] = subscribers[subscriberKey].filter(function (subscriber) {
                return subscriber.key !== key;
            });
        });
    }

    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    }
}();
},{}],10:[function(require,module,exports){
talkify = talkify || {};
talkify.BasePlayer = function (_audiosource, _playbar) {
    this.correlationId = talkify.generateGuid();
    this.audioSource = _audiosource;
    this.wordHighlighter = new talkify.wordHighlighter(this.correlationId);

    var me = this;

    this.settings = {
        useTextHighlight: false,
        referenceLanguage: { Culture: "", Language: -1 },
        lockedLanguage: null,
        rate: 1,
        useControls: false
    };

    this.playbar = _playbar;
    this.forcedVoice = null;

    if (talkify.config.ui.audioControls.enabled) {
        this.playbar.instance = talkify.playbar(null, this.correlationId);
    }

    talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.loaded", function (item) {
        item.isLoading = false;
    });

    talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.ended", function (item) {
        item.isPlaying = false;
    });

    talkify.messageHub.subscribe("core-player", this.correlationId + ".controlcenter.texthighlightoggled", function (enabled) {
        me.settings.useTextHighlight = enabled;
    });

    talkify.messageHub.publish(this.correlationId + ".player.*.ratechanged", me.settings.rate);

    this.withReferenceLanguage = function (refLang) {
        this.settings.referenceLanguage = refLang;

        return this;
    };

    this.enableTextHighlighting = function () {
        this.settings.useTextHighlight = true;

        talkify.messageHub.publish(this.correlationId + ".player.*.texthighlight.enabled");

        return this;
    };

    this.disableTextHighlighting = function () {
        this.settings.useTextHighlight = false;

        talkify.messageHub.publish(this.correlationId + ".player.*.texthighlight.disabled");

        return this;
    };

    this.setRate = function (r) {
        this.settings.rate = r;

        talkify.messageHub.publish(this.correlationId + ".player.*.ratechanged", r);

        return this;
    };

    this.subscribeTo = function (subscriptions) {
        talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.pause", subscriptions.onPause || function () { });
        talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.resume", subscriptions.onResume || function () { });
        talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.play", subscriptions.onPlay || function () { });
        talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.loaded", subscriptions.onItemLoaded || function () { });
        talkify.messageHub.subscribe("core-player", [this.correlationId + ".wordhighlighter.complete", this.correlationId + ".player.html5.utterancecomplete"], subscriptions.onItemFinished || function () { });
        talkify.messageHub.subscribe("core-player", this.correlationId + ".player.*.prepareplay", subscriptions.onBeforeItemPlaying || function () { });
        talkify.messageHub.subscribe("core-player", this.correlationId + ".controlcenter.texthighlightoggled", subscriptions.onTextHighligtChanged || function () { });

        return this;
    };

    this.playItem = function (item) {
        if (item && item.isPlaying) {
            if (this.audioSource.paused()) {
                this.audioSource.play();
            } else {
                this.audioSource.pause();
            }
        }

        talkify.messageHub.publish(this.correlationId + ".player.*.prepareplay", item);

        item.isLoading = true;
        item.isPlaying = true;
        item.element.classList.add("playing");

        this.playAudio(item);
    };

    this.createItems = function (text) {
        var safeMaxQuerystringLength = 1000;

        var items = [];

        //TODO: Smart split, should really split at the first end of sentence (.) that is < safeLength
        if (text.length > safeMaxQuerystringLength) {
            var f = text.substr(0, safeMaxQuerystringLength);

            items.push(template(f));

            items = items.concat(this.createItems(text.substr(safeMaxQuerystringLength, text.length - 1)));

            return items;
        }

        items.push(template(text));

        return items;

        function template(t) {
            //Null-objects
            var element = document.createElement("span");
            var clone = element.cloneNode(true);

            return {
                text: t,
                preview: t.substr(0, 40),
                element: element,
                originalElement: clone,
                isPlaying: false,
                isLoading: false
            };
        }
    };

    this.playText = function (text) {
        if (!text) {
            return;
        }

        var items = this.createItems(text);

        var currentItem = 0;

        talkify.messageHub.subscribe("core-player.playText", this.correlationId + ".player.*.ended", function () {
            currentItem++;

            if (currentItem >= items.length) {
                talkify.messageHub.unsubscribe("core.playText", this.correlationId + ".player.*.ended");
                return;
            }

            this.playItem(items[currentItem]);
        });

        this.playItem(items[currentItem]);
    };

    this.paused = function () {
        return this.audioSource.paused();
    };

    this.isPlaying = function () {
        return this.audioSource.isPlaying();
    };

    this.play = function () {
        this.audioSource.play();
    };

    this.pause = function () {
        this.audioSource.pause();
        var me = this;

        if (!me.audioSource.paused() && me.audioSource.cancel) {
            me.audioSource.cancel(true);
        }
    };

    this.dispose = function () {
        talkify.messageHub.publish(this.correlationId + ".player.tts.disposed");
        this.audioSource.stop();

        this.audioSource.dispose();
        this.wordHighlighter.dispose();

        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.loaded");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.ended");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".controlcenter.texthighlightoggled");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.pause");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.resume");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.play");
        talkify.messageHub.unsubscribe("core-player", [this.correlationId + ".wordhighlighter.complete", this.correlationId + ".player.html5.utterancecomplete"]);
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".player.*.prepareplay");
        talkify.messageHub.unsubscribe("core-player", this.correlationId + ".controlcenter.texthighlightoggled");
    };

    this.forceLanguage = function (culture) {
        this.settings.lockedLanguage = culture;

        return this;
    };

    this.forceVoice = function (voice) {
        this.forcedVoice = voice !== undefined ? voice : null;

        this.settings.lockedLanguage = (voice && (voice.lang || voice.culture)) || this.settings.lockedLanguage;

        talkify.messageHub.publish(this.correlationId + ".player.*.voiceset", voice);

        return this;
    };
};
},{}],11:[function(require,module,exports){
talkify = talkify || {};

talkify.TtsPlayer = function () {
    if (!talkify.config.remoteService.active) {
        throw "This player needs to communicate to a remote service. To enable this player please set flag talkify.config.remoteService.active to true.";
    }

    var me = this;
    var audioElement, timeupdater;

    this.currentContext = {
        item: null,
        positions: []
    };

    this.playbar = {
        instance: null
    };

    this.audioSource = {
        play: function () {
            audioElement.play();
        },
        pause: function () {
            audioElement.pause();
        },
        isPlaying: function () {
            return audioElement.duration > 0 && !audioElement.paused;
        },
        paused: function () { return audioElement.paused; },
        currentTime: function () { return audioElement.currentTime; },
        stop: function () {
            audioElement.pause();
            audioElement.currentTime = 0;
        },
        dispose: function () {
            if (timeupdater) {
                clearInterval(timeupdater);
            }

            var existingElement = document.getElementById("talkify-audio");

            if (existingElement) {
                existingElement.outerHTML = "";
            }

            talkify.messageHub.unsubscribe("tts-player", me.correlationId + ".controlcenter.request.play");
            talkify.messageHub.unsubscribe("tts-player", me.correlationId + ".controlcenter.request.pause");
            talkify.messageHub.unsubscribe("tts-player", me.correlationId + ".controlcenter.request.seek");
            talkify.messageHub.unsubscribe("tts-player", me.correlationId + ".controlcenter.request.volume");
            talkify.messageHub.unsubscribe("tts-player", me.correlationId + ".controlcenter.request.rate");

        }
    };

    talkify.BasePlayer.call(this, this.audioSource, this.playbar);

    function setupBindings() {
        audioElement.addEventListener("pause", onPause);
        audioElement.addEventListener("play", onPlay);
        audioElement.addEventListener("seeked", onSeek);
    }

    function onSeek() {
        talkify.messageHub.publish(me.correlationId + ".player.tts.seeked", this.currentTime);

        if (me.audioSource.paused() && me.audioSource.currentTime() > 0.1) {
            me.audioSource.play();
        }
    }

    function onPause() {
        if (timeupdater) {
            clearInterval(timeupdater);
        }

        talkify.messageHub.publish(me.correlationId + ".player.tts.pause");
    }

    function onPlay() {
        if (timeupdater) {
            clearInterval(timeupdater);
        }

        timeupdater = setInterval(function () {
            talkify.messageHub.publish(me.correlationId + ".player.tts.timeupdated", { currentTime: audioElement.currentTime, duration: audioElement.duration });
        }, 50);

        if (!me.currentContext.positions.length) {
            talkify.messageHub.publish(me.correlationId + ".player.tts.play", { item: me.currentContext.item, positions: [], currentTime: me.audioSource.currentTime() });
            return;
        }

        if (me.audioSource.currentTime() > 0.1) {
            talkify.messageHub.publish(me.correlationId + ".player.tts.resume", { currentTime: me.audioSource.currentTime() });
        } else {
            var interval = setInterval(function () {
                if (me.audioSource.currentTime() > 0) {
                    clearInterval(interval);

                    talkify.messageHub.publish(me.correlationId + ".player.tts.play", { item: me.currentContext.item, positions: me.currentContext.positions, currentTime: me.audioSource.currentTime() });
                }
            }, 20);
        }
    }

    function initialize() {
        if (timeupdater) {
            clearInterval(timeupdater);
        }

        audioElement = null;
        var existingElement = document.getElementById("talkify-audio");

        if (existingElement) {
            existingElement.outerHTML = "";
        }

        var mp3Source = document.createElement("source");
        var wavSource = document.createElement("source");
        audioElement = document.createElement("audio");

        audioElement.appendChild(mp3Source);
        audioElement.appendChild(wavSource);

        mp3Source.type = "audio/mpeg";
        wavSource.type = "audio/wav";
        audioElement.id = "talkify-audio";
        audioElement.controls = !talkify.config.ui.audioControls.enabled;
        audioElement.autoplay = false;

        document.body.appendChild(audioElement);

        var clonedAudio = audioElement.cloneNode(true);
        audioElement.parentNode.replaceChild(clonedAudio, audioElement);

        audioElement = clonedAudio;

        talkify.messageHub.subscribe("tts-player", me.correlationId + ".controlcenter.request.play", function () { me.play(); });
        talkify.messageHub.subscribe("tts-player", me.correlationId + ".controlcenter.request.pause", function () { audioElement.pause(); });
        talkify.messageHub.subscribe("tts-player", me.correlationId + ".controlcenter.request.seek", function (position) {
            var pos = audioElement.duration * position;

            if (isNaN(audioElement.duration)) {
                return;
            }

            audioElement.currentTime = pos;
        });

        talkify.messageHub.subscribe("tts-player", me.correlationId + ".controlcenter.request.volume", function (volume) { audioElement.volume = volume / 10; });
        talkify.messageHub.subscribe("tts-player", me.correlationId + ".controlcenter.request.rate", function (rate) { me.settings.rate = rate; });

        if (me.playbar.instance) {
            me.playbar.instance
                .setMinRate(-5)
                .setMaxRate(5);
        }
    }

    function getPositions(requestId) {
        var p = new promise.promise.Promise();

        talkify.http.get(talkify.config.remoteService.speechBaseUrl + "/marks?id=" + requestId)
            .then(function (error, positions) {
                p.done(null, positions);
            });

        return p;
    };

    initialize.apply(this);

    this.playAudio = function (item) {
        talkify.messageHub.publish(me.correlationId + ".player.tts.loading", item);

        me.currentContext.item = item;
        me.currentContext.positions = [];

        audioElement.onloadeddata = null;
        audioElement.onended = null;

        var sources = audioElement.getElementsByTagName("source");

        var textToPlay = encodeURIComponent(item.text.replace(/\n/g, " "));
        var voice = this.forcedVoice ? this.forcedVoice.name : "";

        var requestId = talkify.generateGuid();

        var audioUrl = talkify.config.remoteService.host + talkify.config.remoteService.speechBaseUrl + "?text=" + textToPlay + "&fallbackLanguage=" + this.settings.referenceLanguage.Language + "&voice=" + (voice) + "&rate=" + this.settings.rate + "&key=" + talkify.config.remoteService.apiKey;

        if (me.settings.useTextHighlight) {
            audioUrl += "&marksid=" + requestId;
        }

        sources[0].src = audioUrl + "&format=mp3";
        sources[1].src = audioUrl + "&format=wav";

        audioElement.load();

        audioElement.onloadeddata = function () {

            me.audioSource.pause();

            if (!me.settings.useTextHighlight) {
                talkify.messageHub.publish(me.correlationId + ".player.tts.loaded", me.currentContext.item);
                me.audioSource.play();
                return;
            }

            getPositions(requestId).then(function (error, positions) {
                me.currentContext.positions = positions || [];

                talkify.messageHub.publish(me.correlationId + ".player.tts.loaded", me.currentContext.item);
                me.audioSource.play();
            });
        };

        audioElement.onended = function () {
            talkify.messageHub.publish(me.correlationId + ".player.tts.ended", item);
        };
    };

    setupBindings();
};

talkify.TtsPlayer.prototype.constructor = talkify.TtsPlayer;
},{}],12:[function(require,module,exports){
talkify = talkify || {};
talkify.playlist = function () {
    var defaults = {
        useGui: false,
        useTextInteraction: false,
        domElements: [],
        exclusions: [],
        rootSelector: "body",
        events: {
            onEnded: null,
            onVoiceCommandListeningStarted: null,
            onVoiceCommandListeningEnded: null
        }
    };

    var s = JSON.parse(JSON.stringify(defaults));

    var p = null;

    function isSupported() {
        var a = document.createElement("audio");

        return (typeof a.canPlayType === "function" && (a.canPlayType("audio/mpeg") !== "" || a.canPlayType("audio/wav") !== ""));
    }

    function implementation(_settings, player) {

        var textextractor = new talkify.textextractor();

        var playlist = {
            queue: [],
            currentlyPlaying: null,
            refrenceText: "",
            referenceLanguage: { Culture: '', Language: -1 }
        };

        var settings = _settings;
        var playerHasBeenReplaced = false;

        var commands = [
            new talkify.KeyboardCommands(talkify.config.keyboardCommands),
            new talkify.SpeechCommands(talkify.config.voiceCommands)
        ];

        var voiceCommands = commands[1];

        for (var k = 0; k < commands.length; k++) {
            commands[k].onNext(function () {
                var item = getNextItem();

                if (item) {
                    play(item);
                }
            });
            commands[k].onPrevious(function () {
                var item = getPreviousItem();

                if (item) {
                    play(item);
                }
            });
            commands[k].onPlayPause(function () {
                if (player.paused()) {
                    player.play();
                } else {
                    pause();
                }
            });
        }

        voiceCommands.onListeningStarted(settings.events.onVoiceCommandListeningStarted);
        voiceCommands.onListeningEnded(settings.events.onVoiceCommandListeningEnded);

        setupHubSubscribers();

        function setupHubSubscribers() {
            talkify.messageHub.subscribe("playlist", player.correlationId + ".player.*.ended", function (endedItem) {
                if (playlist.queue.indexOf(endedItem) === -1) {
                    return;
                }

                var item = getNextItem();

                if (!item) {
                    settings.events.onEnded();
                    resetPlaybackStates();
                    return;
                }

                playItem(item);
            });
        }

        function reset() {
            playlist.queue = [];
            player.withReferenceLanguage({ Culture: '', Language: -1 });
            playlist.currentlyPlaying = null;
            playlist.refrenceText = "";
        }

        function insertAt(index, items) {
            playlist.queue = playlist.queue.slice(0, index)
                .concat(items)
                .concat(playlist.queue.slice(index));
        }

        function push(items) {
            playlist.queue = playlist.queue.concat(items);
        }

        function resetPlaybackStates() {
            for (var j = 0; j < playlist.queue.length; j++) {
                var item = playlist.queue[j];

                //TODO: Call player.resetItem?
                item.isPlaying = false;
                item.isLoading = false;
                item.element.classList.remove("playing"); 
            }
        };

        function isPlaying() {
            for (var i = 0; i < playlist.queue.length; i++) {
                if (playlist.queue[i].isPlaying) {
                    return true;
                }
            }

            return false;
        }

        function domElementExistsInQueue(element) { //TODO: might need to look at construct as <a><h3></h3></a> and whether "a" is "h3" since it is just a wrapper
            for (var j = 0; j < playlist.queue.length; j++) {
                var item = playlist.queue[j];

                if (!item) {
                    continue;
                }

                if (element === item.element) {
                    return true;
                }
            }

            return false;
        }

        function playItem(item) {
            if (!playerHasBeenReplaced && item && item.isPlaying) {
                if (player.paused()) {
                    player.play();
                } else {
                    player.pause();
                }
            }

            playerHasBeenReplaced = false;

            resetPlaybackStates();

            if (playlist.currentlyPlaying) {
                playlist.currentlyPlaying.element.innerHTML = playlist.currentlyPlaying.originalElement.innerHTML;
            }

            playlist.currentlyPlaying = item;

            p = player.playItem(item);
        };

        function createItems(text, element) {
            var safeMaxQuerystringLength = 1000;

            var items = [];

            if (text.length > safeMaxQuerystringLength) {
                var breakAt = text.substr(0, safeMaxQuerystringLength).lastIndexOf('.'); //TODO: What about ckj characters?

                breakAt = breakAt > -1 ? breakAt : safeMaxQuerystringLength;

                var f = text.substr(0, breakAt);

                items.push(template(f, element));

                items = items.concat(createItems(text.substr(breakAt, text.length - 1), element));

                return items;
            }

            items.push(template(text, element));

            return items;

            function template(t, el) {
                el = el || document.createElement("span");
                var clone = el.cloneNode(true);

                return {
                    text: t,
                    preview: t.substr(0, 40),
                    element: el,
                    originalElement: clone,
                    isPlaying: false,
                    isLoading: false
                };
            }
        }

        function play(item) {
            if (!item) {
                if (playlist.queue.length === 0) {
                    return;
                }

                playFromBeginning();

                return;
            }

            playItem(item);
        }

        function pause() {
            player.pause();
        }

        function setupItemForUserInteraction(item) {
            item.element.style.cursor = "pointer";
            item.element.classList.add("talkify-highlight");

            removeEventListeners("click", item.element);
            addEventListener("click", item.element, textInteractionEventListener);

            function textInteractionEventListener() {
                play(item);
            }
        }

        function removeUserInteractionForItem(item) {
            item.element.style.cursor = "inherit";
            item.element.classList.remove("talkify-highlight");

            removeEventListeners("click", item.element);
        }

        function initialize() {
            reset();

            if (!settings.domElements || settings.domElements.length === 0) {
                settings.domElements = textextractor.extract(settings.rootSelector, settings.exclusions);
            }

            for (var i = 0; i < settings.domElements.length; i++) {
                var text;
                var element = null;

                if (typeof settings.domElements[i] === "string") {
                    text = settings.domElements[i];
                } else {
                    element = settings.domElements[i];
                    text = element.innerText.trim();
                }

                if (text === "") {
                    continue;
                }

                push(createItems(text, element));

                if (text.length > playlist.refrenceText.length) {
                    playlist.refrenceText = text;
                }
            }

            if (settings.useTextInteraction) {
                for (var j = 0; j < playlist.queue.length; j++) {
                    var item = playlist.queue[j];

                    if (j > 0) {
                        var isSameAsPrevious = item.element === playlist.queue[j - 1].element;

                        if (isSameAsPrevious) {
                            continue;
                        }
                    }

                    setupItemForUserInteraction(item);
                }
            }
        }

        function getNextItem() {
            var currentQueuePosition = playlist.queue.indexOf(playlist.currentlyPlaying);

            if (currentQueuePosition === playlist.queue.length - 1) {
                return null;
            }

            return playlist.queue[currentQueuePosition + 1];
        }

        function getPreviousItem() {
            var currentQueuePosition = playlist.queue.indexOf(playlist.currentlyPlaying);

            if (currentQueuePosition === 0) {
                return null;
            }

            return playlist.queue[currentQueuePosition - 1];
        }

        function playFromBeginning() {
            if (!talkify.config.remoteService.active) {
                onComplete({ Culture: '', Language: -1 });

                return;
            }

            talkify.http.get(talkify.config.remoteService.languageBaseUrl + "/detect?text=" + playlist.refrenceText)
                .then(function (error, data) {
                    if (error) {
                        onComplete({ Cultures: [], Language: -1 });

                        return;
                    }

                    onComplete(data);
                });

            function onComplete(refLang) {
                playlist.referenceLanguage = { Culture: refLang.Cultures[0], Language: refLang.Language };
                player.withReferenceLanguage(playlist.referenceLanguage);

                playItem(playlist.queue[0]);
            }
        }

        function insertElement(element) {
            var items = [];

            var text = element.innerText;

            if (text.trim() === "") {
                return items;
            }

            if (domElementExistsInQueue(element)) {
                return items;
            }

            var documentPositionFollowing = 4;

            for (var j = 0; j < playlist.queue.length; j++) {
                var item = playlist.queue[j];

                var isSelectionAfterQueueItem = element.compareDocumentPosition(item.element) == documentPositionFollowing;

                if (isSelectionAfterQueueItem) {
                    var queueItems = createItems(text, element);

                    insertAt(j, queueItems);

                    items = items.concat(queueItems);

                    break;
                }

                var shouldAddToBottom = j === playlist.queue.length - 1;

                if (shouldAddToBottom) {
                    var qItems = createItems(text, element);

                    push(qItems);

                    items = items.concat(qItems);

                    break;;
                }
            }

            return items;
        }

        function replayCurrent() {
            if (!playlist.currentlyPlaying) {
                return;
            }

            playlist.currentlyPlaying.isPlaying = false;
            play(playlist.currentlyPlaying);
        }

        //TODO: Extract and reuse?
        function removeEventListeners(eventType, element) {
            if (!element.trackedEvents || !element.trackedEvents[eventType]) {
                return;
            }

            for (var i = 0; i < element.trackedEvents[eventType].length; i++) {
                element.removeEventListener(eventType, element.trackedEvents[eventType][i]);
            }
        }

        function addEventListener(eventType, element, listener) {
            if (!element.trackedEvents) {
                element.trackedEvents = [];
            }

            if (!element.trackedEvents[eventType]) {
                element.trackedEvents[eventType] = [];
            }

            element.trackedEvents[eventType].push(listener);
            element.addEventListener(eventType, listener);
        }

        initialize();

        return {
            getQueue: function () { return playlist.queue; },
            play: play,
            pause: pause,
            replayCurrent: replayCurrent,
            insert: insertElement,
            isPlaying: isPlaying,
            enableTextInteraction: function () {
                settings.useTextInteraction = true;

                for (var i = 0; i < playlist.queue.length; i++) {
                    setupItemForUserInteraction(playlist.queue[i]);
                }
            },
            disableTextInteraction: function () {
                settings.useTextInteraction = false;

                for (var i = 0; i < playlist.queue.length; i++) {
                    removeUserInteractionForItem(playlist.queue[i]);
                }
            },
            setPlayer: function (p) {
                talkify.messageHub.unsubscribe("playlist", player.correlationId + ".player.*.ended");

                player = p;
                player.withReferenceLanguage(playlist.referenceLanguage);
                playerHasBeenReplaced = true;

                setupHubSubscribers();

                replayCurrent();
            },
            dispose: function () {
                resetPlaybackStates();

                for (var i = 0; i < playlist.queue.length; i++) {
                    var item = playlist.queue[i];
    
                    removeUserInteractionForItem(item);
                }

                for (var i = 0; i < commands.length; i++) {
                    commands[i].dispose();
                }

                talkify.messageHub.unsubscribe("playlist", player.correlationId + ".player.*.ended");
            },
            startListeningToVoiceCommands: function () {
                voiceCommands.start();
            },
            stopListeningToVoiceCommands: function () {
                voiceCommands.stop();
            }
        }
    }

    return {
        begin: function () {
            s = JSON.parse(JSON.stringify(defaults));
            p = null;

            return {
                withTextInteraction: function () {
                    s.useTextInteraction = true;

                    return this;
                },
                withTalkifyUi: function () {
                    s.useGui = true;

                    return this;
                },
                excludeElements: function (elementsSelectors) {
                    s.exclusions = elementsSelectors;

                    return this;
                },
                withRootSelector: function (rootSelector) {
                    s.rootSelector = rootSelector;

                    return this;
                },
                withElements: function (elements) {
                    s.domElements = elements;

                    return this;
                },
                usingPlayer: function (player) {
                    p = player;

                    return this;
                },
                subscribeTo: function (events) {
                    s.events.onEnded = events.onEnded || function () { };
                    s.events.onVoiceCommandListeningStarted = events.onVoiceCommandListeningStarted || function () { };
                    s.events.onVoiceCommandListeningEnded = events.onVoiceCommandListeningEnded || function () { };


                    return this;
                },
                build: function () {
                    if (!isSupported()) {
                        throw new Error("Not supported. The browser needs to support mp3 or wav HTML5 Audio.");
                    }

                    if (!p) {
                        throw new Error("A player must be provided. Please use the 'usingPlayer' method to provide one.");
                    }

                    s.events.onEnded = s.events.onEnded || function () { };
                    s.events.onVoiceCommandListeningStarted = s.events.onVoiceCommandListeningStarted || function () { };
                    s.events.onVoiceCommandListeningEnded = s.events.onVoiceCommandListeningEnded || function () { };

                    return new implementation(s, p);
                }
            }
        }

    };
};
},{}],13:[function(require,module,exports){
talkify = talkify || {};

talkify.SpeechCommands = function (speechCommandConfig) {
    if (!speechCommandConfig.enabled || !window.webkitSpeechRecognition) {
        var noop = function () { };

        return {
            onPrevious: noop,
            onNext: noop,
            onPlayPause: noop,
            start: noop,
            onListeningStarted: noop,
            onListeningEnded: noop,
            dispose: noop
        }
    }
    
    var SpeechRecognition = window.webkitSpeechRecognition;

    var isListening = false;
    var onNextCallback = function () { };
    var onPreviousCallback = function () { };
    var onPlayPauseCallback = function () { };
    var onListeningStartedCallback = function () { };
    var onListeningEndedCallback = function () { };

    var recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        isListening = true;
        onListeningStartedCallback();
    }

    recognition.onresult = function (event) {
        var transcript = event.results[event.results.length - 1][0].transcript;

        var matchingCommandName = evaluate(transcript, speechCommandConfig.commands);

        if (speechCommandConfig.commands[matchingCommandName] === speechCommandConfig.commands.playPause) {
            onPlayPauseCallback();
        } else if (speechCommandConfig.commands[matchingCommandName] === speechCommandConfig.commands.next) {
            onNextCallback();
        } else if (speechCommandConfig.commands[matchingCommandName] === speechCommandConfig.commands.previous) {
            onPreviousCallback();
        }
    }

    recognition.onspeechend = function () {
        recognition.stop();
        isListening = false;
        onListeningEndedCallback();
    }

    function evaluate(transcript, commands) {
        var wordsInTranscript = transcript.split(' ');
        var possibleMatches = [];

        for (var key in commands) {
            if (!commands.hasOwnProperty(key)) {
                continue;
            }

            var phrases = speechCommandConfig.commands[key];

            for (var i = 0; i < phrases.length; i++) {
                if (phrases[i].toLowerCase() === transcript) {
                    //exact match
                    return key;
                }

                var match = phrases[i].split(' ').filter(function (word) {
                    return wordsInTranscript.indexOf(word.toLowerCase()) > -1;
                })[0];

                //any word in phrase mathes
                if (match) {
                    possibleMatches.push(key);
                    break;
                }
            }
        }

        if (possibleMatches.length > 0) {
            var bestValue = 0;
            var bestCommand = null;

            for (var j = 0; j < possibleMatches.length; j++) {
                var temp = Math.max.apply(Math,
                    speechCommandConfig.commands[possibleMatches[j]].map(function (phrase) {
                        return levenshtein(phrase, transcript);
                    }));

                if (temp > bestValue) {
                    bestValue = temp;
                    bestCommand = possibleMatches[j];
                }
            }

            return bestCommand;
        }

        return null;

    }

    function levenshtein(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    if (speechCommandConfig.keyboardActivation.enabled) {
        document.addEventListener("keyup",
            function (e) {
                if (!e.ctrlKey) {
                    return;
                }

                if (isListening) {
                    return;
                }

                var key = e.keyCode ? e.keyCode : e.which;

                if (key === speechCommandConfig.keyboardActivation.key) {
                    recognition.start();
                }
            });
    }

    return {
        onPrevious: function (callback) {
            onPreviousCallback = callback;
        },
        onNext: function (callback) {
            onNextCallback = callback;
        },
        onPlayPause: function (callback) {
            onPlayPauseCallback = callback;
        },
        start: function () {
            if (isListening) {
                return;
            }

            recognition.start();
        },
        onListeningStarted: function (callback) {
            onListeningStartedCallback = callback;
        },
        onListeningEnded: function (callback) {
            onListeningEndedCallback = callback;
        },
        dispose: function () {}
    }
};
},{}],14:[function(require,module,exports){
talkify = talkify || {};
talkify.textextractor = function () {
    var validElements = [];

    var inlineElements = ['a', 'span', 'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'a', 'bdo', 'q', 'sub', 'sup', 'label'];
    var forbiddenElementsString = ['img', 'map', 'object', 'script', 'button', 'input', 'select', 'textarea', 'br', 'style', 'code', 'nav', '#nav', '#navigation', '.nav', '.navigation', 'footer', 'rp', 'rt'];
    var userExcludedElements = [];

    function getVisible(elements) {
        var result = [];

        for (var j = 0; j < elements.length; j++) {
            if (!isVisible(elements[j])) {
                continue;
            }

            result.push(validElements[j]);
        }

        return result;
    }

    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    function getStrippedText(text) {
        return text.replace(/(\r\n|\n|\r)/gm, "").trim();
    }

    function isValidTextNode(node) {
        if (!node) {
            return false;
        }

        if (node.nodeType === 3) {
            return getStrippedText(node.textContent).length >= 10;
        }

        return false;
    }

    function isValidAnchor(node) {
        var nrOfSiblings = getSiblings(node);

        if (nrOfSiblings.length >= 1) {
            return true;
        }

        var previous = node.previousSibling;

        if (isValidTextNode(previous)) {
            return true;
        }

        if (isValidTextNode(node.nextSibling)) {
            return true;
        }

        return false;
    }

    function isValidForGrouping(node) {
        var isTextNode = node.nodeType === 3;
        var textLength = getStrippedText(node.textContent).length;

        return (isTextNode && textLength >= 5) || (!isForbidden(node) && elementIsInlineElement(node));
    }

    function getConnectedElements(nodes, firstIndex) {
        var connectedElements = [];

        for (var l = firstIndex; l < nodes.length; l++) {
            if (isValidForGrouping(nodes[l])) {
                connectedElements.push(nodes[l]);
            } else {
                break;
            }
        }

        return connectedElements;
    }

    function group(elements) {
        //TODO: wrap in selectable element
        wrapping = document.createElement('span');
        wrapping.classList.add("superbar");

        for (var j = 0; j < elements.length; j++) {
            wrapping.appendChild(elements[j].cloneNode(true));
        }

        return wrapping;
    }

    function wrapInSelectableElement(node) {
        wrapping = document.createElement('span');
        wrapping.classList.add("foobar");
        wrapping.innerText = node.textContent;
        return wrapping;
    }

    function wrapAndReplace(node) {
        var spanElement = wrapInSelectableElement(node);

        if (node.parentNode) {
            node.parentNode.replaceChild(spanElement, node);
        }

        return spanElement;
    }

    function evaluate(nodes) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (elementIsParagraphOrHeader(node)) {
                validElements.push(node);
                continue;
            }

            if (getForbiddenElements().indexOf(getSafeTagName(node).toLowerCase()) !== -1) {
                var forcedElement = (node.nodeType === 1 ? node : node.parentNode).querySelectorAll('h1, h2, h3, h4');

                for (var k = 0; k < forcedElement.length; k++) {
                    validElements.push(forcedElement[k]);
                }

                continue;
            }

            if (getSafeTagName(node).toLowerCase() === 'a' && !isValidAnchor(node)) {
                continue;
            }

            var connectedElements = getConnectedElements(nodes, i);

            if (connectedElements.length > 1) {
                var wrapping = group(connectedElements);
                var isAboveThreshold = getStrippedText(wrapping.innerText).length >= 20;

                if (isAboveThreshold) {
                    nodes[i].parentNode.replaceChild(wrapping, nodes[i]);

                    for (var j = 0; j < connectedElements.length; j++) {
                        var parentNode = connectedElements[j].parentNode;

                        if (!parentNode) {
                            continue;
                        }

                        connectedElements[j].parentNode.removeChild(connectedElements[j]);
                    }

                    validElements.push(wrapping);

                    continue;
                }
            }

            if (isValidTextNode(node)) {
                validElements.push(wrapAndReplace(node));
            }

            evaluate(node.childNodes);
        }
    }

    function extract(rootSelector, exclusions) {
        userExcludedElements = exclusions || [];
        validElements = [];

        var topLevelElements = document.querySelectorAll(rootSelector + ' > ' + generateExcludesFromForbiddenElements());

        var date = new Date();

        for (var i = 0; i < topLevelElements.length; i++) {
            var element = topLevelElements[i];

            if (elementIsParagraphOrHeader(element)) {
                validElements.push(element);

                continue;
            }

            evaluate(topLevelElements[i].childNodes);
        }

        var result = getVisible(validElements);

        return result;
    }

    function generateExcludesFromForbiddenElements() {
        var result = '*';

        var forbiddenElements = getForbiddenElements();

        for (var i = 0; i < forbiddenElements.length; i++) {
            result += ':not(' + forbiddenElements[i] + ')';
        }

        return result;
    }

    function elementIsParagraphOrHeader(element) {
        if (element.nodeType === 3) {
            return false;
        }

        return ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(getSafeTagName(element).toLowerCase()) != -1;
    }

    function elementIsInlineElement(element) {
        if (element.nodeType === 3) {
            return false;
        }

        return inlineElements.indexOf(getSafeTagName(element).toLowerCase()) != -1;
    }

    function getSafeTagName(node) {
        return node.tagName || '';
    }

    function getChildren(n, skipMe) {
        var r = [];
        for (; n; n = n.nextSibling)
            if (n.nodeType == 1 && n != skipMe && !isForbidden(n))
                r.push(n);
        return r;
    };

    function getSiblings(n) {
        if (!n) {
            return [];
        }

        return getChildren(n.parentNode.firstChild, n);
    }

    function getForbiddenElements() {
        return forbiddenElementsString.concat(userExcludedElements);
    }

    function isForbidden(node) {
        return getForbiddenElements().indexOf(getSafeTagName(node).toLowerCase()) !== -1;
    }

    return {
        extract: extract
    };
};
},{}],15:[function(require,module,exports){
talkify = talkify || {};

talkify.generateGuid = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

talkify.log = function(){
    if(talkify.config.debug){
        console.log.apply(console, arguments);
    }
}


},{}],16:[function(require,module,exports){
talkify = talkify || {};
talkify.wordHighlighter = function (correlationId) {
    var currentItem = null;
    var currentPositions = [];

    talkify.messageHub.subscribe("word-highlighter", correlationId + ".player.tts.seeked", setPosition);
    talkify.messageHub.subscribe("word-highlighter", [correlationId + ".player.tts.loading", correlationId + ".player.tts.disposed", correlationId + ".player.tts.ended"], cancel);
    talkify.messageHub.subscribe("word-highlighter", correlationId + ".player.tts.play", function (message) {
        setupWordHightlighting(message.item, message.positions);
    });

    talkify.messageHub.subscribe("word-highlighter", correlationId + ".player.tts.timeupdated", function (timeInfo) {
        if (!currentPositions.length) {
            return;
        }

        var time = timeInfo.currentTime * 1000;

        var currentPos = 0;

        if (time < currentPositions[0].Position) {
            highlight(currentItem, currentPositions[0].Word, currentPositions[0].CharPosition);
            return;
        }

        for (var i = 0; i < currentPositions.length; i++) {
            if (i === currentPositions.length - 1) {
                currentPos = i;
                break;
            }

            var position = currentPositions[i].Position;

            if (time >= position && time <= currentPositions[i + 1].Position) {
                currentPos = i;
                break;
            }
        }

        highlight(currentItem, currentPositions[currentPos].Word, currentPositions[currentPos].CharPosition);
    });

    function highlight(item, word, charPosition) {
        resetCurrentItem();

        currentItem = item;
        var text = item.element.innerText.trim();

        var sentence = findCurrentSentence(item, charPosition);

        item.element.innerHTML =
            text.substring(0, sentence.start) +
            '<span class="talkify-sentence-highlight">' +
            text.substring(sentence.start, charPosition) +
            '<span class="talkify-word-highlight">' +
            text.substring(charPosition, charPosition + word.length) +
            '</span>' +
            text.substring(charPosition + word.length, sentence.end) +
            '</span>' +
            text.substring(sentence.end);
    }

    function cancel() {
        resetCurrentItem();

        currentPositions = [];
    }

    function setupWordHightlighting(item, positions, startFrom) {
        cancel();

        if (!positions.length) {
            return;
        }

        currentPositions = positions;

        var i = startFrom || 0;

        var internalCallback = function () {
            highlight(item, positions[i].Word, positions[i].CharPosition);

            i++;

            if (i >= positions.length) {
                window.setTimeout(function () {
                    item.element.innerHTML = item.originalElement.innerHTML;

                    talkify.messageHub.publish(correlationId + ".wordhighlighter.complete", item);
                }, 1000);

                return;
            }
        };

        internalCallback();
    }

    function resetCurrentItem() {
        if (currentItem) {
            currentItem.element.innerHTML = currentItem.originalElement.innerHTML;
        }
    }

    function setPosition(time) {
        var diff = 0;
        var timeInMs = time * 1000;
        var nextPosition = 0;

        for (var i = 0; i < currentPositions.length; i++) {
            var pos = currentPositions[i];

            if (pos.Position < timeInMs) {
                continue;
            }

            diff = pos.Position - timeInMs;
            nextPosition = i;

            break;
        }

        var item = currentItem;
        var positions = currentPositions;

        cancel();

        setTimeout(function () {
            setupWordHightlighting(item, positions, nextPosition);
        }, diff);
    }

    function findCurrentSentence(item, charPosition) {
        var text = item.element.innerText.trim();
        var result = text.match(/[^\.!\?]+[\.!\?]+/g) || [];

        var charactersTraversed = 0;
        var sentenceStart = 0;
        var sentenceEnd = text.length;

        for (var i = 0; i < result.length; i++) {
            if (charPosition >= charactersTraversed && charPosition <= charactersTraversed + result[i].length) {
                if (charactersTraversed > 0) {
                    sentenceStart = charactersTraversed + 1;
                }

                sentenceEnd = charactersTraversed + result[i].length;
                break;
            }

            charactersTraversed += result[i].length;
        }

        return {
            start: sentenceStart,
            end: sentenceEnd
        };
    }

    function dispose() {
        talkify.messageHub.unsubscribe("word-highlighter", correlationId + ".player.tts.seeked");
        talkify.messageHub.unsubscribe("word-highlighter", [correlationId + ".player.tts.loading", correlationId + ".player.tts.disposed"]);
        talkify.messageHub.unsubscribe("word-highlighter", correlationId + ".player.tts.play");
        talkify.messageHub.unsubscribe("word-highlighter", correlationId + ".player.tts.timeupdated");
    }

    return {
        start: setupWordHightlighting,
        highlight: highlight,
        dispose: dispose
    };
};
},{}],17:[function(require,module,exports){
talkify = {};
},{}]},{},[1]);
