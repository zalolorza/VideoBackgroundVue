
<template>
    <div id="app">
          <VideoBackground :videos="videoSettings.videos" :fallbackImage="videoSettings.fallbackImage" :multipleBitRate="true" fit="cover" />
          <div id="main-mask"></div>
    </div>
</template>

<script>

import { videos , fallbackImage } from './store'
import VideoBackground from './VideoBackground/VideoBackground.vue'

export default {
  name: 'app',

  data(){
      return {
        pageIsLoaded : false,
        videoSettings : {
            videos,
            fallbackImage
        }
      }     
  },

  components: {
      VideoBackground
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
        onVideoCanPlay(){
          if (this.pageIsLoaded) return;
         
          this.pageIsLoaded = true;
          window.scrollTo(0, 0);

          this.fadeOut(document.querySelector('#main-mask'));
      }
  },


  created(){
    if (window.addEventListener) {
                     window.addEventListener('videoCanPlay', this.onVideoCanPlay, false);
        } else if (window.attachEvent) {
                    window.attachEvent('videoCanPlay', this.onVideoCanPlay);
    }
  }
}

</script>

<style lang="scss">


    #app {
        position:relative;
        top:0;
        left:0;
        width:100%;
        min-height:100vh;
    }

    #main-mask {
        position:fixed;
        width:100%;
        height:100%;
        background: black;
        top:0;
        left:0;
        z-index: 99999999;
    }

   
</style>
