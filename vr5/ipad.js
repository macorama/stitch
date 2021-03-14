
var rotY = 0;
var rotX = 0;
var activeTouchId = 0;
var lastX;
var lastY;
var scalesum = 500;
var escalelast = 1;
var firstTouch = false;
var firstSound = false;
var directionalSound = false;
var soundSourcePan = 120;
var firstRotate = false;
var firstSlide = true;
var gorotate;
var goLeft = true;
var limit1y;
var limit2y;
var limit3y;
var startx;
var starty;
var doLog;
var limit1x;
var limit2x;
var limit3x;
var hasContent;
var hasDescription;
var visDescription;
var infoTx;
var infoTy;
var infoT;
var verticalArea;
var toolBarWidth;
var autoOn;
var appMode;
var autoDeley = autoRotateDelay * 1000;
var rotateTimerId = 0;
var timer_is_on = false;
window.onload = function initialLoad() {
    document.bgColor = bgdColor;
    if (vrTitle == null) {
        vrTitle = "";
    }
    if (vrSubTitle == null) {
        vrSubTitle = "";
    }
    if (vrDescription == null) {
        vrDescription = "";
    }
    if (startZoom == null) {
        startZoom = 0;
    }
    if (startTilt == null) {
        startTilt = 0;
    }
    if (startPan == null) {
        startPan = 0;
    }
    if (startPan == null) {
        startPan = 0;
    }
    updateOrientation();
    checkAppMode();
    if (!appMode) {
        document.body.setAttribute("class", "appMode");
    } else {
        document.body.setAttribute("class", "");
    }
    document.title = vrTitle;
    window.scrollTo(0, 1);
    setView(startZoom, startTilt, -startPan);
    if (vrSubTitle.length > 0 || vrDescription.length > 0) {
        setContent(vrTitle, vrSubTitle, vrDescription);
        document.getElementById("info").removeAttribute("class");
        hasContent = true;
    } else {
        hasContent = false;
    }
    if (vrDescription.length > 0) {
        hasDescription = true;
        visDescription = true;
    } else {
        hasDescription = false;
        visDescription = false;
    }
    if (navigator.onLine) {
        //addStats();
    } else {
        enableSound = false;
    }
    if (enableAutoButton && enableSound) {
        toolBarWidth = 120;
    } else if (enableAutoButton || enableSound) {
        toolBarWidth = 65;
    } else {
        toolBarWidth = 0;
    }
    if (!enableAutoButton) {
        var hideauto = document.getElementById("auto_holder");
        hideauto.parentNode.removeChild(hideauto);
        autoOn = true;
    } else {
        autoOn = false;
    }
    if (!enableSound) {
        var hidesnd = document.getElementById("sound_holder");
        hidesnd.parentNode.removeChild(hidesnd);
        var removeAudio = document.getElementsByTagName("audio")[0];
        removeAudio.parentNode.removeChild(removeAudio);
    } else {
        var listenToAudio = document.getElementsByTagName("audio")[0];
        listenToAudio.load();
    }
    if (autoRotateOnStart) {
        rotateTimerId = setTimeout("autoRot()", autoDeley);
    }
    document.getElementById("controls_holder").removeAttribute("class");
    showVR();
    setTouchArea();
    updateIcon();
};

