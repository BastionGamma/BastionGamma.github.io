var utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    // var elasticEase = Elastic.easeOut.config(0.75, 0.5);

    // var controller = new ScrollMagic.Controller();

    // var tl1 = new TimelineLite()
    //               .add( enableHover )

    //               .to('#vert-nav', 0.5, { opacity: 1 })

    //               .to('#o-phone', 1, { 
    //                 attr: {transform: 'translate(150 200)'},
    //                 opacity: 1,
    //                 ease: elasticEase
    //               });
    
    // var s1 = new ScrollMagic.Scene({
    //                           triggerElement: '#omnichannel',
    //                           triggerHook: 0.4
    //                         })
    //                         .setTween(tl1)
    //                         .addTo(controller);

    // var scrolling = false;

    // var contentSections = $('.section'),
    //     verticalNavigation = $('.cd-vertical-nav'),
    //     navigationItems = verticalNavigation.find('a');

    // $('body').on('scroll', checkScroll);

    // //smooth scroll to the selected section
    // verticalNavigation.on('click', 'a', function(event){
    //   event.preventDefault();

    //   smoothScroll($(this.hash));
    // });

    // function checkScroll() {
    //   if( !scrolling ) {
    //     scrolling = true;

    //     (!window.requestAnimationFrame) ? setTimeout(updateSections, 300) : window.requestAnimationFrame(updateSections);
    //   }
    // }

    // function updateSections() {
    //   var halfWindowHeight = $(window).height()/2,
    //       scrollTop = $(window).scrollTop();

    //   contentSections.each(function(){
    //     var section = $(this),
    //         sectionId = section.attr('id'),
    //         navigationItem = navigationItems.filter('[href^="#'+ sectionId +'"]');

    //     ( (section.offset().top - halfWindowHeight < scrollTop ) && ( section.offset().top + section.height() - halfWindowHeight > scrollTop) )
    //       ? navigationItem.addClass('current')
    //       : navigationItem.removeClass('current');
    //   });
      
    //   scrolling = false;
    // }

    // function smoothScroll(target) {
    //   $('body,html').animate(
    //     {'scrollTop':target.offset().top - 50},
    //     600
    //   );
    // }

    $('.element').on('mouseenter', function(e) {
      $(this).find('.cover').addClass('open');
    });

    $('.element').on('mouseleave', function(e) {
      $(this).find('.cover').removeClass('open');
    });

    var colors = new Array(
      [16, 215, 174],
      [255, 106, 213],
      [199, 116, 232],
      [173, 140, 255],
      [135, 149, 232],
      [148, 208, 255]
    );

    var step = 0;
    var colorIndices = [0, 1, 2, 3];

    var gradientSpeed = 0.0002;

    function updateGradient() {
      if ( $ === undefined ) return;
      
      var c0_0 = colors[colorIndices[0]],
          c0_1 = colors[colorIndices[1]],
          c1_0 = colors[colorIndices[2]],
          c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;

      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]),
          g1 = Math.round(istep * c0_0[1] + step * c0_1[1]),
          b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);

      var color1 = `rgb(${ r1 }, ${ g1 }, ${ b1 })`;

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]),
          g2 = Math.round(istep * c1_0[1] + step * c1_1[1]),
          b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);

      var color2 = `rgb(${ r2 }, ${ g2 }, ${ b2 })`;

      $('body').css({
        background: "-webkit-gradient(linear, left top, right bottom, from(" + color1 + "), to(" + color2 + "))"
      }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
      });
      
      step += gradientSpeed;

      if ( step >= 1 ) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        
        colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      }
    }

    // setInterval(updateGradient, 10);
  }

  return {
    init:init
  }
})();

$(document).ready(function(){
  utils.init();
});