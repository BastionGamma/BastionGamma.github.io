jQuery(document).ready(function($){
  var contentSections = $('.cd-section'),
  navigationItems = $('#cd-vertical-nav a');

  updateNavigation();
  $(window).on('scroll', function(){
    updateNavigation();
  });

  navigationItems.on('click', function(event){
    event.preventDefault();
    smoothScroll($(this.hash));
  });
    
  $('.cd-scroll-down').on('click', function(event){
    event.preventDefault();
    smoothScroll($(this.hash));
  });

  function updateNavigation() {
    contentSections.each(function(){
      $this = $(this);
      var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
      if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
        navigationItems.eq(activeSection).addClass('is-selected');
      }else {
        navigationItems.eq(activeSection).removeClass('is-selected');
      }
    });
  }

  function smoothScroll(target) {
    $('body,html').animate(
      {'scrollTop':target.offset().top},
      600
      );
  }
});

// const { createApp } = Vue;

// createApp({
//   data() {
//     return {
//       background: 'img/chase-tween-490x276.png',
//       url: 'https://thequest.chase.com/',
//       title: '"The Quest" Animated Comic',
//       subtitles: [
//           { text: 'Millennium Communications Inc. 2021' }, 
//           { text: 'for JPMorgan Chase & Co.' }
//       ]
//     }
//   }
// }).mount('#app');

// Vue.component("gallery-item", {
//   template: 
//     `<div 
//       class="gallery-item w-full h-full bg-contain border-2 border-black" 
//       :style="{ 'background': 'url(' + background + ') no-repeat center center' }"
//     >
//       <a v-bind:href="url" class="relative block w-full h-full pb-[56.25%]" target="_blank">
//         <div class="overlay absolute bottom-0 w-full px-6 py-4 transition-all">
//           <h5 class="font-sans font-light text-white text-lg">{{ title }}</h5>

//           <h6 v-for="subtitle in subtitles" :key="subtitle.id" class="font-sans font-light text-gray-200 text-sm italic"> {{ subtitle.text }}</h6>
//         </div>
//       </a>
//     </div>`,
//   data() {
//       return {
//         background: 'img/chase-tween-490x276.png',
//         url: 'https://thequest.chase.com/',
//         title: '"The Quest" Animated Comic',
//         subtitles: [
//             { text: 'Millennium Communications Inc. 2021' }, 
//             { text: 'for JPMorgan Chase & Co.' }
//         ]
//       }
//     }
// });

// new Vue({
//   el: "#app"
// });