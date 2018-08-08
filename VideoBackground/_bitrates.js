'use strict';

import Closest from './_closest';
import { GetBandwidth } from './_bandwith'
import { GetFormat } from './_videotest'
import { isPhone, isHighDensity, isRetina, userAgent } from './_mobileDetect'

var videos = null;
var bitrate = null;
var resolution = null;
var file = null;
var format = GetFormat();


export function GetResolutions(){
    return Object.keys(videos[format]);
}

export function  GetResolution(){
    
    if(resolution != null) return limitResolution(resolution);
    var screenwith = window.screen.width;
    var screenHeight = window.screen.height;
    if(screenHeight > screenwith){
        screenwith = screenHeight;
    }


    if(isRetina()) screenwith*=2;
    else if(isHighDensity()) screenwith*=1.3;


    if(isPhone() && screenwith > 1920) screenwith = 1920;


    resolution = Closest(screenwith, GetResolutions());

    return limitResolution(resolution);
}

function limitResolution(resolution){

    var browser = userAgent();
    
    if(resolution > 1920 && browser!= 'safari' && browser!='chrome'){
        resolution = 1920;
    }

    return resolution;
}

export function GetBitrates(){
    return Object.keys(videos[format][GetResolution()]);
}

export function LowerResolution(){
    var resolutions = GetResolutions();
    var currentIndex = resolutions.indexOf(resolution);
    if(currentIndex > 0){
        resolution = resolutions[currentIndex-1];
        return true;
    } else {
        return false;
    }
}

export function IncreaseResolution(){
    var resolutions = GetResolutions();
    var currentIndex = resolutions.indexOf(resolution);
    if(currentIndex < resolutions[resolutions.length - 1]){
        resolution = limitResolution(resolutions[currentIndex+1]);
        return true;
    } else {
        return false;
    }
}

export function GetBitrate(videosOnServer){
    if(bitrate != null) return bitrate;
    videos = videosOnServer;
    var bitrates = GetBitrates();
    var bandwidth = GetBandwidth();

    if(isPhone() && bandwidth > 4) bandwidth = 4;

    bitrate = Closest(bandwidth, bitrates);
  
    if(bandwidth < parseInt(bitrates[0]) && LowerResolution()){
          
            bitrate = Closest(bandwidth, GetBitrates());
        
    } else if(bandwidth > parseInt(bitrates[bitrates.length - 1]) && IncreaseResolution()){
        
            bitrate = Closest(bandwidth, GetBitrates());
    }


    return bitrate;
}

export function ForceNewBitrate(){
    var bitrates = GetBitrates();
    bitrate = Closest(GetBandwidth(), bitrates);
    return bitrate;
}

export function getLowerResolutionFile(){
    file = null;

    if(LowerResolution()){
        ForceNewBitrate();
    }

    return GetFile();
}

export function GetFile(){
    if(file != null) return file;
    file = videos[format][GetResolution()][GetBitrate()];
    return file;
}