function updateOrientation() {
    var contentType = "show_";
    contentType += getOrientation();
    document.getElementById("page_wrapper").setAttribute("class", contentType);
    window.scrollTo(0, 1);
    setTouchArea();
    updateIcon();
    clearOfllineInfo();
    postaviPoruku();
}
function getOrientation() {
    switch (window.orientation) {
    case 0:
        return "vert";
        break;
    case -90:
        return "hor";
        break;
    case 90:
        return "hor";
        break;
    case 180:
        return "vert";
        break;
    default:
        ;
    }
}
function showVR() {
    var ctrlarea = document.getElementById("toucharea");
    if (navigator.platform != "iPad") {
        ctrlarea.parentNode.removeChild(ctrlarea);
        var infoarea = document.getElementById("info");
        infoarea.parentNode.removeChild(infoarea);
        var controlsarea = document.getElementById("controls_holder");
        controlsarea.parentNode.removeChild(controlsarea);
        return;
    }
    ctrlarea.addEventListener("touchstart", startTouch, false);
    ctrlarea.addEventListener("touchmove", moveTouch, false);
    ctrlarea.addEventListener("touchend", endTouch, false);
    ctrlarea.addEventListener("touchcancel", cancelTouch, false);
    ctrlarea.addEventListener("gesturestart", onGestureStart, false);
    ctrlarea.addEventListener("gesturechange", onGestureChange, true);
    ctrlarea.addEventListener("gestureend", onGestureEnd, true);
    document.addEventListener("touchstart", startTouch, false);
    document.addEventListener("touchmove", moveTouch, false);
    document.addEventListener("touchend", endTouch, false);
    document.addEventListener("touchcancel", cancelTouch, false);
    document.addEventListener("gesturestart", onGestureStart, false);
    document.addEventListener("gesturechange", onGestureChange, true);
    document.addEventListener("gestureend", onGestureEnd, true);
    var loadingE = document.getElementById("loading");
    loadingE.parentNode.removeChild(loadingE);
    document.getElementById("cubes").setAttribute("class", "visible");
}
function setView(startZoom, startPan, startTilt) {
    scalesum = startZoom * 500;
    rotateByTouch(0, 0, 5 * startTilt, 5 * startPan);
    var esa = document.getElementById("cubeholder");
    esa.style.webkitPerspective = scalesum;
}
function setContent(vrTitle, vrSubTitle, vrDescription) {
    document.getElementById("title").innerHTML = vrTitle;
    document.getElementById("subtitle").innerHTML = vrSubTitle;
    if (vrDescription.length > 0) {
        document.getElementById("description").innerHTML = vrDescription;
    } else {
        var descTxt = document.getElementById("description");
        descTxt.parentNode.removeChild(descTxt);
    }
    var infoElement = document.getElementById("info");
    var infoHeight = infoElement.offsetHeight;
    var windowHeight = getWindowHeight();
    if (getOrientation() == "hor") {
        if (appMode) {
            verticalArea = 1024 - infoHeight + 10;
            infoElement.style.top = verticalArea + "px";
        } else {
            verticalArea = 1024 - (768 - windowHeight) - infoHeight + 10;
            infoElement.style.top = verticalArea + "px";
        }
    } else {
        verticalArea = windowHeight - infoHeight + 20;
        infoElement.style.top = verticalArea + "px";
    }
}
function getWindowHeight() {
    var windowHeight = 0;
    if (typeof window.innerHeight == "number") {
        windowHeight = window.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body && document.body.clientHeight) {
                windowHeight = document.body.clientHeight;
            }
        }
    }
    return windowHeight;
}
function getWindowWidth() {
    var windowWidth = 0;
    if (typeof window.innerWidth == "number") {
        windowWidth = window.innerWidth;
    } else {
        if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            if (document.body && document.body.clientWidth) {
                windowWidth = document.body.clientWidth;
            }
        }
    }
    return windowWidth;
}
function setTouchArea() {
    limit1y = 65;
    if (getOrientation() == "hor") {
        limit1x = 1024 - toolBarWidth;
    } else {
        limit1x = 768 - toolBarWidth;
    }
    if (enableAutoButton && enableSound) {
        limit1xS = limit1x + 55;
        limit1xM = limit1x;
    } else if (enableAutoButton && !enableSound) {
        limit1xS = limit1x + 55;
        limit1xM = limit1x;
    } else if (!enableAutoButton && enableSound) {
        limit1xS = limit1x;
        limit1xM = limit1x + 55;
    } else {
        limit1xS = limit1x;
        limit1xM = limit1x;
    }
    limit2x = 0;
    if (getOrientation() == "hor") {
        var windowHeight = getWindowHeight();
        limit2y = windowHeight;
        limit3x = 924;
    } else {
        if (hasContent == true) {
            limit2y = verticalArea + 20;
        } else {
            limit2y = getWindowHeight() - 10;
        }
        limit3x = 668;
    }
    limit3y = limit2y - 75;
    if (hasDescription && !visDescription && getOrientation() == "vert") {
        var slideTop = getWindowHeight() - 100;
        limit2y = slideTop + 20;
        limit3y = limit2y - 75;
    }
    return;
}
function checkTouchArea(TouchX, TouchY) {
    infoT = false;
    if (enableSound && TouchX > limit1xS && TouchY < limit1y) {
        if (!firstSound) {
            prikaziPoruku("Please wait...");
        }
        if (enableAutoButton) {
            if (!autoOn) {
                toggleAutoSet();
                autoOn = true;
            }
        }
        playPause();
        return false;
    } else if (enableAutoButton && TouchX > limit1xM && TouchX < limit1xS && TouchY < limit1y) {
        toggleAuto();
        if (!firstRotate) {
            firstRotate = true;
        }
        return false;
    } else if (TouchX > limit3x && TouchY > limit3y && TouchY < limit2y && useLogo) {
        if (enableAutoButton) {
            if (!autoOn) {
                toggleAutoSet();
                autoOn = true;
            }
        }
        openIVRpage();
        return false;
    } else if (TouchX > limit2x && TouchY > limit2y) {
        infoTx = TouchX;
        infoTy = TouchY;
        infoT = true;
        return false;
    } else {
        return true;
    }
}
function startTouch(e) {
    if (!firstTouch) {
        firstTouch = true;
        firstTouch = true;
        if (enableAutoButton) {
            document.getElementById("auto_btn").removeAttribute("class");
            document.getElementById("auto_btn").setAttribute("class", "on");
        }
        if (enableSound) {
            document.getElementById("sound_btn").removeAttribute("class");
            document.getElementById("sound_btn").setAttribute("class", "on");
        }
    }
    startx = e.targetTouches[0].clientX;
    starty = e.targetTouches[0].clientY;
    clearOfllineInfo();
    if (timer_is_on) {
        timer_is_on = false;
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
    }
    if (autoRotateOnIdle) {
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
        timer_is_on = true;
        rotateTimerId = setTimeout("autoRot()", autoDeley);
    }
    if (checkTouchArea(startx, starty)) {
        e.preventDefault();
        activeTouchId = e.changedTouches[0].identifier;
        lastX = e.changedTouches[0].pageX;
        lastY = e.changedTouches[0].pageY;
        if (enableAutoButton) {
            if (!autoOn) {
                toggleAutoSet();
                autoOn = true;
            }
        }
    } else {
        e.preventDefault();
        return;
    }
}
function moveTouch(e) {
    e.preventDefault();
    if (activeTouchId) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier == activeTouchId) {
                var t = e.changedTouches[i];
                if (t.pageY < limit2y - 10) {
                    rotateByTouch(lastX, lastY, t.pageX, t.pageY);
                    lastX = t.pageX;
                    lastY = t.pageY;
                }
                break;
            }
        }
    }
}
function endTouch(e) {
    e.preventDefault();
    var lastInfoX = e.changedTouches[0].pageX;
    var lastInfoY = e.changedTouches[0].pageY;
    var infoElement = document.getElementById("info");
    if (infoT && hasDescription) {
        var razX = Math.abs(infoTx - lastInfoX);
        var razY = infoTy - lastInfoY;
        if (razX < 50 && razY < 0 && visDescription) {
            var slideTop = getWindowHeight() - 100;
            infoElement.style.top = slideTop + "px";
            limit2y = slideTop + 20;
            visDescription = false;
            limit3y = limit2y - 75;
            firstSlide = false;
            setTimeout("updateIcon()", 300);
        } else if (razX < 50 && razY > 0 && !visDescription) {
            infoElement.style.top = verticalArea + "px";
            limit2y = verticalArea + 20;
            visDescription = true;
            limit3y = limit2y - 75;
            firstSlide = false;
            updateIcon();
        } else if (visDescription && firstSlide) {
            prikaziPoruku("Slide description DOWN to hide it");
            firstSlide = true;
        } else if (!visDescription && firstSlide) {
            prikaziPoruku("Slide description UP to show it");
            firstSlide = true;
        }
    }
    if (e.targetTouches.length > 0) {
        return false;
    }
}
function cancelTouch(e) {
    activeTouchId = 0;
}
function rotateByTouch(lastX, lastY, curX, curY) {
    var e = document.getElementById("cubes");
    if (!e) {
        return;
    }
    rotY -= (curX - lastX) * 0.2;
    rotX += (curY - lastY) * 0.2;
    if (useLimits) {
        if (rotY <= leftLimit || rotY >= rightLimit || rotX <= BottomLimit || rotX >= TopLimit) {
            prikaziPoruku("PANO Limit");
        }
        rotY = Math.max(leftLimit, Math.min(rightLimit, rotY));
        rotX = Math.max(BottomLimit, Math.min(TopLimit, rotX));
    }
    rotX = Math.max(-90, Math.min(90, rotX));
    setCurView(scalesum, rotX, rotY);
}
function setCurView(scalesum, rotX, rotY) {
    if (enableSound && directionalSound && soundSourcePan > -361 && soundSourcePan < 361 && !(document.getElementsByTagName("audio")[0].paused || document.getElementsByTagName("audio")[0].stopped)) {
        var soundAngle = Math.round(Math.abs(rotY) - Math.floor(Math.abs(rotY) / 360) * 360) * (rotY / Math.abs(rotY));
        var myAudio = document.getElementsByTagName("audio")[0];
        if (soundSourcePan < 0) {
            soundSourcePan = 360 + soundSourcePan;
        }
        if (soundAngle < 0) {
            soundAngle = 360 + soundAngle;
        }
        var relAngle = Math.abs(soundSourcePan - soundAngle);
        if (relAngle > 180) {
            relAngle = 360 - relAngle;
        }
        var soundVolume = 1 - Math.round(relAngle / 18) / 10;
        soundVolume = soundVolume.toFixed(1);
        soundVolume = Math.min(Math.max(soundVolume, 0), 1);
        soundVolume = soundVolume + "";
        myAudio.volume = soundVolume;
    }
    var k = document.getElementById("cubes");
    k.style.webkitTransform = "translateZ(" + scalesum + "px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
}
function onGestureStart(e) {
    if (timer_is_on) {
        timer_is_on = false;
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
    }
    if (autoRotateOnIdle) {
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
        timer_is_on = true;
        rotateTimerId = setTimeout("autoRot()", autoDeley);
    }
    if (checkTouchArea(lastX, lastY)) {
        e.preventDefault();
        if (enableAutoButton) {
            if (!autoOn) {
                toggleAutoSet();
                autoOn = true;
            }
        }
    } else {
        e.preventDefault();
        return;
    }
}
function onGestureChange(e) {
    e.preventDefault();
    var esa = document.getElementById("cubeholder");
    if (scalesum > 299 && scalesum < 701) {
        scalesum = (1 - (1 - e.scale) / 20) * scalesum;
        if (scalesum < 300 || scalesum > 700) {
            prikaziPoruku("ZOOM Limit");
        }
        scalesum = Math.round(Math.max(300, Math.min(700, scalesum)));
        esa.style.webkitPerspective = scalesum;
    }
}
function onGestureEnd(e) {
    escalelast = e.scale;
    e.preventDefault();
}
function stubOut(e) {
    e.preventDefault();
}
function playPause() {
    firstSound = true;
    var myAudio = document.getElementsByTagName("audio")[0];
    var playBtn = document.getElementById("sound_btn");
    if (myAudio.paused || myAudio.stopped) {
        playBtn.removeAttribute("class");
        playBtn.setAttribute("class", "off");
    } else {
        playBtn.removeAttribute("class");
        playBtn.setAttribute("class", "on");
    }
    doSound();
}
function doSound() {
    var myAudio = document.getElementsByTagName("audio")[0];
    if (myAudio.paused || myAudio.stopped) {
        myAudio.play();
        prikaziPoruku("Sound ON");
    } else {
        myAudio.pause();
        prikaziPoruku("Sound PAUSED");
    }
}
function toggleAuto() {
    autoRotateOnIdle = false;
    if (autoOn) {
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
        autoRot();
    } else {
        clearTimeout(rotateTimerId);
        clearInterval(gorotate);
        toggleAutoSet();
        autoOn = true;
    }
}
function toggleAutoSet() {
    var autoBtn = document.getElementById("auto_btn");
    if (firstTouch) {
        if (autoOn) {
            if (firstTouch) {
                prikaziPoruku("AutoRotate ON");
            }
            autoBtn.removeAttribute("class");
            autoBtn.setAttribute("class", "off");
        } else if (autoBtn != null) {
            if (firstTouch) {
                if (!firstRotate) {
                    prikaziPoruku("AutoRotate PAUSED");
                } else {
                    prikaziPoruku("AutoRotate OFF");
                }
            }
            autoBtn.removeAttribute("class");
            autoBtn.setAttribute("class", "on");
        }
    }
    return;
}
function openIVRpage() {
    if (navigator.onLine && !appMode && linkLogo) {
        var r = confirm(urlConfirm);
        if (r == true) {
            window.location = "http://" + linkLogoURL + "/";
        }
    } else if (useOfflineInfo) {
        showOfllineInfo();
    }
}
function checkAppMode() {
    if (window.navigator.standalone) {
        appMode = true;
    } else {
        appMode = false;
    }
    return;
}
function clearOfllineInfo() {
    document.getElementById("aaa").innerHTML = "";
}
function showOfllineInfo() {
    var nowWidth = getWindowWidth();
    var nowHeight = getWindowHeight();
    var winwidth = nowWidth + 2;
    var winheight = nowHeight + 2;
    var imgX = Math.round(nowWidth / 2) - 104;
    var imgY = Math.round(nowHeight / 2) - 120;
    document.getElementById("aaa").innerHTML = "<div style='top:0px;left:0px;width:" + winwidth + "px;height:" + winheight + "px;background-color: rgba(0,0,0,0.7);'><img style='top:" + imgY + "px;left:" + imgX + "px;'  src='../res/styling/offline.png'></div>";
}
function prikaziIcon(topPos, leftPos) {
    return "<img style='top:" + topPos + "px;left:" + leftPos + "px;'  src='../res/styling/logo-ipad.png'>";
}
function updateIcon() {
    if (useLogo) {
        var leftPos = limit3x + 10;
        if (getOrientation() == "hor") {
            var topPos = limit3y + 5;
            document.getElementById("bbb").innerHTML = prikaziIcon(topPos, leftPos);
        } else {
            var topPos = limit3y + 15;
            document.getElementById("bbb").innerHTML = prikaziIcon(topPos, leftPos);
        }
    }
}

