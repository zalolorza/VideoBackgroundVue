
<template>
    <div id="videoBackground" :class=" settings.fit ">
        <div class="video">
            <video :if="canRender" width="100%" height="100%" id="videoBackground-player" autoplay :src="videoFile" muted webkit-playsinline playsinline loop :poster="poster" :type="videoFormat"></video>
        </div>
        <div id="mask"></div>
    </div>
</template>

<script>

import { SetFallbackImage, InitiateSpeedDetection,  GetTestImage as GetBandwithTestImage } from './_bandwith'
import { GetBitrate, GetFile as GetVideoFile, getLowerResolutionFile } from './_bitrates'
import enableInlineVideo from 'iphone-inline-video'
import { GetFormat } from './_videotest'

import _ from 'lodash'

export default {
  name: 'VideoBackground',

  props: ['videos', 'fallbackImage', 'multipleBitRate', 'fit'],

  data() {

    return {
        videoIsMounted: false,
        isPlaying: false,
        canRender: false,
        settings:{
            multipleBitRate: true,
            fit: "contain",
            width:16,
            height:9
        }
    }
  },

  computed: {

      videoFile(){
        if(this.canRender && this.settings.multipleBitRate){
              return GetVideoFile();
          } else {
              return this.settings.videos[GetFormat()];
          }
      },
      poster(){
        return GetBandwithTestImage();
      },
      videoFormat(){
        return 'video/'+GetFormat();
      }
  },
  
  methods: {

       fadeOut(el){
            el.style.opacity = 1;

            (function fade() {
            if ((el.style.opacity -= .02) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
            })();
        },

      resize(){
          if(this.settings.fit == 'cover'){
                var ratioContainer = window.innerWidth / window.innerHeight;
                var ratioVideo = this.settings.width / this.settings.height;

                var $videoElem = this.$el.querySelector('.video');

                if(ratioVideo > ratioContainer){
                    $videoElem.style.height = window.innerHeight +'px';
                    $videoElem.style.width = window.innerHeight * ratioVideo +'px';
                } else {
                    $videoElem.style.width = '100%';
                    $videoElem.style.height = window.innerWidth / ratioVideo + 'px';
                }

          }
      },

      renderPlayer(){
          if(this.settings.multipleBitRate) {
              GetBitrate(this.settings.videos);
          }
          this.canRender = true;
      },

      init(){

        if(!this.settings.multipleBitRate) {
            renderPlayer();
            return;
        }

        
        if(document.readyState == 'complete'){
              InitiateSpeedDetection();
          }
          if (window.addEventListener) {
              window.addEventListener('ConnectionCheck', this.renderPlayer, false);
              if(document.readyState != 'complete'){
                    window.addEventListener('load', InitiateSpeedDetection, false);
              }
          } else if (window.attachEvent) {
              window.attachEvent('ConnectionCheck', this.renderPlayer);
              if(document.readyState != 'complete'){
                    window.attachEvent('onload', InitiateSpeedDetection);
              }
          }
      },
       mountVideo(){
          this.videoIsMounted = true;
          var supportsVideo = !!document.createElement('video').canPlayType;
          
          var self = this;

          this.video = this.$el.querySelector('video');
          
          this.video.controls = false;
          this.video.muted = true;

          self.resize();
        
          window.onresize = _.debounce(self.resize, 200);
        
          
          enableInlineVideo(this.video, {iPad: true});
       
          this.stop();

          this.onCanplay(function(){
                if (self.isPlaying) return;
           
                 if (document.createEvent) {
                        event = document.createEvent("HTMLEvents");
                        event.initEvent("videoCanPlay", true, true);
                    } else {
                        event = document.createEventObject();
                        event.eventType = "videoCanPlay";
                    }
                event.eventName = "videoCanPlay";

                if (document.createEvent) {

                    window.dispatchEvent(event);
                } else {
                    window.fireEvent("on" + event.eventType, event);
                }
                
                self.isPlaying = true;
                clearTimeout(self.isNetworkSlow);
                self.$el.style.opacity = 1;
                self.fadeOut(document.querySelector('#mask'));
          });
          
          setTimeout(function(){
              self.play();
              self.isNetworkSlow = setTimeout(function(){
                  if(!self.isPlaying){
                    self.networkIsTooSlow();
                  }
              },1000);
          },100);    
      },
      onCanplay(callback){
          this.video.oncanplaythrough = function(){
              callback();
          }
          if (this.video.readyState > 3) {
              callback();
          }
      },
      play(){
          if (this.video.paused || this.video.ended) this.video.play();
      },
      pause(){
        if (!(this.video.paused || this.video.ended)) this.video.pause();
      },
      stop(){
        this.video.pause();
        this.video.currentTime = 0;
      },
      networkIsTooSlow(){
          
        this.stop();
        this.video.setAttribute('src',getLowerResolutionFile());
        this.video.load();
        this.play();
   
      },
  },
  beforeMount(){
        this.settings = Object.assign({},  this.settings, this.$props);
        SetFallbackImage(this.settings.fallbackImage);
  },
  mounted(){
      Object.assign({}, this.default, this.config)
      this.init();
  },
  updated(){
    if(!this.videoIsMounted && this.canRender){
       this.mountVideo();
    }
  },
}
</script>

<style lang="scss">

  @import './css3-mixins';

    #videoBackground {
      
      opacity:0;
      position:fixed;
        width:100%;
        height:100%;
      max-width: none;
      height:auto;
      background: black;
      min-height:100%;
      min-width: 100%;
      top:0;
      left:0;
      overflow: hidden;
      z-index: 0;

      .video {
            position:absolute;
             top:50%;
            left:50%;
             @include transform(translate3d(-50%,-50%,0));
             display:block;
             video {
               max-width: 100% !important;
               max-height: 100% !important;
              height:100%;
              width:100%;
             }
        }

      &.cover {
          
          .video {
              min-height:100%;
                min-width: 100%;
              
          }
      }

     
 
  }

  .IIV::-webkit-media-controls-play-button,
      .IIV::-webkit-media-controls-start-playback-button {
          opacity: 0;
          pointer-events: none;
          width: 5px;
      }


      #mask {
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index: 10;
            background:rgb(15,15,15);
        }

</style>
