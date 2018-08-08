'use strict';

var format = false;

export function ogg(){
    var elem = document.createElement('video'),
         bool = false;
    try {
         bool = !!elem.canPlayType;
         if ( bool ) {
              bool = new Boolean(bool);
              bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,'');
              if(bool.ogg == "maybe" || bool.ogg == "probably"){
                   bool = true;
              } else {
                   bool = false;
              }
         }
    } catch(e) { }
    return bool;
};

export function h264(){
    var elem = document.createElement('video'),
         bool = false;
    try {
         bool = !!elem.canPlayType;
         if ( bool ) {
              bool = new Boolean(bool);
              bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,'');
              if(bool.h264 == "maybe" || bool.h264 == "probably"){
                   bool = true;
              } else {
                   bool = false;
              }
         }
    } catch(e) { }
     return bool;
};

export function webm(codec){

    if(typeof codec == 'undefined'){
        var codec = 'vp8';
    }

    var elem = document.createElement('video'),
         bool = false;
     try {
         bool = !!elem.canPlayType;
         if ( bool ) {
              bool = new Boolean(bool);
              bool.webm = elem.canPlayType('video/webm; codecs="'+codec+'"').replace(/^no$/,'');
              if(bool.webm == "maybe" || bool.webm == "probably"){
                   bool = true;
              } else {
                   bool = false;
              }
         }
    } catch(e) { }
     return bool;
};

export function GetFormat(){

    if(format)           return format;
    else if(webm('vp9')) format = 'webm';
    else if(h264())      format = 'mp4'; 
    else if(webm('vp8')) format = 'webm';
    else if(ogg())       format = 'ogg';

    return format;

}