function autoRot() {
    timer_is_on = true;
    clearInterval(gorotate);
    if (enableAutoButton) {
        toggleAutoSet();
        autoOn = false;
    }
    gorotate = setInterval("playRot()", 10);
    return;
}
function playRot() {
    if (timer_is_on) {
        scalesum = Math.round(scalesum * 100) / 100;
        rotX = Math.round(rotX * 100) / 100;
        rotY = Math.round(rotY * 100) / 100;
        if (useLimits) {
            if (rotY <= leftLimit + 2) {
                goLeft = false;
            } else if (rotY >= rightLimit - 2) {
                goLeft = true;
            }
        }
        if (!goLeft) {
            rotY += 0.05;
        } else {
            rotY -= 0.05;
        }
        if (rotX > 0.1) {
            rotX -= 0.1;
        } else if (rotX < -0.1) {
            rotX += 0.1;
        } else {
            rotX = 0;
        }
        if (scalesum > 501) {
            scalesum -= 1;
        } else if (scalesum < 499) {
            scalesum += 1;
        } else {
            scalesum = 500;
        }
        setCurView(scalesum, rotX, rotY);
        var esa = document.getElementById("cubeholder");
        esa.style.webkitPerspective = scalesum;
    } else {
        return;
    }
}
function prikaziPoruku(Tekst) {
    if (showNotifications) {
        var esa = document.getElementById("ddd");
        esa.innerHTML = Tekst;
        esa.style.opacity = "0.8";
        setTimeout("sakrijPoruku()", 1200);
    }
}
function prikaziPorukuDuze(Tekst) {
    var esa = document.getElementById("ddd");
    esa.innerHTML = Tekst;
    esa.style.opacity = "0.8";
    setTimeout("sakrijPoruku()", 3000);
}
function sakrijPoruku() {
    var esa = document.getElementById("ddd");
    esa.style.opacity = "0";
}
function postaviPoruku() {
    var esa = document.getElementById("ddd");
    var porX = Math.round(getWindowWidth() / 2) - 170;
    var porY = Math.round(getWindowHeight() / 2) - 60;
    esa.style.left = porX + "px";
    esa.style.top = porY + "px";
}
var cacheStatusValues = [];
cacheStatusValues[0] = "uncached";
cacheStatusValues[1] = "idle";
cacheStatusValues[2] = "checking";
cacheStatusValues[3] = "downloading";
cacheStatusValues[4] = "updateready";
cacheStatusValues[5] = "obsolete";
var cache = window.applicationCache;
//cache.addEventListener("updateready", logEvent, false);

