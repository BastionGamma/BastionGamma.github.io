var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    const ƒ = d3.f;

    var elasticEase = Elastic.easeOut.config(0.75, 0.5);

    var controller = new ScrollMagic.Controller();

    var tl0 = new TimelineLite().to('#twenty-eighteen', 1, {opacity: 1}, '+=0.75')
                                .to('#title', 1, {opacity: 1}, '-=0.5')
                                .to('#subtitle', 1, {opacity: 1}, '-=0.5');

    var tl1 = new TimelineLite()
                  .add( enableHover )

                  .to('#vert-nav', 0.5, { opacity: 1 })

                  .to('#o-phone', 1, { 
                    attr: {transform: 'translate(150 200)'},
                    opacity: 1,
                    ease: elasticEase
                  })
                  .to('#o-floating-shelf', 1, { 
                    attr: {transform: 'translate(230 40)'},
                    className: '+=float-group',
                    opacity: 1,
                    ease: elasticEase
                  }, '-=0.9')
                  .to('#o-bookshelf1', 0.6, { 
                    attr: {transform: 'translate(445 30)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-bookshelf2', 0.6, { 
                    attr: {transform: 'translate(360 78)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-clothes-rack', 0.75, { 
                    attr: {transform: 'translate(240 200)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')

                  .add( omnichannelChart )

                  .to('#o-stack1', 0.6, { 
                    attr: {transform: 'translate(520 122)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack2', 0.6, { 
                    attr: {transform: 'translate(390 150)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack3', 0.6, { 
                    attr: {transform: 'translate(440 111)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack4', 0.6, { 
                    attr: {transform: 'translate(494 50)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack5', 0.6, { 
                    attr: {transform: 'translate(470 -33)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack6', 0.6, { 
                    attr: {transform: 'translate(400 23)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#o-stack7', 0.6, { 
                    attr: {transform: 'translate(255 25)'},
                    className: '+=float-group',
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')

                  .to('#o-floating-shelf', 0.4, { 
                    attr: {transform: 'translate(230 55)'},
                    ease: Power4.easeOut
                  }, '-=0.25')
                  .to('#o-stack7', 0.4, { 
                    attr: {transform: 'translate(255 40)'},
                    ease: Power4.easeOut
                  }, '-=0.4')

                  .to('#o-floating-shelf', 0.6, { 
                    attr: {transform: 'translate(230 40)'},
                    ease: elasticEase
                  }, '-=0.1')
                  .to('#o-stack7', 0.6, { 
                    attr: {transform: 'translate(255 25)'},
                    ease: elasticEase
                  }, '-=0.6')

                  .to('#o-shirt', 0.6, { 
                    attr: {transform: 'translate(320 304)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '+=0.3')

                  .to('#o-shirt', 0.5, { 
                    transformOrigin: '50% 0%',
                    rotation: -5,
                    ease: Power1.easeInOut
                  }, '-=0.165')
                  .to('#o-shirt', 0.5, { 
                    rotation: 2,
                    ease: Power1.easeInOut
                  })
                  .to('#o-shirt', 0.5, { 
                    rotation: -1,
                    ease: Power1.easeInOut
                  })
                  .to('#o-shirt', 0.5, { 
                    rotation: 0,
                    ease: Power1.easeInOut
                  });
    
    var s1 = new ScrollMagic.Scene({
                              triggerElement: '#omnichannel',
                              triggerHook: 0.4
                            })
                            .setTween(tl1)
                            .addTo(controller);

    function omnichannelChart() {
      d3.select('svg.omnichannel')
        .remove();

      var data = [{ 'name': 'Leaders',
                    'val': 9 },
                  { 'name': 'Store-First',
                    'val': 14 },
                  { 'name': 'E-Commerce',
                    'val': 22 },
                  { 'name': 'Laggards',
                    'val': 55 }];

      var margin = {top: 10, right: 0, bottom: 25, left: 0},
          containerWidth = $('.chart-container[data-chart="omnichannel"]').width(),
          containerHeight = $('.chart-container[data-chart="omnichannel"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name).reverse() )
                     .range([height, 0])
                     .padding(0.2),
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="omnichannel"]')
                  .append('svg.omnichannel')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var greyBar = barGroup.append('rect.grey-bar')
                            .attrs({
                              'width': width,
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            })
                            .styles('opacity', 0);

      greyBar.transition()
             .duration(1000)
             .ease(d3.easePoly)
             .style('opacity', 1);

      var blueBar = barGroup.append('rect.blue-bar')
                            .attrs({
                              'width': xScale(0),
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            });

      blueBar.transition()
             .duration(1000)
             .delay(function(d, i) { return i * 250; })
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) );


      var nameLabel = barGroup.append('text.white-label.neue-bold')
                              .text( ƒ('name') )
                              .attrs({
                                'x': xScale(3),
                                'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                              })
                              .translate(function(d) { 
                                return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                              })
                              .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      nameLabel.transition()
               .duration(1000)
               .ease(d3.easePoly)
               .style('opacity', 1);

      var valLabel = barGroup.append('text.blue-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 40,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function enableHover() {
      var hovers = d3.selectAll('span.hover');
sys
      hovers.call(d3.attachTooltip)
            .on('mouseover', function(d) {
              var val = d3.select(this)
                          .attr('data-hover');

              d3.select('.tooltip')
                .html(`<img src='img/omnichannel/${ val }.png' class="w6 bg-white pa2" />`);
            })

      d3.select('body').on('touchstart', function(d) {
              d3.select('.tooltip').classed('tooltip-hidden', true);
            });
    }

    var tl2 = new TimelineLite()
                  .to('#cc-game-board', 1, {
                    attr: {transform: 'translate(40, 115)'},
                    opacity: 1,
                    ease: elasticEase
                  })
                  .to('#cc-black-cards', 0.6, {
                    attr: {transform: 'translate(80, -30)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.3')
                  .to('#cc-white-cards', 0.6, {
                    attr: {transform: 'translate(570, 240)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.3')

                  .to('#cc-die', 0.6, {
                    attr: {transform: 'translate(535, -25)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.3')

                  .add(contentCommerceChart)

                  .to('#cc-black-piece1', 0.6, {
                    attr: {transform: 'translate(62, 140)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-black-piece2', 0.6, {
                    attr: {transform: 'translate(470, 15)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-black-piece3', 0.6, {
                    attr: {transform: 'translate(200, 138)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-black-piece4', 0.6, {
                    attr: {transform: 'translate(430, 200)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')

                  .to('#cc-white-piece1', 0.6, {
                    attr: {transform: 'translate(238, 20)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-white-piece2', 0.6, {
                    attr: {transform: 'translate(500, 120)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-white-piece3', 0.6, {
                    attr: {transform: 'translate(520, 240)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#cc-white-piece4', 0.6, {
                    attr: {transform: 'translate(565, 265)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')

                  .add(contentCommercePieChart)

                  .to('#cc-icon1', 0.6, {
                    attr: {transform: 'translate(338, -46)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#cc-icon2', 0.6, {
                    attr: {transform: 'translate(554, 74)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#cc-icon3', 0.6, {
                    attr: {transform: 'translate(342, 212)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#cc-icon4', 0.6, {
                    attr: {transform: 'translate(118, 80)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')

                  .to('#cc-product-page', 0.6, {
                    attr: {transform: 'translate(302, 12)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '+=0.2');

    var s2 = new ScrollMagic.Scene({
                              triggerElement: '#content-commerce',
                              triggerHook: 0.4
                            })
                            .setTween(tl2)
                            .addTo(controller);

    function contentCommerceChart() {
      d3.select('svg.commerce')
        .remove();

      var data = [{ 'name': 'Leaders',
                    'val': 19 },
                  { 'name': 'Integrated Content',
                    'val': 23 },
                  { 'name': 'Streamlined Commerce',
                    'val': 26 },
                  { 'name': 'Laggards',
                    'val': 32 }];

      var margin = {top: 10, right: 0, bottom: 25, left: 0},
          containerWidth = $('.chart-container[data-chart="content-commerce"]').width(),
          containerHeight = $('.chart-container[data-chart="content-commerce"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name).reverse() )
                     .range([height, 0])
                     .padding(0.2),
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="content-commerce"]')
                  .append('svg.commerce')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var greyBar = barGroup.append('rect.grey-bar')
                            .attrs({
                              'width': width,
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            })
                            .styles('opacity', 0);

      greyBar.transition()
             .duration(1000)
             .ease(d3.easePoly)
             .style('opacity', 1);

      var blueBar = barGroup.append('rect.blue-bar')
                            .attrs({
                              'width': xScale(0),
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            });

      blueBar.transition()
             .duration(1000)
             .delay(function(d, i) { return i * 250; })
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) );


      var nameLabel = barGroup.append('text.white-label.neue-bold')
                              .text( ƒ('name') )
                              .attrs({
                                'x': xScale(3),
                                'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                              })
                              .translate(function(d) { 
                                return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                              })
                              .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      nameLabel.transition()
               .duration(1000)
               .ease(d3.easePoly)
               .style('opacity', 1);

      var valLabel = barGroup.append('text.blue-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 40,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function contentCommercePieChart() {
      d3.select('svg.commerce-pie')
        .remove();

      var data = [{ 'channel': 'Direct',
                    'val': 51 },
                  { 'channel': 'Organic Search',
                    'val': 27 },
                  { 'channel': 'Referrals',
                    'val': 12 },
                  { 'channel': 'Email',
                    'val': 4 },
                  { 'channel': 'Paid Search',
                    'val': 3 },
                  { 'channel': 'Social',
                    'val': 2 },
                  { 'channel': 'Indirect Ad Buys',
                    'val': 1 }];

      var margin = {top: 85, right: 0, bottom: 25, left: 25},
          width = $('.chart-container[data-chart="content-commerce-pie"]').width(),
          height = $('.chart-container[data-chart="content-commerce-pie"]').height(),
          radius = Math.min(width, height) / 2;

      var color = d3.scaleOrdinal()
                    .domain( data.map(d => d.channel) )
                    .range(['#009AD7', '#2C9ED7', '#55B5E2', '#89CEEA', '#C2E6F4', '#DFF3FA', '#FFFFFF']);
                    
      var svg = d3.select('.chart-container[data-chart="content-commerce-pie"]')
                  .append('svg.commerce-pie')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate( [(width / 2) + margin.left, (height / 2) + margin.top] );

      var arc = d3.arc()
                  .innerRadius(radius * 0.5)
                  .outerRadius(radius);

      var pie = d3.pie()
                  .startAngle(0 * Math.PI)
                  .endAngle(100 * Math.PI)
                  .value( ƒ('val') )
                  .sort(null);

      var slice = svg.appendMany('g.slice', pie(data));

      slice.append('path')
           .transition()
           .duration(1000)
           .delay((d, i) => i * 150)
           .style('fill', (d, i) => color(i))
           .attrTween('d', function(d) {
             var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);

             return function(t) {
               d.endAngle = i(t); 

               return arc(d);
             }
           })
           .each((d, i) => this._current = i);

      var label = slice.append('text')
                       .attrs({
                         'transform': function(d, i) { 
                           switch (i) {
                             case 4:
                               var val = 1.61;
                               break;
                             case 5:
                               var val = 1.76;
                               break;
                             case 6:
                               var val = 1.95;
                               break;
                             default:
                               var val = 1.5;
                               break;
                           }

                           var c = arc.centroid(d);
                           c[0] *= val;
                           c[1] *= val;

                           return `translate(${ c })`;
                         },
                         'dy': '0.35em',
                         'text-anchor': function(d, i) {
                           return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start';
                         }
                       })
                       .text(function(d) {
                         return `${ d.data.val }% ${ d.data.channel }`;
                       })
                       .styles({
                         'fill': (d, i) => color(i),
                         'font-size': '12px',
                         'opacity': 0
                       });

      label.transition()
           .duration(1000)
           .style('opacity', 1);
    }

    var tl3 = new TimelineLite()
                  .to('#sp-clouds1', 0.75, {
                    attr: {transform: 'translate(-15 285)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })
                  .to('#sp-clouds2', 0.75, {
                    attr: {transform: 'translate(435 190)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#sp-racetrack', 0.75, {
                    attr: {transform: 'translate(85 105)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#sp-finishline', 0.6, {
                    attr: {transform: 'translate(40 -120)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')

                  .to('#sp-tortoise', 1, {
                    attr: {transform: 'translate(150 -60)'},
                    opacity: 1
                  })
                  .to('#sp-hare', 0.5, {
                    attr: {transform: 'translate(555 170)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.3')

                  .add( socialPlatformsChart )

                  .to('#sp-heart1', 0.5, {
                    attr: {transform: 'translate(155 -150)'},
                    opacity: 1,
                    ease: elasticEase
                  }, '-=0.3')
                  .to('#sp-heart2', 0.5, {
                    attr: {transform: 'translate(580 80)'},
                    opacity: 1,
                    ease: elasticEase
                  }, '-=0.3')

                  .to('#sp-instagram', 0.75, {
                    attr: {transform: 'translate(230 120)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.1')
                  .to('#sp-facebook', 0.75, {
                    attr: {transform: 'translate(310 185)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .add( socialPlatformsBubble );

    var s3 = new ScrollMagic.Scene({
                              triggerElement: '#social-platforms',
                              triggerHook: 0.4
                            })
                            .setTween(tl3)
                            .addTo(controller);

    function socialPlatformsChart() {
      d3.select('svg.social-platforms')
        .remove();

      var data = [{ 'name': 'Leaders',
                    'val': 8 },
                  { 'name': 'Purchase-Oriented',
                    'val': 13 },
                  { 'name': 'Awareness Drivers',
                    'val': 14 },
                  { 'name': 'Laggards',
                    'val': 65 }];

      var margin = {top: 10, right: 0, bottom: 25, left: 0},
          containerWidth = $('.chart-container[data-chart="social-platforms"]').width(),
          containerHeight = $('.chart-container[data-chart="social-platforms"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name).reverse() )
                     .range([height, 0])
                     .padding(0.2),
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="social-platforms"]')
                  .append('svg.social-platforms')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var greyBar = barGroup.append('rect.grey-bar')
                            .attrs({
                              'width': width,
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            })
                            .styles('opacity', 0);

      greyBar.transition()
             .duration(1000)
             .ease(d3.easePoly)
             .style('opacity', 1);

      var blueBar = barGroup.append('rect.blue-bar')
                            .attrs({
                              'width': xScale(0),
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            });

      blueBar.transition()
             .duration(1000)
             .delay(function(d, i) { return i * 250; })
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) );


      var nameLabel = barGroup.append('text.white-label.neue-bold')
                              .text( ƒ('name') )
                              .attrs({
                                'x': xScale(3),
                                'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                              })
                              .translate(function(d) { 
                                return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                              })
                              .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      nameLabel.transition()
               .duration(1000)
               .ease(d3.easePoly)
               .style('opacity', 1);

      var valLabel = barGroup.append('text.blue-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 40,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function socialPlatformsBubble() {
      d3.select('svg.social-platforms-bubble')
        .remove();

      var margin = {top: 100, right: 50, bottom: 50, left: 100},
          containerWidth = $('.chart-container[data-chart="social-platforms-bubble"]').width(),
          containerHeight = $('.chart-container[data-chart="social-platforms-bubble"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleLinear()
                     .domain([-1, 1])
                     .range([height, 0]),
          xScale = d3.scaleLinear()
                     .domain([-1, 1])
                     .range([0, width])
          rScale = d3.scaleLinear()
                     .range([5, 50]);

      var xAxis = d3.axisTop(xScale)
                    .tickSize( height )
                    .ticks(5)
                    .tickFormat(d3.format('.0%')),
          yAxis = d3.axisLeft(yScale)
                    .tickSize( -width )
                    .ticks(8)
                    .tickFormat(d3.format('.0%'));

      var svg = d3.select('.chart-container[data-chart="social-platforms-bubble"]')
                  .append('svg.social-platforms-bubble')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/bubble.csv', ready);

      function ready(err, data) {
        if (err) throw 'error loading data';

        data.forEach(function(d) {
          d['Brand Handle Engagement Change'] = +d['Brand Handle Engagement Change'];
          d['Influencer Handle Engagement Change'] = +d['Influencer Handle Engagement Change'];
          d['Number of Influencers Mentioning Brand Handle'] = +d['Number of Influencers Mentioning Brand Handle'];
        });

        rScale.domain( d3.extent(data, d => d['Number of Influencers Mentioning Brand Handle']) );

        svg.append('g.x.axis')
           .translate( [0, height] )
           .call(xAxis)
           .style('opacity', 0);
 
        svg.select('.x.axis')
           .selectAll('.tick text')
           .translate([0, -15])

        svg.select('.x.axis')
           .transition()
           .duration(1000)
           .style('opacity', 1);

        svg.append('text.label')             
           .translate( [(width / 2), -60] )
           .style('text-anchor', 'middle')
           .text('Influencer Impact on Brand Handle')
           .style('opacity', 0);

        svg.append('g.y.axis')
           .call(yAxis)
           .style('opacity', 0);

        svg.select('.y.axis')
           .selectAll('.tick text')
           .translate([-15, 0])

        svg.select('.y.axis')
           .transition()
           .duration(1000)
           .style('opacity', 1);

        svg.append('text.label')
           .attr('transform', 'rotate(-90)')
           .attr('y', -90)
           .attr('x', 0 - (height / 2))
           .attr('dy', '1em')
           .style('text-anchor', 'middle')
           .text('Brand Impact on Influencer Handle (Percent Change in Interactions)')
           .style('opacity', 0);

        svg.selectAll('text.label')
           .transition()
           .duration(1000)
           .style('opacity', 1)

        var circles = svg.appendMany('circle.circle', data)
                         .attrs({
                           'cx': d => xScale( d['Influencer Handle Engagement Change'] ),
                           'cy': d => yScale( d['Brand Handle Engagement Change'] ),
                           'r': 0
                         });

        circles.transition()
               .duration(1000)
               .delay(function(d, i) { return i * 10; })
               .attr('r', d => rScale( d['Number of Influencers Mentioning Brand Handle'] ));

        circles.call(d3.attachTooltip);

        circles.on('mouseover', function(d) {
                 d3.select('.tooltip')
                   .text( d['Brand'] );
               })
               .on('mouseout', function(d) {
                 d3.select('.tooltip').classed('tooltip-hidden', true);
               });
      };
    }

    var tl4 = new TimelineLite()
                  .to('#rm-shadow', 1, {
                    opacity: 1
                  })
                  .to('#rm-blue-slice', 1, {
                    attr: {transform: 'translate(250 60)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#rm-black-slice', 1, {
                    attr: {transform: 'translate(74 147)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=1')

                  .add(retailersChart)

                  .to('#rm-knife', 1, {
                    attr: {transform: 'translate(145 -100)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.3')
                  .to('#rm-knife', 2, {
                    attr: {transform: 'translate(145 100)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })

                  .to('#rm-blue-slice', 0.75, {
                    attr: {transform: 'translate(270 40)'},
                    ease: Power4.easeOut
                  }, '-=1.78')
                  .to('#rm-black-slice', 0.75, {
                    attr: {transform: 'translate(64 157)'},
                    ease: Power4.easeOut
                  }, '-=1.78');

    var s4 = new ScrollMagic.Scene({
                              triggerElement: '#retailers',
                              triggerHook: 0.4
                            })
                            .setTween(tl4)
                            .addTo(controller);

    function retailersChart() {
      d3.select('svg.retailers')
        .remove();

      var data = [{ 'vertical': 'Consumer Electronics',
                    'retailer_ownership': 100,
                    'brand_ownership': 0 },
                  { 'vertical': 'Pet Care',
                    'retailer_ownership': 98,
                    'brand_ownership': 2 },
                  { 'vertical': 'Activewear',
                    'retailer_ownership': 96,
                    'brand_ownership': 4 },
                  { 'vertical': 'Home Care',
                    'retailer_ownership': 95,
                    'brand_ownership': 5 },
                  { 'vertical': 'Fashion',
                    'retailer_ownership': 81,
                    'brand_ownership': 19 },
                  { 'vertical': 'Personal Care',
                    'retailer_ownership': 77,
                    'brand_ownership': 23 },
                  { 'vertical': 'Watches & Jewelry',
                    'retailer_ownership': 72,
                    'brand_ownership': 28 },
                  { 'vertical': 'Beauty',
                    'retailer_ownership': 62,
                    'brand_ownership': 38 },
                  { 'vertical': 'Haircare',
                    'retailer_ownership': 53,
                    'brand_ownership': 47 }];

      var margin = {top: 25, right: 10, bottom: 0, left: 20},
          containerWidth = $('.chart-container[data-chart="retailers"]').width(),
          containerHeight = $('.chart-container[data-chart="retailers"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var allValues = d3.set( data.map( ƒ('vertical') ) ).values(); 

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .domain( allValues )
                     .rangeRound([0, width])
                     .paddingInner(0.4)
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['brand_ownership', 'retailer_ownership'])
                     .range(['#FFFFFF', '#009AD7']);

      var stack = d3.stack()
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetExpand);

      var svg = d3.select('.chart-container[data-chart="retailers"]')
                  .append('svg.retailers')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var series = svg.appendMany('g.series', stack.keys(['brand_ownership', 'retailer_ownership'])(data))
                      .attr('fill', d => cScale(d.key));

      series.appendMany('rect', ƒ())
            .attrs({
              'x': d => xScale(d.data.vertical),
              'y': yScale(0),
              'height': 0,
              'width': xScale.bandwidth()
            })
            .transition()
            .duration(1000)
            .delay(function(d, i) { return i * 100; })
            .attrs({
              'y': d => yScale(d[1]),
              'height': d => yScale(d[0]) - yScale(d[1])
            });

      var xAxisGroup = svg.append('g.stack-axis')
                          .translate([0, height]);

      xAxisGroup.call( d3.axisBottom(xScale) )
                .selectAll('.tick text')
                .attrs({
                  'text-anchor': 'start',
                  'transform': 'rotate(-90)',
                  'dx': 5,
                  'dy': -xScale.bandwidth() - 2
                })
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .styles({
                  'opacity': 1,
                  'font-size': '10px'
                });

      series.appendMany('text', ƒ())
            .attrs({
              'x': d => xScale(d.data.vertical) - 10,
              'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
            })
            .translate(function(d) {
              return [xScale.bandwidth() / 2, 5];
            })
            .text(function(d) {
               if (Math.round((d[1] - d[0]) * 100) > 10)
                 return `${ Math.round((d[1] - d[0]) * 100) }%`;
             })
            .styles({
              'fill': 'black',
              'font-weight': 'bold',
              'font-size': '10px'
            });
    }

    var tl5 = new TimelineLite()
                  .to('#dt-bullseye', 0.75, {
                    attr: {transform: 'translate(275 -15)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })

                  .add( dataTargetingChart )

                  .to('#dt-group1', 0.75, {
                    attr: {transform: 'translate(535 130) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })
                  .to('#dt-group2', 0.75, {
                    attr: {transform: 'translate(450 190) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')
                  .to('#dt-group3', 0.75, {
                    attr: {transform: 'translate(495 385) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')
                  .to('#dt-group4', 0.75, {
                    attr: {transform: 'translate(235 25) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')
                  .to('#dt-group5', 0.75, {
                    attr: {transform: 'translate(230 180) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')
                  .to('#dt-group6', 0.75, {
                    attr: {transform: 'translate(270 290) skewX(0) scale(1)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')

                  .to('#dt-arrow', 0.25, {
                    attr: {transform: 'translate(180 258)'},
                    opacity: 1,
                    ease: Power3.easeIn
                  }, '-=0.1')

                  .to('#dt-bullseye', 0.5, {
                    attr: {transform: 'translate(295 -35)'},
                    ease: Back.easeOut.config(2)
                  })
                  .to('#dt-arrow', 0.5, {
                    attr: {transform: 'translate(200 238)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.5')

                  .to('#dt-group1', 0.75, {
                    attr: {transform: 'translate(595 170)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.5')
                  .to('#dt-group2', 0.75, {
                    attr: {transform: 'translate(640 302)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.75')
                  .to('#dt-group3', 0.75, {
                    attr: {transform: 'translate(555 425)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.75')
                  .to('#dt-group4', 0.75, {
                    attr: {transform: 'translate(155 -20)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.75')
                  .to('#dt-group5', 0.75, {
                    attr: {transform: 'translate(120 120)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.75')
                  .to('#dt-group6', 0.75, {
                    attr: {transform: 'translate(220 260)'},
                    ease: Back.easeOut.config(2)
                  }, '-=0.75')

                  .add( dataTargetingBarChart )

                  .to('#dt-bullseye', 0.5, {
                    attr: {transform: 'translate(285 -25)'},
                    ease: Back.easeOut.config(1.4)
                  }, '-=0.2')
                  .to('#dt-arrow', 0.5, {
                    attr: {transform: 'translate(190 248)'},
                    ease: Back.easeOut.config(1.4)
                  }, '-=0.5');

    var s5 = new ScrollMagic.Scene({
                              triggerElement: '#data-targeting',
                              triggerHook: 0.4
                            })
                            .setTween(tl5)
                            .addTo(controller);

    function dataTargetingChart() {
      d3.select('svg.data-targeting')
        .remove();

      var data = [{ 'name': 'Leaders',
                    'val': 13 },
                  { 'name': 'Data-Miners',
                    'val': 24 },
                  { 'name': 'Streamliners',
                    'val': 34 },
                  { 'name': 'Laggards',
                    'val': 29 }];

      var margin = {top: 10, right: 0, bottom: 25, left: 0},
          containerWidth = $('.chart-container[data-chart="data-targeting"]').width(),
          containerHeight = $('.chart-container[data-chart="data-targeting"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name).reverse() )
                     .range([height, 0])
                     .padding(0.2),
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="data-targeting"]')
                  .append('svg.data-targeting')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var greyBar = barGroup.append('rect.grey-bar')
                            .attrs({
                              'width': width,
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            })
                            .styles('opacity', 0);

      greyBar.transition()
             .duration(1000)
             .ease(d3.easePoly)
             .style('opacity', 1);

      var blueBar = barGroup.append('rect.blue-bar')
                            .attrs({
                              'width': xScale(0),
                              'height': yScale.bandwidth(),
                              'y': d => yScale(d.name),
                            });

      blueBar.transition()
             .duration(1000)
             .delay(function(d, i) { return i * 250; })
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) );


      var nameLabel = barGroup.append('text.white-label.neue-bold')
                              .text( ƒ('name') )
                              .attrs({
                                'x': xScale(3),
                                'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                              })
                              .translate(function(d) { 
                                return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                              })
                              .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      nameLabel.transition()
               .duration(1000)
               .ease(d3.easePoly)
               .style('opacity', 1);

      var valLabel = barGroup.append('text.blue-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 40,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '12px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function dataTargetingBarChart() {
      d3.select('svg.data-targeting-bar')
        .remove();

      var margin = {top: 40, right: 50, bottom: 10, left: 125},
          containerWidth = $('.chart-container[data-chart="data-targeting-bar"]').width(),
          containerHeight = $('.chart-container[data-chart="data-targeting-bar"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scaleLinear()
                     .range([width, 0]),
          yScale = d3.scaleBand()
                     .rangeRound([0, height])
                     .paddingInner(0.2)
                     .align(0.2),
          y2Scale = d3.scaleBand()
                      .padding(0.05),
          cScale = d3.scaleOrdinal()
                     .domain(['implements personalized content', 'collects segmentation data'])
                     .range(['#FFFFFF', '#009AD7']);

      var svg = d3.select('.chart-container[data-chart="data-targeting-bar"]')
                  .append('svg.data-targeting-bar')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/data-targeting.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];

        return d;
      }, function(error, data) {
        var keys = data.columns.slice(1);

        yScale.domain(data.map(function(d) { return d.vertical; }));

        y2Scale.domain(keys)
               .rangeRound([0, yScale.bandwidth()]);

        xScale.domain([d3.max(data, function(d) { 
                                       return d3.max(keys, function(key) { 
                                         return d[key]; 
                                       }); 
                                     }), 0]).nice();

        var yAxisGroup = svg.append('g.stack-axis');

        yAxisGroup.call( d3.axisLeft(yScale) )
                  .selectAll('.tick text')
                  .attrs({
                    'text-anchor': 'start',
                    'dx': -110
                  })
                  .style('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles({
                    'opacity': 1,
                    'font-size': '12px'
                  });

        var barGroup = svg.appendMany('g', data)
                          .translate(d => [xScale(0), yScale(d.vertical)]);

        barGroup.appendMany('rect', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'y': d => y2Scale(d.key),
                  'x': xScale(0),
                  'height': y2Scale.bandwidth(),
                  'width': xScale(0),
                  'fill': d => cScale(d.key)
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({
                  'width': d => xScale(d.value)
                });

        barGroup.appendMany('text', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'y': d => y2Scale(d.key),
                  'x': xScale(0),
                  'dx': 10,
                  'dy': (y2Scale.bandwidth() / 2) + 4
                })
                .text(d => `${d.value}%`)
                .styles({
                  'opacity': 0,
                  'fill': d => cScale(d.key),
                  'font-weight': 'bold',
                  'font-size': '12px'
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({ 'x': d => xScale(d.value) })
                .style('opacity', 1);
      });
    }

    var tl6 = new TimelineLite()
                  .to('#m-pool', 1, {
                    attr: {transform: 'translate(70 160)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })

                  .to('#m-wave1', 1, {
                    attr: {transform: 'translate(460 145)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#m-wave2', 1, {
                    attr: {transform: 'translate(290 215)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.75')
                  .to('#m-wave3', 1, {
                    attr: {transform: 'translate(450 240)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.75')

                  .to('#m-phone-top', 0.75, {
                    attr: {transform: 'translate(216.5 73)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#m-phone-base', 0.75, {
                    attr: {transform: 'translate(215 70)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.75')
                  .to('#m-phone-bg', 0.75, {
                    attr: {transform: 'translate(242 52)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.75')

                  .to('#m-slide', 0.75, {
                    attr: {transform: 'translate(140 80)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.6')

                  .add(mobileChart)

                  .to('#m-tube1', 0.6, {
                    attr: {transform: 'translate(145 130)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.5')
                  .to('#m-tube2', 0.6, {
                    attr: {transform: 'translate(145 120)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#m-tube3', 0.6, {
                    attr: {transform: 'translate(145 110)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')
                  .to('#m-tube4', 0.6, {
                    attr: {transform: 'translate(110 120)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')

                  .to('#m-ladder', 0.6, {
                    attr: {transform: 'translate(550 125)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  }, '-=0.4')

                  .to('#m-ball', 0.6, {
                    attr: {transform: 'translate(210 65)'},
                    opacity: 1,
                    ease: Power4.easeOut
                  })
                  .to('#m-ball', 0.6, {
                    attr: {transform: 'translate(310 220)'},
                  }, '-=0.3');

    var s6 = new ScrollMagic.Scene({
                              triggerElement: '#mobile',
                              triggerHook: 0.4
                            })
                            .setTween(tl6)
                            .addTo(controller);

    function mobileChart() {
      d3.select('svg.mobile')
        .remove();

      var margin = {top: 0, right: 10, bottom: 0, left: 20},
          containerWidth = $('.chart-container[data-chart="mobile"]').width(),
          containerHeight = $('.chart-container[data-chart="mobile"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.4)
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .range(['#009AD7', '#FFFFFF', '#999999']);

       d3.csv('js/mobile.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(2);

        xScale.domain(data.map(function(d) { return d.vertical; }));
        cScale.domain(keys);

        var stack = d3.stack()
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetExpand);

        var svg = d3.select('.chart-container[data-chart="mobile"]')
                    .append('svg.mobile')
                    .attrs({
                      'width': width + margin.left + margin.right,
                      'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .translate([margin.left, margin.top]);

        var series = svg.appendMany('g.series', stack.keys(keys)(data))
                        .attr('fill', d => cScale(d.key));

        series.appendMany('rect', ƒ())
              .attrs({
                'x': d => xScale(d.data.vertical),
                'y': yScale(0),
                'height': 0,
                'width': xScale.bandwidth()
              })
              .transition()
              .duration(1000)
              .delay(function(d, i) { return i * 100; })
              .attrs({
                'y': d => yScale(d[1]),
                'height': d => yScale(d[0]) - yScale(d[1])
              });

        var xAxisGroup = svg.append('g.stack-axis')
                            .translate([0, height]);

        xAxisGroup.call( d3.axisBottom(xScale) )
                  .selectAll('.tick text')
                  .attrs({
                    'text-anchor': 'start',
                    'transform': 'rotate(-90)',
                    'dx': 5,
                    'dy': -xScale.bandwidth() - 2
                  })
                  .style('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles({
                    'opacity': 1,
                    'font-size': '10px'
                  });

        series.appendMany('text', ƒ())
              .attrs({
                'x': d => xScale(d.data.vertical) - 10,
                'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
              })
              .translate([xScale.bandwidth() / 2, 5])
              .text(function(d) {
                 if (Math.round((d[1] - d[0]) * 100) > 10)
                   return `${ Math.round((d[1] - d[0]) * 100) }%`;
               })
              .styles({
                'fill': 'black',
                'font-weight': 'bold',
                'font-size': '10px'
              });
      });
    }

    var tl7 = new TimelineLite()
                  .to('#omnichannel-cover', 0.75, {opacity: 1})
                  .to('#content-cover', 0.75, {opacity: 1}, '-=0.5')
                  .to('#mobile-cover', 0.75, {opacity: 1}, '-=0.5')
                  .to('#loyalty-cover', 0.75, {opacity: 1}, '-=0.5')
                  .to('#social-cover', 0.75, {opacity: 1}, '-=0.5')
                  .to('#retailer-cover', 0.75, {opacity: 1}, '-=0.5')
                  .to('#data-cover', 0.75, {opacity: 1}, '-=0.5');

    var s7 = new ScrollMagic.Scene({
                              triggerElement: '#reports',
                              triggerHook: 0.4
                            })
                            .setTween(tl7)
                            .addTo(controller);

    function axisWrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text()
                        .split(/\s+/)
                        .reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr('y'),
            dy = parseFloat( text.attr('dy') ),
            tspan = text.text(null)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', y)
                        .attr('dy', dy + 'em');

        while ( word = words.pop() ) {
          line.push(word);
          tspan.text( line.join(' ') );

          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan')
                        .attr('x', 0)
                        .attr('y', y)
                        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                        .text(word);
          }
        }
      });
    } 

    var contentSections = $('.scroll'),
        navigationItems = $('.cd-vertical-nav a');

    navigationItems.on('click', function(event){
      event.preventDefault();

      smoothScroll( $(this.hash) );
    });

    $('#cd-vertical-nav a').on('click', function(){
      $('.touch #cd-vertical-nav').removeClass('current');
    });

    function updateNav() {
      contentSections.each(function() { 
        $this = $(this);

        var activeSection = $('.cd-vertical-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1,
            section = $('.cd-vertical-nav li')[activeSection];

        if ( ( $this.offset().top - $(window).height() / 2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height() / 2 > $(window).scrollTop()) ) {
          $(section).addClass('current');
        } else {
          $(section).removeClass('current');
        }
      });
    }

    function smoothScroll(target) {
      $('body, html').animate(
        {'scrollTop': target.offset().top - 50},
        600
      );
    }

    updateNav();

    $(window).on('scroll', function() { updateNav(); });
  }

  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});