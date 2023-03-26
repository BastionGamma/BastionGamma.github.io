//*~*~*~~**~*~*~*
// L2 Inc. Utils
//*~*~*~*~*~*~*~*
var l2Utils = (function () {

  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    function drawGraph() {
      d3.select('.graph svg').remove();

      var data = [
        { 
          'id' : 0,
          'type' : 'duration', 
          'platform' : 'snapchat', 
          'val' : 2 
        },
        { 
          'id' : 0,
          'type' : 'duration', 
          'platform' : 'instagram', 
          'val' : 3 
        },
        { 
          'id' : 0,
          'type' : 'duration', 
          'platform' : 'facebook', 
          'val' : 4 
        },
        { 
          'id' : 0,
          'type' : 'duration', 
          'platform' : 'youtube', 
          'val' : 8 
        },
        { 
          'id' : 1,
          'type' : 'publishing cadence', 
          'platform' : 'snapchat',
          'val' : 10
        }, 
        { 
          'id' : 1,
          'type' : 'publishing cadence', 
          'platform' : 'instagram', 
          'val' : 8 
        },
        { 
          'id' : 1,
          'type' : 'publishing cadence', 
          'platform' : 'facebook', 
          'val' : 4 
        },
        { 
          'id' : 1,
          'type' : 'publishing cadence', 
          'platform' : 'youtube', 
          'val' : 1 
        },
        { 
          'id' : 2,
          'type' : 'content creation budget', 
          'platform' : 'snapchat', 
          'val' : 1 
        },
        { 
          'id' : 2,
          'type' : 'content creation budget', 
          'platform' : 'instagram', 
          'val' : 3 
        },
        { 
          'id' : 2,
          'type' : 'content creation budget', 
          'platform' : 'facebook', 
          'val' : 5 
        },
        { 
          'id' : 2,
          'type' : 'content creation budget', 
          'platform' : 'youtube', 
          'val' : 9 
        },
        { 
          'id' : 3,
          'type' : 'importance of influencers', 
          'platform' : 'snapchat', 
          'val' : 5 
        },
        { 
          'id' : 3,
          'type' : 'importance of influencers', 
          'platform' : 'instagram', 
          'val' : 8 
        },
        { 
          'id' : 3,
          'type' : 'importance of influencers', 
          'platform' : 'facebook', 
          'val' : 2 
        },
        { 
          'id' : 3,
          'type' : 'importance of influencers', 
          'platform' : 'youtube', 
          'val' : 9 
        },
        { 
          'id' : 4,
          'type' : 'targeting capabilities', 
          'platform' : 'snapchat', 
          'val' : 3 
        },
        { 
          'id' : 4,
          'type' : 'targeting capabilities', 
          'platform' : 'youtube-facebook-instagram', 
          'val' : 9 
        },
        { 
          'id' : 5,
          'type' : 'millennial engagement', 
          'platform' : 'snapchat', 
          'val' : 9 
        },
        { 
          'id' : 5,
          'type' : 'millennial engagement', 
          'platform' : 'instagram', 
          'val' : 8 
        },
        { 
          'id' : 5,
          'type' : 'millennial engagement', 
          'platform' : 'facebook', 
          'val' : 6 
        },
        { 
          'id' : 5,
          'type' : 'millennial engagement', 
          'platform' : 'youtube', 
          'val' : 4 
        },
        { 
          'id' : 6,
          'type' : 'ability to drive organic reach', 
          'platform' : 'snapchat', 
          'val' : 4 
        },
        { 
          'id' : 6,
          'type' : 'ability to drive organic reach', 
          'platform' : 'instagram', 
          'val' : 9 
        },
        { 
          'id' : 6,
          'type' : 'ability to drive organic reach', 
          'platform' : 'facebook', 
          'val' : 2 
        },
        { 
          'id' : 6,
          'type' : 'ability to drive organic reach', 
          'platform' : 'youtube', 
          'val' : 5 
        }
      ];

      var margin = {top: 35, right: 120, bottom: 0, left: -20};

      var containerWidth = $('.graph').width(),
          containerHeight = $('.graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var allIDs = d3.set( data.map( function(d) { return d.id; } ) ).values();

      var x = d3.scale.ordinal()
                      .domain( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] )
                      .rangeBands( [0, width], 0.25),
          y0 = d3.scale.ordinal( )
                       .domain( allIDs )
                       .rangeBands( [0, height], 0.25),
          y1 = d3.scale.ordinal( )
                       .domain( allIDs )
                       .rangeBands( [0, height], 0.25);

      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('top')
                    .tickSize( height ),
          yAxisL = d3.svg.axis()
                     .scale(y0)
                     .orient('left')
                     .tickSize( (width - x.rangeBand()) )
                     .tickFormat( function(i) {
                       var types = ['Short', 'Tentpole', 'Low', 'Low', 'Rudimentary', 'Low', 'Low'];
                          
                       return types[i];
                     }),
          yAxisR = d3.svg.axis()
                     .scale(y1)
                     .orient('right')
                     .tickFormat( function(i) {
                       var types = ['Long', 'Consistent', 'High', 'High', 'Sophisticated', 'High', 'High'];
                          
                       return types[i];   
                     });

      var svg = d3.select('.graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      data.forEach( function(d) { d.val = +d.val; });

      var bgRect = svg.selectAll('rect')
                      .data( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] )
                      .enter()
                      .append('rect')
                      .attr({
                        'x' : function(d) { return x(d); },
                        'width' : '8.5%',
                        'height' : height - (y0.rangeBand() / 2.76),
                        'class' : 'bg-rect',
                        'transform' : 'translate(' + (x.rangeBand() / 2.5) + ', ' + (y0.rangeBand() / 5.5) + ')'
                      });

      var xAxisGroup = svg.append('g')
                          .attr('transform', 'translate(0,' + height + ')')
                          .attr('class', 'x axis')
                          .call(xAxis);
                          
      xAxisGroup.selectAll('.tick text')
                .attr('class', 'label')
                .style('text-anchor', 'middle');

      var yAxisLGroup = svg.append('g')
                           .attr({
                             'transform' : 'translate(' + width + ', 0)',
                             'class' : 'y axis'
                           })
                           .call(yAxisL);

      yAxisLGroup.selectAll('.tick text')
                 .attr('class', 'label')
                 .style('text-anchor', 'start');  

      var yAxisRGroup = svg.append('g')
                           .attr({
                             'transform' : 'translate(' + width + ', 0)',
                             'class' : 'y axis'
                           })
                           .call(yAxisR);

      yAxisRGroup.selectAll('.tick text')
                 .attr('class', 'label')
                 .style('text-anchor', 'end');  

      svg.selectAll('.logo')
         .data(data)
         .enter()
         .append('svg:image')
         .attr({
           'xlink:href' : function(d) {
             return 'img/platforms/' + d.platform + '.svg';
           },
           'width' : function(d) {
             if ( d.platform == 'youtube-facebook-instagram' ) {
               return x.rangeBand() / 1.3;
             } else if ( d.platform == 'youtube' ) {
               return x.rangeBand() / 2;
             } else {
               return x.rangeBand() / 2.25;
             }
           },
           'height' : function(d) {
             return d.platform == 'youtube-facebook-instagram' ? y0.rangeBand() / 1.3 : y0.rangeBand() / 2.25;
           },
           'x' : function(d) { return x(d.val); },
           'y' : function(d) { return y0(d.id); },
           'class' : function(d) {
             return 'logo slide' + d.id + ' value' + d.val; 
           },
           'transform' : function(d) {
             if ( d.platform == 'youtube-facebook-instagram' ) {
               return 'translate(' + (x.rangeBand() / 1.5) + ', ' + (y0.rangeBand() / 10) + ')';
             } else {
               return 'translate(' + (x.rangeBand() / 1.25) + ', ' + (y0.rangeBand() / 3.25) + ')';
             }
           }
         })
         .style('opacity', 0);

      xAxisGroup.selectAll('text')
                .attr('transform', 'translate(' + (x.rangeBand() / 2) + ', 0)' );

      yAxisLGroup.selectAll('line')
                 .attr('transform', 'translate(0 ,' + -(y0.rangeBand() / 1.5) + ')' );

      yAxisLGroup.selectAll('text')
                 .attr('transform', 'translate(' + -(x.rangeBand() / 7.5) + ' ,' + -(y0.rangeBand() / 2.1) + ')' );

      yAxisRGroup.selectAll('text')
                 .attr('transform', 'translate(' + (x.rangeBand() / 7.5) + ' ,' + -(y0.rangeBand() / 2.1) + ')' );

      /* ========== REVEALS ========== */

      function renderRect(slide, value) {
        var revealRect = svg.selectAll('.reveal-rect')
                            .data(allIDs)
                            .enter()
                            .append('svg:image')
                            .attr({
                               'x' : x(0),
                               'y' : function(d) { return y0(d); },
                               'height' : (height / 7.2),
                               'transform' : function() {
                                 var val = $('body').innerWidth() > 1440 ? 1.38 : 1.4;

                                 return 'translate(' + (x.rangeBand() / val) + ', ' + -(y0.rangeBand() / 6) + ')'
                               },
                               'class' : 'reveal-rect',
                               'id' : function(d) { return 'slide' + d; },
                               'preserveAspectRatio' : 'none'
                            })

        if ( value == 1 || value == 10 ) {
          d3.select('#slide' + slide)
            .attr('width', '19.15%');
        } else {
          d3.select('#slide' + slide)
            .attr('width', '28.75%');
        }

        if ( value == 1 ) {
          d3.select('#slide' + slide)
            .attr('xlink:href', 'img/gradient-left.png');
        } else if ( value == 10 ) {
          d3.select('#slide' + slide)
            .attr('xlink:href', 'img/gradient-right.png');
        } else {
          d3.select('#slide' + slide)
            .attr('xlink:href', 'img/gradient-main.png');
        }
      }

      /* ========== SLIDER ========== */

      function moveRect(slide, value) {
        d3.select('#slide' + slide)
          .attr({
            'x' : function() {
              return value == 1 ? x(value) : x(value - 1);
            },
            'transform' : function() {
              var val = $('body').innerWidth() > 1440 ? 2.56 : 2.6;
              return value != 10 ? 'translate(' + (x.rangeBand() / val) + ', ' + -(y0.rangeBand() / 6) + ')' : 'translate(' + (x.rangeBand() / 6) + ', ' + -(y0.rangeBand() / 6) + ')'
            }
          });

        renderRect(slide, value);
        revealPlatforms(slide, value);
      }

      function revealPlatforms(slide, value) {
        slide = +slide;
        value = +value;

        var current = '.slide' + slide + '.value' + value,
            prev = '.slide' + slide + '.value' + (value - 1),
            next = '.slide' + slide + '.value' + (value + 1);

        d3.selectAll('.logo.slide' + slide)
          .style('opacity', 0);

        d3.selectAll(prev)
          .style('opacity', 0.2);

        d3.selectAll(current)
          .style('opacity', 1);

        d3.selectAll(next)
          .style('opacity', 0.2);
      }

      d3.selectAll('.slider').on('input', function() {
        var value = +this.value,
            slide = d3.select(this)
                      .attr('data-slide');

        moveRect(slide, value);
      });

      function adjustSliders(slide, value) {
        var sliders = $('.slider');

        $(sliders[slide]).val(value);
      }

      function render(values) {
        switch(values) {
          case 'katVonD':  
            var values = [4, 4, 5, 2, 9, 6, 2];
            break;
          case 'chanel':
            var values = [8, 1, 9, 9, 9, 4, 5];
            break;
          case 'calvinKlein':
            var values = [3, 8, 3, 8, 9, 8, 9];
            break;
          case 'defaultVal':
            var values = [1, 1, 1, 1, 1, 1, 1];
        }

        for (i = 0; i < allIDs.length; i++) {
          moveRect(allIDs[i], values[i]);
          revealPlatforms(allIDs[i], values[i]);
          adjustSliders(allIDs[i], values[i]);
        }
      }

      render('defaultVal');

      $('#selector').on('change', function() {
        var value = $('#selector').val();

        render(value);

        window.setTimeout(function() {
          caseStudyHandler(value);
        }, 300);
      });
    }

    drawGraph();

    $(window).resize( function() {
      drawGraph();
    });

    function modalClear() { $('.modal').empty(); }

    function modalHandler(type) {
      modalClear();

      var templateHTML = $('#' + type + '_modal_template').html(),
          template = Handlebars.compile(templateHTML);

      window.setTimeout( function() {
        $('.modal').append(template());
      }, 300);
    }

    function caseStudyClear() {
      $('.case-study').slideUp(300);

      $('.graph-list').animate({'top' : '60px'}, 300);
      $('.copyright').animate({'bottom' : '0px'}, 300); 
    }

    function caseStudyHandler(type) {
      $('.case-study').empty(); 

      var templateHTML = $('#' + type + '_modal_template').html(),
          template = Handlebars.compile(templateHTML);

      $('.case-study').append(template());
      $('.graph-list').animate({'top' : '130px'}, 300);
      $('.copyright').animate({'bottom' : '-70px'}, 300);

      window.setTimeout( function() {
        $('.case-study').fadeIn(100);
      }, 200);
    }

    $('.slider__plus').on(myEvent, function(e) {
      var type = $(this).data('type');

      modalHandler(type);
    });

    $('body').on(myEvent, '.close', function() {
      modalClear();
    });

    function scrollUp() {
      $('.intro').slideUp(300);
      $('.graph-list').animate({'top' : '60px'}, 300);
    }

    $('body').on(myEvent, '.intro__button, .graph-list, .nav', function() {
      if ($('.intro').hasClass('visible')) {
        $('.intro').removeClass('visible');
        scrollUp();
      }
    });

    $('body').on( 'DOMMouseScroll mousewheel', function ( event ) {
      if( event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) { 
        if ($('.intro').hasClass('visible')) {
          $('.intro').removeClass('visible');
          scrollUp();
        }
      }
      
      return false;
    });

    $('body').on(myEvent, '.graph-list', function() {
      caseStudyClear();
    })
  }
  
  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});