function logEvent(e) {
    var online, status, type, message;
    online = navigator.onLine ? "yes" : "no";
    status = cacheStatusValues[cache.status];
    type = e.type;
    message = "online: " + online;
    message += ", event: " + type;
    message += ", status: " + status;
    if (type == "error" && navigator.onLine) {
        message += " (prolly a syntax error in manifest)";
        stopLog();
    }
    if (consoleLog) {
        console.log(message);
    }
    if (status == "idle") {
        stopLog();
        if (informWhenOfflineAvailable && (type == "cached" || type == "noupdate") && !appMode) {
            prikaziPorukuDuze("Panorama is available offline. <br/>Add Bookmark (+ sign)<br/>Add to Home Screen");
        }
    }
}

/*
window.applicationCache.addEventListener("updateready", function () {
    window.applicationCache.swapCache();
    console.log("swap cache has been called");
}, false);
doLog = setInterval(function () {
    cache.update();
}, 10000);

*/

if (!navigator.onLine) {
    stopLog();
}

function stopLog() {
    clearInterval(doLog);
    var cache = window.applicationCache;
    cache.removeEventListener("cached", logEvent, false);
    cache.removeEventListener("checking", logEvent, false);
    cache.removeEventListener("downloading", logEvent, false);
    cache.removeEventListener("error", logEvent, false);
    cache.removeEventListener("noupdate", logEvent, false);
    cache.removeEventListener("obsolete", logEvent, false);
    cache.removeEventListener("progress", logEvent, false);
    cache.removeEventListener("updateready", logEvent, false);
}
window.addEventListener("message", stacemo, false);

function stacemo(e) {
    var provera = e.data;
    if (provera == "opaopa") {
        var skidaj = document.getElementById("cubes");
        skidaj.parentNode.removeChild(skidaj);
        var metas = document.getElementsByTagName("head")[0];
        metas.parentNode.removeChild(metas);
    }
}