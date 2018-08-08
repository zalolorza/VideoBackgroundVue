'use strict';

 //bytes (not bits)

import { isPhone } from './_mobileDetect'

var imageAddr = null;
var downloadSize = null;
var image = false;

export function GetTestImage(){
    if(image) return image;
    var cacheBuster = "&c=" + (new Date()).getTime();
    image = imageAddr + cacheBuster;
    return image;
}

export function GetBandwidth(){
    if(typeof window.speedMbps == 'undefined') {
        new Error('SpeedMps not defined yet')
    } else {
        return window.speedMbps
    }
}

export function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();


        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        
        if(isPhone() && speedMbps > 5) {
            speedMbps = 5;
        }

        window.speedMbps = speedMbps;

        var event; // The custom event that will be created

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent("ConnectionCheck", true, true);
        } else {
            event = document.createEventObject();
            event.eventType = "ConnectionCheck";
        }

        event.eventName = "ConnectionCheck";

        if (document.createEvent) {

            window.dispatchEvent(event);
        } else {
            window.fireEvent("on" + event.eventType, event);
        }
    }
    
    download.onerror = function (err, msg) {
        console.log(err);
    }
    
    startTime = (new Date()).getTime();
    

    download.src = GetTestImage();
    
}

export function SetFallbackImage(fallbackImage) {
    imageAddr = fallbackImage.src;
    downloadSize = parseInt(fallbackImage.size);
}; 

export function InitiateSpeedDetection() {
    window.setTimeout(function(){
        MeasureConnectionSpeed();
    }, 1);
};   