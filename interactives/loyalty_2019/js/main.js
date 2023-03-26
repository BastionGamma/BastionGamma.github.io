var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    var data1 = [{ 'name': 'Good Quality', 'val': 80 },
                 { 'name': 'Reliability', 'val': 55 },
                 { 'name': 'Brand Regulation', 'val': 44 },
                 { 'name': 'Competitive Price', 'val': 43 },
                 { 'name': 'Convenient to Buy', 'val': 34 }],
        data2 = [{ 'name': 'Trusting It', 'val': 62 },
                 { 'name': 'Loving It', 'val': 45 },
                 { 'name': 'Recommending It', 'val': 42 },
                 { 'name': 'Feeling Good About Buying It', 'val': 40 }],
        data3 = [{ 'name': 'Considering It First', 'val': 46 },
                 { 'name': 'Buying It More Than Others', 'val': 45 }],
        data4 = [{ 'name': 'Product Discount', 'val': 68, 'yoy': 5 },
                 { 'name': 'Reward Certificate/Cashback', 'val': 61, 'yoy': 4 },
                 { 'name': 'Free Ground Shipping', 'val': 49, 'yoy': 10 },
                 { 'name': 'Points/Sales Multiplier', 'val': 30, 'yoy': 8 },
                 { 'name': 'Free Product', 'val': 24, 'yoy': 3 },
                 { 'name': 'Free Samples', 'val': 13, 'yoy': 0 },
                 { 'name': 'Free Express Shipping', 'val': 11, 'yoy': -2 },
                 { 'name': 'Free/Extended Returns', 'val': 11, 'yoy': -2 }],
        data5 = [{ 'name': 'Birthday Perk', 'val': 57, 'yoy': 3 },
                 { 'name': 'Early Product Access', 'val': 46, 'yoy': 1 },
                 { 'name': 'Early Sales Access', 'val': 39, 'yoy': 0 },
                 { 'name': 'Invitation to Exclusive Event', 'val': 39, 'yoy': 10 },
                 { 'name': 'Free Service', 'val': 27, 'yoy': 4 },
                 { 'name': 'Service Discount', 'val': 15, 'yoy': -1 },
                 { 'name': 'Eligible for Contest/Sweepstakes', 'val': 12, 'yoy': 6 },
                 { 'name': 'Donation', 'val': 10, 'yoy': 1 }];

    // scrolly-container = entire content section that contains a sticky graphic and various content sections that influence it
    const container = d3.selectAll('.scrolly-container');

    // step = the different content sections
    const stepSel = container.selectAll('.step');

    var currentSec;

    var cube = document.querySelector('.js-cube'),
        cube2 = document.querySelector('.js-cube');

    var currentClass = '';

    var controller = new ScrollMagic.Controller();

    var tl0 = new TimelineLite().to('#cube1', 1, { opacity: 1 }, '+=0.25');

    var s0 = new ScrollMagic.Scene({
                              triggerElement: '#text1',
                              triggerHook: 0.4
                            })
                            .setTween(tl0)
                            .addTo(controller);

    if (window.isMobile) {
      var left1 = '22%',
          left2 = '77.6%';
    } else {
      var left1 = '35%',
          left2 = '64.2%';
    }

    var tl1 = new TimelineLite()
                  .to('#cube1', 0.75, { left: left1 })
                  .to('#line1', 0.75, { opacity: 1 }, '+=0.25')
                  .to('#cube2', 0.75, { left: left2 }, '-=0.75')
                  .to('#cube2', 0.75, { opacity: 1 });

    var s1 = new ScrollMagic.Scene({
                              triggerElement: '#text2',
                              triggerHook: 0.4
                            })
                            .setTween(tl1)
                            .addTo(controller);

    var tl2 = new TimelineLite()
                  .call(buildChart, [data1, 'fundamental']);

    var s2 = new ScrollMagic.Scene({
                              triggerElement: '#text3',
                              triggerHook: 0.4
                            })
                            .setTween(tl2)
                            .addTo(controller);

    var tl3 = new TimelineLite()
                  .call(buildChart, [data2, 'emotional']);

    var s3 = new ScrollMagic.Scene({
                              triggerElement: '#text4',
                              triggerHook: 0.4
                            })
                            .setTween(tl3)
                            .addTo(controller);

    var tl4 = new TimelineLite()
                  .call(buildChart, [data3, 'transactional']);

    var s4 = new ScrollMagic.Scene({
                              triggerElement: '#text5',
                              triggerHook: 0.4
                            })
                            .setTween(tl4)
                            .addTo(controller);

    var tl5 = new TimelineLite()
                  .to('#cube3 .cube__face--top', 0.5, { background: 'rgba(0, 0, 0, 0)' }, '-=0.1')
                  .to('#cube3 .cube__face--top h2', 0.5, { opacity: 0.25 }, '-=0.5')
                  .to('#cube3 .cube__face--left', 0.5, { background: 'rgba(0, 0, 0, 0)' }, '-=0.25')
                  .to('#cube3 .cube__face--left h2', 0.5, { opacity: 0.25 }, '-=0.5')
                  .to('#cube3 .cube__face--front', 0.5, { background: 'rgba(0, 0, 0, 0)' }, '-=0.25')
                  .to('#cube3 .cube__face--front h2', 0.5, { opacity: 0.25}, '-=0.5');

    var s5 = new ScrollMagic.Scene({
                              triggerElement: '#text6',
                              triggerHook: 0.4
                            })
                            .setTween(tl5)
                            .addTo(controller);

    var tl6 = new TimelineLite()
                  .call(buildChart, [data5, 'experiential']);

    var s6 = new ScrollMagic.Scene({
                              triggerElement: '#text7',
                              triggerHook: 0.4
                            })
                            .setTween(tl6)
                            .addTo(controller);

    var tl7 = new TimelineLite()
                  .call(buildChart, [data4, 'transactional2']);

    var s7 = new ScrollMagic.Scene({
                              triggerElement: '#text8',
                              triggerHook: 0.4
                            })
                            .setTween(tl7)
                            .addTo(controller);

    function buildChart(data, chart) {
      d3.select(`svg.${ chart }`)
        .remove();

      var vh = window.innerHeight / 100;

      var right = window.isMobile ? 25 : 260;

      var margin = {top: 10, right: right, bottom: 0, left: 0},
          containerWidth = $(`.chart-container[data-chart="${ chart }"]`).width(),
          containerHeight = $(`.chart-container[data-chart="${ chart }"]`).height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name).reverse() )
                     .range([height, 0])
                     .padding(0.4),
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select(`.chart-container[data-chart="${ chart }"]`)
                  .append(`svg.${ chart }`)
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var barGroup = svg.appendMany('g.bar-group', data);

      var bar = barGroup.append('rect.bar')
                        .attrs({
                          'width': xScale(0),
                          'height': function(d) { 
                            return window.isMobile ? 2.5 * vh : 3 * vh; 
                          },
                          'y': d => yScale(d.name),
                          'x': xScale(0)
                        })
                        .translate(function(d) {
                          return window.isMobile ? [0, 0] : [255, 0];
                        });

      bar.transition()
         .duration(1000)
         .delay(function(d, i) { return i * 250; })
         .ease(d3.easePoly)
         .attr('width', d => xScale(d.val) );


      var nameLabel = barGroup.append('text')
                              .text( d3.f('name') )
                              .attrs({
                                'x': function() { 
                                  return window.isMobile ? xScale(0) : xScale(3);
                                },
                                'y': function(d) {
                                  return window.isMobile ? yScale(d.name) - ((3 * vh) - 20) : yScale(d.name) + ((3 * vh) / 2);
                                }
                              })
                              .translate(function(d) { 
                                var v = window.isMobile ? 0 : -10;

                                return [v, (d3.select(this).node().getBBox().height / 4)]; 
                              })
                              .styles({
                                'opacity': 0,
                                'font-size': function(d) {
                                  return window.isMobile ? '0.75rem' : '15px';
                                }
                              });

      nameLabel.transition()
               .duration(1000)
               .ease(d3.easePoly)
               .style('opacity', 1);

      var valLabel = barGroup.append('text.label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': function(d) { 
                                 return window.isMobile ? xScale(0) + 15 : xScale(0) + 260;
                               },
                               'y': d => yScale(d.name) + ((3 * vh) / 2)
                             })
                             .translate(function(d) { 
                               return window.isMobile ? [0, (d3.select(this).node().getBBox().height / 15)] : [0, (d3.select(this).node().getBBox().height / 4)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': function(d) {
                                  return window.isMobile ? '0.75rem' : '15px';
                                }
                              });

      valLabel.transition()
              .duration(1000)
              .delay(function(d, i) { return i * 250; })
              .ease(d3.easePoly)
              .attr('x', function(d) { 
                return window.isMobile ? xScale(d.val) + 15 : xScale(d.val) + 260;
              })
              .style('opacity', 1);

      if (data[0].yoy) {
        var yoyImg = barGroup.append('image')
                             .attrs({
                               'xlink:href': function(d) {
                                 if (d.yoy > 0) {
                                   return 'https://interactive.l2inc.com/loyalty_2019/img/up.svg';
                                 } else if (d.yoy < 0) {
                                   return 'https://interactive.l2inc.com/loyalty_2019/img/down.svg';
                                 }
                               },
                               'width': '15px',
                               'height': '15px',
                               'x': function(d) { 
                                 return window.isMobile ? xScale(0) + 75 : xScale(0) + 300;
                               },
                               'y': d => yScale(d.name) + ((3 * vh) / 3.5)
                             })
                             .style('opacity', 0);

        yoyImg.transition()
              .duration(1000)
              .delay(function(d, i) { return i * 250; })
              .ease(d3.easePoly)
              .attr('x', function(d) { 
                return window.isMobile ? xScale(d.val) + 75 : xScale(d.val) + 300;
              })
              .style('opacity', 1);

        var yoyLabel = barGroup.append('text.label.neue-bold')
                               .text( function(d) {
                                 if (d.yoy > 0) {
                                   return `${d.yoy}%`;
                                 } else if (d.yoy < 0) {
                                   return `${ Math.abs(d.yoy) }%`;
                                 } else {
                                   return '\u2014';
                                 }
                               })
                               .attrs({
                                 'x': function(d) { 
                                   return window.isMobile ? xScale(0) + 93 : xScale(0) + 318;
                                 },
                                 'y': d => yScale(d.name) + ((3 * vh) / 2)
                               })
                               .translate(function(d) { 
                                 return window.isMobile ? [0, (d3.select(this).node().getBBox().height / 15)] : [0, (d3.select(this).node().getBBox().height / 4)]; 
                               })
                               .styles({
                                  'opacity': 0,
                                  'fill': function(d) {
                                    if (d.yoy > 0) {
                                      return '#00A76D';
                                    } else if (d.yoy < 0) {
                                      return '#DE0A01';
                                    } else {
                                      return '#000000';
                                    }
                                  },
                                  'font-size': function(d) {
                                    return window.isMobile ? '0.75rem' : '15px';
                                  }
                                });

        yoyLabel.transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .ease(d3.easePoly)
                .attr('x', function(d) { 
                  return window.isMobile ? xScale(d.val) + 93 : xScale(d.val) + 318;
                })
                .style('opacity', 1);
      }
    }

    function changeSide(value) {
      if (value.length === 1) {
        var showClass = 'show-' + value;
        cube.classList.add( showClass );
      }

      if ( currentClass ) { cube.classList.remove( currentClass ); }

      $('.active').removeClass('active')

      for (i = 0; i < value.length; i++) {
        if (value.length > 1) {
          if (value[i] === 'front' ||
              value[i] === 'top' ||
              value[i] === 'left') {
            var cubeID = 'cube4';
          } else {
            var cubeID = 'cube5';
          }
        } else {
          var cubeID = 'cube3';
        }

        var borderClass = `.scrolly-container[data-section="${ currentSec }"] #${ cubeID }.js-cube .cube__face--${ value[i] }`;
        $(borderClass).addClass('active');
      }

      currentClass = showClass;
    }
    
    changeSide('corner');

    function updateChart(index) {
      if (currentSec > 0) {
        const sel = d3.select(`.scrolly-container[data-section="${ currentSec }"]`)
                      .select(`[data-index='${index}']`);

        const value = sel.attr('data-value');
        const currentCont = container.nodes()[currentSec];

        var valueSplit = value.split(',');

        stepSel.classed('is-active', (d, i) => i === index);
      
        changeSide(valueSplit);
      }
    }

    enterView({
      selector: container.nodes(),
      offset: 0.5,
      enter: el => {
        const section = +d3.select(el).attr('data-section');
        currentSec = section;
      }
    });

    function sticky() {
      Stickyfill.add(d3.select('.sticky').node());

      enterView({
        selector: stepSel.nodes(),
        offset: 0.5,
        enter: el => {
          const index = +d3.select(el).attr('data-index');
          updateChart(index);
        },
        exit: el => {
          let index = +d3.select(el).attr('data-index');
          index = Math.max(0, index - 1);
          updateChart(index);
        }
      });
    }

    sticky();
  }
  
  return { init : init }
})();

$(document).ready(function() { 
  l2Utils.init(); 
});