var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) || $(window).innerWidth > 1030;
    window.myEvent = isMobile ? 'touchstart' : 'click';

    const ƒ = d3.f;

    const lemon = '#FEC10D';   

    var tl0 = new TimelineLite().to('#click1', 1, {opacity: 1}, '+=0.75')
                                .add( enableClick );

    var visitedPaths = [];
    
    function enableClick() {
      if (!isMobile) {
        $('body').on(window.myEvent, '.js-trigger', function(e) {
          let path = $(e.target).data('path'),
              goto = $(e.target).data('goto'),
              func = $(e.target).data('func');

          $('#new-path-popup').removeClass('end-path');

          moveOn({path: path, goto: goto, func: func});
        });
      }
    }

    function moveOn(slide) {
      console.log(slide);

      let url = `//interactive.l2inc.com/social_commerce/${ slide.path }${ slide.goto }.html`;

      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function() {
          $('#new-path-popup').addClass('js-hide');
          $('#slide').remove();  
        },
        complete: function() {},
        success: function(data) {
          $('#slide-container').html( $(data).siblings('#slide') )
                               .hide()
                               .fadeIn(400, function() {
                                 if (slide.func) 
                                   eval(slide.func);
                               });

          $('#click-or-tap').text(function() {
            return window.isMobile ? 'Tap' : 'Click';
          });

          // $('svg').attr('height', function() {
          //   return window.isMobile ? 750 : 400;
          // });
        },
        error: function() {}
      });
    }

    // FACEBOOK - SHOP NOW BUTTON
    // sn = shop now
    function sn1() {
      var sntl1 = new TimelineLite().to('#sn-screen1', 1, {opacity: 1})
                                    .to('#sn-circle', 0.75, {opacity: 1}, '-=0.4')
                                    .to('#click2', 1, {opacity: 1})
                                    .add( sn1point1 );
      
      function sn1point1() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#sn-text1').fadeOut(function() {
            $('#sn-text2').fadeIn(function() {
              sn1point2();
            });
          });
        });
      }

      function sn1point2() {
        var sntl2 = new TimelineLite().to('#sn-screen1', 1, {
                                        attr: {transform: 'translate(230 35)'},
                                        ease: Power4.easeOut
                                      })
                                      .to('#sn-circle', 1, {
                                        attr: {transform: 'translate(615 190)'},
                                        ease: Power4.easeOut
                                      }, '-=1')
                                      .to('#sn-line', 1, {opacity: 1}, '-=0.25')
                                      .to('#sn-buttons', 1, {opacity: 1}, '-=0.5');

        $('#click2').animate({opacity: 0});

        $('#sn-buttons .button').on(window.myEvent, function() {
          var label = $(this).children().text();

          snChart(label);

          $('#sn-text2').fadeOut(function() {
            $('#sn-text3').fadeIn(function() {
              $('#click2').animate({opacity: 1});

              sn1point3();
            });
          });
        });
      }

      function sn1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#sn-text3').fadeOut(function() {
            $('#sn-text4').fadeIn(function() {
              sn1point4();
            });
          });
        });
      }

      function sn1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'facebook', path: 'sn'});
        });
      }
    }

    function snChart(label) {
      $('#sn-buttons').fadeOut();

      var data = [{ 'label': 'Site Homepage',
                    'val': 77 },
                  { 'label': 'Store Locator',
                    'val': 5 },
                  { 'label': 'Category Page',
                    'val': 4 },
                  { 'label': 'Product Page',
                    'val': 4 },
                  { 'label': 'Other',
                    'val': 10 }];

      var margin = {top: 38, right: 0, bottom: 25, left: 120},
          width = 300,
          height = 300,
          radius = Math.min(width, height) / 3;
                    
      var svg = d3.select('svg.sn-pie')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate( [(width / 3) + margin.left, (height / 4) + margin.top] );

      var arc = d3.arc()
                  .innerRadius(radius * 0.5)
                  .outerRadius(radius);

      var pie = d3.pie()
                  .startAngle(0 * Math.PI)
                  .endAngle(100 * Math.PI)
                  .padAngle(0.05)
                  .value( ƒ('val') )
                  .sort(null);

      var text = d3.select('#sn-choice')
                    .html(`You've chosen ${ label }`);

      text.transition()
          .duration(1000)
          .style('opacity', 1);

      var slice = svg.appendMany('g.slice', pie(data));

      slice.append('path')
           .transition()
           .duration(1000)
           .delay((d, i) => i * 150)
           .styles({
             'fill': lemon,
             'opacity': function(d) {
               return label === d.data.label ? 1 : 0.35;
             }
           })
           .attrTween('d', function(d) {
             var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);

             return function(t) {
               d.endAngle = i(t); 

               return arc(d);
             }
           })
           .each((d, i) => this._current = i);

      var label = slice.append('text.label')
                       .attrs({
                         'transform': function(d, i) { 
                           var c = arc.centroid(d);
                           c[0] *= 1.5;
                           c[1] *= 1.5;

                           return `translate(${ c })`;
                         },
                         'dy': '0.35em',
                         'text-anchor': function(d, i) {
                           return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start';
                         }
                       })
                       .text(function(d) {
                         return `${ d.data.val }% ${ d.data.label }`;
                       })
                       .styles({
                         'fill': function(d) {
                           return label === d.data.label ? lemon : 'white';
                         },
                         'font-size': '12px',
                         'opacity': 0
                       });

      label.transition()
           .duration(1000)
           .style('opacity', 1);

      var title = d3.select('#sn-title')
                    .html('Share of “Shop Now” Button Landing Pages');

      title.transition()
          .duration(1000)
          .style('opacity', 1);
    } 

    // FACEBOOK - SHOPPABLE PAGES
    // sp = shoppable pages
    function sp1() {
      var sptl1 = new TimelineLite().to('#sp-screen1', 1, {opacity: 1})
                                    .to('#sp-screen2', 1, {opacity: 1}, '-=0.4')
                                    .to('#sp-circle', 0.75, {opacity: 1})
                                    .to('#sp-circle2', 0.75, {opacity: 1}, '-=0.4')
                                    .to('#click3', 1, {opacity: 1})
                                    .add( sp1point1 );

      function sp1point1() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#sp-text1').fadeOut(function() {
            $('#sp-text2').fadeIn(function() {
              var sptl2 = new TimelineLite().to('#sp-screen1', 1, {opacity: 0})
                                            .to('#sp-circle', 0.75, {opacity: 0}, '-=1')
                                            .to('#sp-screen2', 1, {opacity: 0}, '-=1')
                                            .to('#sp-circle2', 0.75, {opacity: 0}, '-=1')
                                            .to('#sp-screen3', 1, {opacity: 1})
                                            .to('#sp-line', 1, {opacity: 1}, '-=0.6')
                                            .to('#sp-screen4', 1, {
                                              attr: {transform: 'translate(795 35)'},
                                              opacity: 1,
                                              ease: Power4.easeOut
                                            }, '-=0.7')
                                            .add( sp1point2 );
            });
          });
        });
      }

      function sp1point2() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#sp-text2').fadeOut(function() {
            $('#sp-text3').fadeIn(function() {
              var sptl3 = new TimelineLite().to('#sp-screen3', 1, {opacity: 0})
                                            .to('#sp-line', 1, {opacity: 0}, '-=1')
                                            .add( spChart )
                                            .to('#sp-screen4', 1, {opacity: 0}, '-=1')
                                            .add( sp1point3, 2 );
            });
          });
        });
      }

      function sp1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#sp-text3').fadeOut(function() {
            $('#sp-text4').fadeIn(function() {
              var sptl4 = new TimelineLite().to('.sp-chart', 1, {opacity: 0})
                                            .to('#sp-title', 1, {opacity: 0}, '-=1')
                                            .to('#sp-subtitle', 1, {opacity: 0}, '-=1')
                                            .to('#sp-screen5', 1, {opacity: 1})
                                            .to('#sp-arrow', 1, {opacity: 1}, '-=0.6')
                                            .to('#sp-screen6', 1, {opacity: 1}, '-=0.6')
                                            .to('#sp-arrow2', 1, {opacity: 1}, '-=0.6')
                                            .to('#sp-screen7', 1, {opacity: 1}, '-=0.6')
                                            .add( sp1point4 );
            });
          });
        });
      }

      function sp1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'facebook', path: 'sp'});
        });
      }
    }

    function spChart() {
      var margin = {top: 100, right: 200, bottom: 75, left: 200},
          containerWidth = 1440,
          containerHeight = 400,
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.2),
          x2Scale = d3.scaleBand()
                      .padding(0.05),
          yScale = d3.scaleLinear()
                     .range([height, 0]);

      var svg = d3.select('svg.sp-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/fb-sp.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        xScale.domain( data.map(function(d) { return d.vertical; }) );

        x2Scale.domain(keys)
               .rangeRound( [0, xScale.bandwidth()] );

        yScale.domain( [0, d3.max(data, function(d) { 
                                          return d3.max( keys, function(key) { 
                                            return d[key]; 
                                          }); 
                                        })] ).nice();

        var title = d3.select('#sp-title')
                      .html('Adoption of Shoppable Pages on Facebook and Instagram by Vertical');

        title.transition()
            .duration(1000)
            .style('opacity', 1);

        var subtitle = d3.select('#sp-subtitle')
                         .html(`July 2018, n=424 Brands <div class="inline-block / ml1">
                                <div class="inline-block / ml4">
                                  <div class="lemon-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Facebook</h6>
                                </div>

                                <div class="inline-block / ml4">
                                  <div class="lemon35-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Instagram</h6>
                                </div>
                              </div>`);

        subtitle.transition()
                .duration(1000)
                .style('opacity', 1);

        var xAxisGroup = svg.append('g.axis')
                            .translate([0, height]);

        xAxisGroup.call( d3.axisBottom(xScale) )
                  .selectAll('.tick text')
                  .attr('text-anchor', 'middle')
                  .translate([0, 10])
                  .styles('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles('opacity', 1)
                  .call(axisWrap, xScale.bandwidth());

        var fbAvg = svg.append('line.avg-line')
                       .attrs({
                        'x1': 0,
                        'y1': yScale(19),
                        'x2': width,
                        'y2': yScale(19)
                       });

        var fbAvgText = svg.append('text.label')
                           .text('Facebook Average: 19%')
                           .attrs({
                            'x': width,
                            'y': yScale(19),
                            'dy': -10,
                           })
                           .styles({
                             'fill': lemon,
                             'text-anchor': 'end'
                           });

        var igAvg = svg.append('line.avg-line')
                       .attrs({
                        'x1': 0,
                        'y1': yScale(50),
                        'x2': width,
                        'y2': yScale(50)
                       })
                       .style('opacity', 0.35);

        var igAvgText = svg.append('text.label')
                           .text('Instagram Average: 50%')
                           .attrs({
                            'x': width,
                            'y': yScale(50),
                            'dy': -10,
                           })
                           .styles({
                             'fill': lemon,
                             'opacity': 0.35,
                             'text-anchor': 'end'
                           });

        var barGroup = svg.appendMany('g', data)
                          .translate(d => [xScale(d.vertical), 0]);

        barGroup.appendMany('rect', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': d => yScale(0),
                  'width': x2Scale.bandwidth(),
                  'height': 0,
                  'fill': lemon
                })
                .style('opacity', function(d) {
                  return d.key === 'facebook' ? 1 : 0.35;
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({
                  'y': d => yScale(d.value),
                  'height': d => height - yScale(d.value)
                });

        barGroup.appendMany('text.label', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': yScale(0),
                  'dx': x2Scale.bandwidth() / 4,
                  'dy': function(d) {
                    return d.value > 0 ? -12 : 0;
                  }
                })
                .text(d => `${d.value}%`)
                .styles({
                  'opacity': 0,
                  'fill': lemon
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({ 'y': d => yScale(d.value) })
                .style('opacity', function(d) {
                  return d.key === 'facebook' ? 1 : 0.35;
                });
      });
    }

    // FACEBOOK - DARK POSTS
    // dp = dark posts
    function dp1() {
      var dptl1 = new TimelineLite().to('#dp-screen1', 1, {opacity: 1})
                                    .to('#click4', 1, {opacity: 1})
                                    .add( dp1point1 );

      function dp1point1() {
        let clickCount = 0;

        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#dp-text1').fadeOut(function() {
            $('#dp-text2').fadeIn(function() {
              var dptl2 = new TimelineLite().to('#dp-screen2', 1, {opacity: 1})
                                            .to('#dp-screen1', 1, {opacity: 0}, '-=1')
                                            .to('#dp-line', 0.75, {opacity: 1}, '-=0.4')
                                            .add( dp1point2 );
            });
          });
        });
      }

      function dp1point2() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#dp-text2').fadeOut(function() {
            $('#dp-text3').fadeIn(function() {
              var dptl3 = new TimelineLite().to('#dp-screen2', 1, {opacity: 0})
                                            .to('#dp-line', 1, {opacity: 0}, '-=1')
                                            .to('#dp-screen3', 1, {opacity: 1})
                                            .to('#dp-screen4', 1, {opacity: 1}, '-=0.6')
                                            .to('#dp-screen5', 1, {opacity: 1}, '-=0.6')
                                            .add( dp1point3 );
            });
          });
        });
      }

      function dp1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#dp-text3').fadeOut(function() {
            $('#dp-text4').fadeIn(function() {
              var dptl4 = new TimelineLite().to('#dp-screen3', 1, {opacity: 0})
                                            .to('#dp-screen4', 1, {opacity: 0}, '-=1')
                                            .to('#dp-screen5', 1, {opacity: 0}, '-=1')
                                            .add( dpChart )
                                            .add( dp1point4, 2 );
            });
          });
        });
      }

      function dp1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'facebook', path: 'dp'});
        });
      }
    }

    function dpChart() {
      var margin = {top: 125, right: 200, bottom: 35, left: 200},
          containerWidth = 1440,
          containerHeight = 400,
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.2),
          x2Scale = d3.scaleBand()
                      .padding(0.05),
          yScale = d3.scaleLinear()
                     .range([height, 0]);

      var svg = d3.select('svg.dp-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/fb-dp.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        xScale.domain( data.map(function(d) { return d.vertical; }) );

        x2Scale.domain(keys)
               .rangeRound( [0, xScale.bandwidth()] );

        yScale.domain( [0, d3.max(data, function(d) { 
                                          return d3.max( keys, function(key) { 
                                            return d[key]; 
                                          }); 
                                        })] ).nice();

        var title = d3.select('#dp-title')
              .html('Adoption of Features on Facebook Ads by Vertical ');

        title.transition()
            .duration(1000)
            .style('opacity', 1);

        var subtitle = d3.select('#dp-subtitle')
                         .html(`August 2018, n=103 Brands <div class="inline-block / ml1">
                                <div class="inline-block / ml4">
                                  <div class="lemon-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Ad Adoption</h6>
                                </div>

                                <div class="inline-block / ml4">
                                  <div class="lemon60-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Video</h6>
                                </div>

                                <div class="inline-block / ml4">
                                  <div class="lemon35-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Shop Now</h6>
                                </div>
                              </div>`);

        subtitle.transition()
                .duration(1000)
                .style('opacity', 1);

        var xAxisGroup = svg.append('g.axis')
                            .translate([0, height]);

        xAxisGroup.call( d3.axisBottom(xScale) )
                  .selectAll('.tick text')
                  .attr('text-anchor', 'middle')
                  .translate([0, 10])
                  .styles('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles('opacity', 1)
                  .call(axisWrap, xScale.bandwidth());

        var barGroup = svg.appendMany('g', data)
                          .translate(d => [xScale(d.vertical), 0]);

        barGroup.appendMany('rect', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': d => yScale(0),
                  'width': x2Scale.bandwidth(),
                  'height': 0,
                  'fill': lemon
                })
                .style('opacity', function(d) {
                  switch (d.key) {
                    case 'ad':
                      return 1;
                      break;
                    case 'video':
                      return 0.6;
                      break;
                    case 'shop_now':
                      return 0.35;
                      break;
                  }
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({
                  'y': d => yScale(d.value),
                  'height': d => height - yScale(d.value)
                });

        barGroup.appendMany('text.label', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': yScale(0),
                  'dx': x2Scale.bandwidth() / 4,
                  'dy': function(d) {
                    return d.value > 0 ? -12 : 0;
                  }
                })
                .text(d => `${d.value}%`)
                .styles({
                  'opacity': 0,
                  'fill': lemon
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({ 'y': d => yScale(d.value) })
                .style('opacity', function(d) {
                  switch (d.key) {
                    case 'ad':
                      return 1;
                      break;
                    case 'video':
                      return 0.6;
                      break;
                    case 'shop_now':
                      return 0.35;
                      break;
                  }
                });
      });
    }

    // INSTAGRAM - SHOPPABLE PAGES
    // igsp = instagram shoppable pages
    function igsp1() {
      var igsptl1 = new TimelineLite().to('#igsp-screen1', 1, {opacity: 1})
                                      .to('#igsp-arrow', 0.75, {opacity: 1}, '-=0.4')
                                      .to('#igsp-screen2', 1, {opacity: 1}, '-=0.4')
                                      .to('#igsp-circle', 0.75, {opacity: 1}, '-=0.4')
                                      .to('#click5', 1, {opacity: 1})
                                      .add( igsp1point1 );

      function igsp1point1() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#igsp-text1').fadeOut(function() {
            $('#igsp-text2').fadeIn(function() {
              var igsptl2 = new TimelineLite().to('#igsp-screen1', 1, {opacity: 0})
                                              .to('#igsp-circle', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-arrow', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-screen2', 1, {opacity: 0}, '-=1')

                                              .to('#igsp-screen3', 1, {opacity: 1})
                                              .to('#igsp-arrow2', 0.75, {opacity: 1}, '-=0.4')
                                              .to('#igsp-screen4', 1, {opacity: 1}, '-=0.4')
                                              .to('#igsp-arrow3', 0.75, {opacity: 1}, '-=0.4')
                                              .to('#igsp-screen5', 1, {opacity: 1}, '-=0.4')
                                              .to('#igsp-circle2', 0.75, {opacity: 1}, '-=0.4')
                                              .to('#igsp-square', 0.75, {opacity: 1}, '-=0.4')
                                              .to('#igsp-circle3', 0.75, {opacity: 1}, '-=0.4')
                                              .add( igsp1point2 );
            });
          });
        });
      }

      function igsp1point2() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#igsp-text2').fadeOut(function() {
            $('#igsp-text3').fadeIn(function() {
              var igsptl3 = new TimelineLite().to('#igsp-screen3', 1, {opacity: 0})
                                              .to('#igsp-arrow2', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-screen4', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-arrow3', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-screen5', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-circle2', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-square', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-circle3', 1, {opacity: 0}, '-=1')
                                              .to('#igsp-screen6', 1, {opacity: 1})
                                              .add( igsp1point3 );
            });
          });
        });
      }

      function igsp1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#igsp-text3').fadeOut(function() {
            $('#igsp-text4').fadeIn(function() {
              var igsptl4 = new TimelineLite().to('#igsp-screen6', 1, {opacity: 0})
                                              .add( igspChart )
                                              .add( igsp1point4, 2 );
            });
          });
        });
      }

      function igsp1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#igsp-text4').fadeOut(function() {
            $('#igsp-text5').fadeIn(function() {
              var igsptl5 = new TimelineLite().to('#igsp-dtc', 1, {opacity: 1})
                                              .add( igsp1point5 );
            });
          });
        });
      }  

      function igsp1point5() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'instagram', path: 'sp'});
        });
      }                    
    }

    function igspChart() {
      var margin = {top: 50, right: 200, bottom: 75, left: 200},
          containerWidth = 1440,
          containerHeight = 400,
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.2),
          x2Scale = d3.scaleBand()
                      .padding(0.05),
          yScale = d3.scaleLinear()
                     .range([height, 0]);

      var svg = d3.select('svg.igsp-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/ig-sp.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        xScale.domain( data.map(function(d) { return d.vertical; }) );

        x2Scale.domain(keys)
               .rangeRound( [0, xScale.bandwidth()] );

        yScale.domain( [0, d3.max(data, function(d) { 
                                          return d3.max( keys, function(key) { 
                                            return d[key]; 
                                          }); 
                                        })] ).nice();

        var title = d3.select('#igsp-title')
                      .html('Adoption of Shoppable Pages on Facebook and Instagram by Vertical');

        title.transition()
            .duration(1000)
            .style('opacity', 1);

        var subtitle = d3.select('#igsp-subtitle')
                         .html(`July 2018, n=424 Brands <div class="inline-block / ml1">
                                <div class="inline-block / ml4">
                                  <div class="lemon-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Facebook</h6>
                                </div>

                                <div class="inline-block / ml4">
                                  <div class="lemon35-square / vam / w1 h1 / inline-block"></div>
                                  <h6 class="white / neue-bold / vam / ml2 / inline-block">Instagram</h6>
                                </div>
                              </div>`);

        subtitle.transition()
                .duration(1000)
                .style('opacity', 1);

        var xAxisGroup = svg.append('g.axis')
                            .translate([0, height]);

        xAxisGroup.call( d3.axisBottom(xScale) )
                  .selectAll('.tick text')
                  .attr('text-anchor', 'middle')
                  .translate([0, 10])
                  .styles('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles('opacity', 1)
                  .call(axisWrap, xScale.bandwidth());

        var fbAvg = svg.append('line.avg-line')
                       .attrs({
                        'x1': 0,
                        'y1': yScale(19),
                        'x2': width,
                        'y2': yScale(19)
                       });

        var fbAvgText = svg.append('text.label')
                           .text('Facebook Average: 19%')
                           .attrs({
                            'x': width,
                            'y': yScale(19),
                            'dy': -10,
                           })
                           .styles({
                             'fill': lemon,
                             'text-anchor': 'end'
                           });

        var igAvg = svg.append('line.avg-line')
                       .attrs({
                        'x1': 0,
                        'y1': yScale(50),
                        'x2': width,
                        'y2': yScale(50)
                       })
                       .style('opacity', 0.35);

        var igAvgText = svg.append('text.label')
                           .text('Instagram Average: 50%')
                           .attrs({
                            'x': width,
                            'y': yScale(50),
                            'dy': -10,
                           })
                           .styles({
                             'fill': lemon,
                             'opacity': 0.35,
                             'text-anchor': 'end'
                           });

        var barGroup = svg.appendMany('g', data)
                          .translate(d => [xScale(d.vertical), 0]);

        barGroup.appendMany('rect', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': d => yScale(0),
                  'width': x2Scale.bandwidth(),
                  'height': 0,
                  'fill': lemon
                })
                .style('opacity', function(d) {
                  return d.key === 'facebook' ? 1 : 0.35;
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({
                  'y': d => yScale(d.value),
                  'height': d => height - yScale(d.value)
                });

        barGroup.appendMany('text.label', function(d) {
                  return keys.map(function(key) {
                    return {key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': yScale(0),
                  'dx': x2Scale.bandwidth() / 4,
                  'dy': function(d) {
                    return d.value > 0 ? -12 : 0;
                  }
                })
                .text(d => `${d.value}%`)
                .styles({
                  'opacity': 0,
                  'fill': lemon
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({ 'y': d => yScale(d.value) })
                .style('opacity', function(d) {
                  return d.key === 'facebook' ? 1 : 0.35;
                });
      });
    }

    // INSTAGRAM - STORIES
    // is = instagram stories
    function is1() {
      var istl1 = new TimelineLite().to('#is-screen1', 1, {opacity: 1})
                                    .to('#is-screen2', 1, {opacity: 1}, '-=0.6')
                                    .to('#is-screen3', 1, {opacity: 1}, '-=0.6')
                                    .to('#click6', 1, {opacity: 1})
                                    .add( is1point1 );

      function is1point1() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#is-text1').fadeOut(function() {
            $('#is-text2').fadeIn(function() {
              var istl2 = new TimelineLite().to('#is-screen1', 1, {opacity: 0})
                                            .to('#is-screen2', 1, {opacity: 0}, '-=1')
                                            .to('#is-screen3', 1, {opacity: 0}, '-=1')
                                            .to('#is-screen4', 1, {opacity: 1})
                                            .add( is1point2 );
            });
          });
        });
      }   

      function is1point2() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#is-text2').fadeOut(function() {
            $('#is-text3').fadeIn(function() {
              var istl3 = new TimelineLite().to('#is-screen4', 1, {opacity: 0})
                                            .add( isChart )
                                            .add( is1point3, 2 );
            });
          });
        });
      }   

      function is1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#is-text3').fadeOut(function() {
            $('#is-text4').fadeIn(function() {
              var istl4 = new TimelineLite().add( isChart2 )
                                            .to('.is-chart', 1, {
                                              attr: {x: 280},
                                              ease: Power4.easeOut
                                            })
                                            .to('#is-arrow', 0.75, {opacity: 1}, '-=0.4')
                                            .add( is1point4 );
            });
          });
        });
      }

      function is1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#is-text4').fadeOut(function() {
            $('#is-text5').fadeIn(function() {
              var istl5 = new TimelineLite().to('.is-chart', 1, {opacity: 0})
                                            .to('.is-chart2', 1, {opacity: 0}, '-=1')
                                            .to('foreignObject', 1, {opacity: 0}, '-=1')
                                            .to('#is-arrow', 1, {opacity: 0}, '-=1')

                                            .to('#is-screen5', 1, {opacity: 1})
                                            .to('#is-shot', 1, {opacity: 1}, '-=1')
                                            .to('#is-arrow2', 0.75, {opacity: 1}, '-=0.4')
                                            .to('#is-screen6', 1, {opacity: 1}, '-=0.4')
                                            .to('#is-shot2', 1, {opacity: 1}, '-=1')
                                            .add( is1point5 );
            });
          });
        });
      }

      function is1point5() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'instagram', path: 'is'});
        });
      }
    }

    function isChart() {
      var data = [{ 'label': 'Brand Site',
                    'val': 77 },
                  { 'label': 'Social',
                    'val': 14 },
                  { 'label': 'E-Tailer',
                    'val': 4 },
                  { 'label': 'Invalid',
                    'val': 2 },
                  { 'label': 'Other',
                    'val': 3 }];

      var margin = {top: 75, right: 0, bottom: 25, left: 120},
          width = 400,
          height = 400,
          radius = Math.min(width, height) / 3;
                    
      var svg = d3.select('svg.is-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate( [(width / 3) + margin.left, (height / 4) + margin.top] );

      var arc = d3.arc()
                  .innerRadius(radius * 0.5)
                  .outerRadius(radius);

      var pie = d3.pie()
                  .startAngle(0 * Math.PI)
                  .endAngle(100 * Math.PI)
                  .padAngle(0.035)
                  .value( ƒ('val') )
                  .sort(null);

      var title = d3.select('#is-title')
                    .html('Share of Instagram Story Landing Pages');

      title.transition()
          .duration(1000)
          .style('opacity', 1);

      var subtitle = d3.select('#is-subtitle')
                       .html('June–July 2018, n=1,287 Stories Using the Swipe-Up Function Across 90 Brands');

      subtitle.transition()
              .duration(1000)
              .style('opacity', 1);

      var slice = svg.appendMany('g.slice', pie(data));

      slice.append('path')
           .transition()
           .duration(1000)
           .delay((d, i) => i * 150)
           .style('fill', lemon)
           .attrTween('d', function(d) {
             var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);

             return function(t) {
               d.endAngle = i(t); 

               return arc(d);
             }
           })
           .each((d, i) => this._current = i);

      var label = slice.append('text.label')
                       .attrs({
                         'transform': function(d, i) { 
                           switch (i) {
                             case 3:
                               var val = 1.55;
                               break;
                             case 4:
                               var val = 1.65;
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
                         return `${ d.data.val }% ${ d.data.label }`;
                       })
                       .styles({
                         'fill': 'white',
                         'font-size': '12px',
                         'opacity': 0
                       });

      label.transition()
           .duration(1000)
           .style('opacity', 1);
    }

    function isChart2() {
      d3.select('.is-chart g')
        .selectAll('.slice')
        .transition()
        .duration(1000)
        .delay(function(d, i) { return i * 150; })
        .style('opacity', function(d) {
          if (d.data.label !== 'Brand Site')
            return 0.35;
        })
        .select('text')
        .transition()
        .duration(1000)
        .delay(function(d, i) { return i * 150; })
        .style('fill', function(d) {
          if (d.data.label === 'Brand Site')
            return lemon;
        });

      var data = [{ 'vertical': 'Brand Site Landing Page',
                    'Other': 2,
                    'Category Landing Page': 20,
                    'Guided Selling Tool': 37,
                    'Product Page': 41 }];

      var margin = {top: 40, right: 200, bottom: 25, left: 10},
          containerWidth = 400,
          containerHeight = 325,
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var allValues = d3.set( data.map( ƒ('vertical') ) ).values(); 

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .domain( allValues )
                     .rangeRound([0, width])
                     .padding(0.4)
                     .align(0.2);

      var stack = d3.stack()
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetExpand);

      var svg = d3.select('svg.is-chart2')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var series = svg.appendMany('g.series', stack.keys(['Product Page', 'Guided Selling Tool', 'Category Landing Page', 'Other'])(data))
                      .attr('fill', lemon);

      series.appendMany('rect', ƒ())
            .attrs({
              'x': d => xScale(d.data.vertical),
              'y': yScale(0),
              'height': 0,
              'width': xScale.bandwidth()
            })
            .styles({
              'stroke': 'black',
              'stroke-width': '4px'
            })
            .transition()
            .duration(1000)
            .delay(function(d, i) { return i * 100; })
            .attrs({
              'y': d => yScale(d[1]),
              'height': d => yScale(d[0]) - yScale(d[1])
            });

      var xAxisGroup = svg.append('g.stack-axis')
                          .translate([55, -72]);

      xAxisGroup.call( d3.axisRight(xScale) )
                .selectAll('.tick text')
                .attrs({
                  'text-anchor': 'middle',
                  'dy': -10
                })
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .styles({ 'opacity': 1 });

      var legend = series.append('g')
                         .attr('class', 'legend')
                         .translate(function(d) {
                           return [(xScale(d[0].data.vertical) + xScale.bandwidth()), (yScale(d[0][0]) + yScale(d[0][1])) / 2];
                         });

      legend.append('text.label')
            .attrs({
              'x': 9,
              'dy': '0.35em'
            })
            .text(function(d) { 
              return `${ Math.round((d[0][1] - d[0][0]) * 100) }% ${ d.key }`; 
            })
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);
    }

    // INSTAGRAM - INFLUENCERS
    // if = influencers
    function if1() {
      var iftl1 = new TimelineLite().to('#if-screen1', 1, {opacity: 1})
                                    .to('#click7', 1, {opacity: 1})
                                    .add( if1point1 );

      function if1point1() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#if-text1').fadeOut(function() {
            $('#if-text2').fadeIn(function() {
              var iftl2 = new TimelineLite().to('#if-screen1', 1, {
                                              attr: {transform: 'translate(515 10)'},
                                              ease: Power4.easeOut
                                            })
                                            .to('#if-screen2', 1, {opacity: 1})
                                            .add( if1point2 );
            });
          });
        });
      }

      function if1point2() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#if-text2').fadeOut(function() {
            $('#if-text3').fadeIn(function() {
              var iftl3 = new TimelineLite().to('#if-screen1', 1, {opacity: 0})
                                            .to('#if-screen2', 1, {opacity: 0}, '-=1')
                                            .add( ifChart )
                                            .to('#if-arrow', 0.75, {opacity: 1})
                                            .add( ifChart2, '-=0.4' )
                                            .add( if1point3, 2 );
            });
          });
        });
      }

      function ifChart() {
        var data = [{ 'label': 'Brand Featured',
                      'val': 41.9 },
                    { 'label': 'Brand Not Featured',
                      'val': 58.1 }];

        var margin = {top: 75, right: 50, bottom: 25, left: 165},
            width = 400,
            height = 400,
            radius = Math.min(width, height) / 3;
                      
        var svg = d3.select('svg.if-chart')
                    .attrs({
                      'width': width + margin.left + margin.right,
                      'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .translate( [(width / 3) + margin.left, (height / 4) + margin.top] );

        var arc = d3.arc()
                    .innerRadius(radius * 0.5)
                    .outerRadius(radius);

        var pie = d3.pie()
                    .startAngle(0 * Math.PI)
                    .endAngle(100 * Math.PI)
                    .padAngle(0.035)
                    .value( ƒ('val') )
                    .sort(null);

        var title = d3.select('#if-title')
                      .html('Beauty-Related Influencer Activity on Instagram Stores');

        title.transition()
            .duration(1000)
            .style('opacity', 1);

        var subtitle = d3.select('#if-subtitle')
                         .html('15–21 July 2018, n=97 Influencers Active on Daily Instagram Stories');

        subtitle.transition()
                .duration(1000)
                .style('opacity', 1);

        var slice = svg.appendMany('g.slice', pie(data));

        slice.append('path')
             .transition()
             .duration(1000)
             .delay((d, i) => i * 150)
             .styles({
               'fill': lemon,
               'opacity': function(d) {
                 return d.data.label === 'Brand Featured' ? 1 : 0.35;
               }
             })
             .attrTween('d', function(d) {
               var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);

               return function(t) {
                 d.endAngle = i(t); 

                 return arc(d);
               }
             })
             .each((d, i) => this._current = i);

        var label = slice.append('text.label')
                         .attrs({
                           'transform': function(d, i) { 
                             var c = arc.centroid(d);
                             c[0] *= 1.5;
                             c[1] *= 1.5;

                             return `translate(${ c })`;
                           },
                           'dy': '0.35em',
                           'text-anchor': function(d, i) {
                             return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start';
                           }
                         })
                         .text(function(d) {
                           return `${ d.data.val }% ${ d.data.label }`;
                         })
                         .styles({
                           'fill': 'white',
                           'font-size': '12px',
                           'opacity': 0
                         });

        label.transition()
             .duration(1000)
             .style('opacity', 1);
      }

      function ifChart2() {
        var data = [{ 'vertical': '',
                      'Hashtag': 2.9,
                      'Swipe-Up': 23.4,
                      'Mention': 73.8 }];

        var margin = {top: 40, right: 200, bottom: 25, left: 10},
            containerWidth = 400,
            containerHeight = 325,
            width = containerWidth - margin.left - margin.right,
            height = containerHeight - margin.top - margin.bottom;

        var allValues = d3.set( data.map( ƒ('vertical') ) ).values(); 

        var yScale = d3.scaleLinear()
                       .range([height, 0]),
            xScale = d3.scaleBand()
                       .domain( allValues )
                       .rangeRound([0, width])
                       .padding(0.4)
                       .align(0.2);

        var stack = d3.stack()
                      .order(d3.stackOrderNone)
                      .offset(d3.stackOffsetExpand);

        var svg = d3.select('svg.if-chart2')
                    .attrs({
                      'width': width + margin.left + margin.right,
                      'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .translate([margin.left, margin.top]);

        var series = svg.appendMany('g.series', stack.keys(['Mention', 'Swipe-Up', 'Hashtag'])(data))
                        .attr('fill', lemon);

        series.appendMany('rect', ƒ())
              .attrs({
                'x': d => xScale(d.data.vertical),
                'y': yScale(0),
                'height': 0,
                'width': xScale.bandwidth()
              })
              .styles({
                'stroke': 'black',
                'stroke-width': '4px'
              })
              .transition()
              .duration(1000)
              .delay(function(d, i) { return i * 100; })
              .attrs({
                'y': d => yScale(d[1]),
                'height': d => yScale(d[0]) - yScale(d[1])
              });

        var xAxisGroup = svg.append('g.stack-axis')
                            .translate([55, -72]);

        xAxisGroup.call( d3.axisRight(xScale) )
                  .selectAll('.tick text')
                  .attrs({
                    'text-anchor': 'middle',
                    'dy': -10
                  })
                  .style('opacity', 0)
                  .transition()
                  .duration(1000)
                  .styles({ 'opacity': 1 });

        var legend = series.append('g')
                           .attr('class', 'legend')
                           .translate(function(d) {
                             return [(xScale(d[0].data.vertical) + xScale.bandwidth()), (yScale(d[0][0]) + yScale(d[0][1])) / 2];
                           });

        legend.append('text.label')
              .attrs({
                'x': 9,
                'dy': '0.35em'
              })
              .text(function(d) { 
                return `${ Math.round((d[0][1] - d[0][0]) * 100) }% ${ d.key }`; 
              })
              .style('opacity', 0)
              .transition()
              .duration(1000)
              .style('opacity', 1);
      }

      function if1point3() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#if-text3').fadeOut(function() {
            $('#if-text4').fadeIn(function() {
              var iftl4 = new TimelineLite().to('.if-chart', 1, {opacity: 0})
                                            .to('foreignObject', 1, {opacity: 0}, '-=1')
                                            .to('#if-arrow', 1, {opacity: 0}, '-=1')
                                            .to('.if-chart2', 1, {opacity: 0}, '-=1')

                                            .to('#if-screen3', 1, {opacity: 1})
                                            .to('#if-shot', 1, {opacity: 1}, '-=1')
                                            .to('#if-arrow2', 0.75, {opacity: 1}, '-=0.4')
                                            .to('#if-shot2', 1, {opacity: 1}, '-=0.4')
                                            .add( if1point4 );
            });
          });
        });
      }

      function if1point4() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#if-text4').fadeOut(function() {
            $('#if-text5').fadeIn(function() {
              var iftl4 = new TimelineLite().to('#if-screen3', 1, {opacity: 0})
                                            .to('#if-shot', 1, {opacity: 0}, '-=1')
                                            .to('#if-arrow2', 1, {opacity: 0}, '-=1')
                                            .to('#if-shot2', 1, {opacity: 0}, '-=1')

                                            .to('#if-screen4', 1, {opacity: 1})
                                            .to('#if-shot3', 1, {opacity: 1}, '-=1')
                                            .to('#if-arrow3', 0.75, {opacity: 1}, '-=0.4')
                                            .to('#if-screen5', 1, {opacity: 1}, '-=0.4')
                                            .to('#if-shot4', 1, {opacity: 1}, '-=1')
                                            .add( if1point5 );
            });
          });
        });
      }

      function if1point5() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          $('#if-text5').fadeOut(function() {
            $('#if-text6').fadeIn(function() {
              var iftl5 = new TimelineLite().to('#if-screen4', 1, {opacity: 0})
                                            .to('#if-shot3', 1, {opacity: 0}, '-=1')
                                            .to('#if-arrow3', 1, {opacity: 0}, '-=1')
                                            .to('#if-screen5', 1, {opacity: 0}, '-=1')
                                            .to('#if-shot4', 1, {opacity: 0}, '-=1')

                                            .to('#if-screen6', 1, {opacity: 1})
                                            .to('#if-shot5', 1, {opacity: 1}, '-=1')
                                            .to('#if-arrow4', 0.75, {opacity: 1}, '-=0.4')
                                            .to('#if-screen7', 1, {opacity: 1}, '-=0.4')
                                            .to('#if-shot6', 1, {opacity: 1}, '-=1')
                                            .add( if1point6 );
            });
          });
        });
      }

      function if1point6() {
        $('#slide-container').on(window.myEvent, function() {
          $('#slide-container').off(window.myEvent);

          triggerNewPath({platform: 'instagram', path: 'if'});
        });
      }
    }

    function triggerNewPath(visitedPath) {
      visitedPaths.push(visitedPath);

      $('#platform-text').text(visitedPath.platform);

      $(`.channel-select`).addClass('js-hide');
      $(`.channel-select[data-platform="${ visitedPath.platform }"]`).removeClass('js-hide');

      $('#new-path-popup').removeClass('js-hide');
      $('#new-path-popup').addClass('end-path');

      addReplayBtn();
    }

    function addReplayBtn() {
      var replayBtn = '<div class="replay / center-a--abs / zmax"><img src="//interactive.l2inc.com/social_commerce/img/replay.svg" alt="" class="w3 h3"></div>',
          replayHTML = $.parseHTML( replayBtn );

      for (i = 0; i < visitedPaths.length; i++) {
        $(`.p-${ visitedPaths[i].platform }.p-${ visitedPaths[i].path }`).append( replayHTML ).addClass('disabled');
      }
    }

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
            dy = parseFloat(text.attr('dy') ),
            tspan = text.text(null)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', y)
                        .attr('dy', dy + 'em');

        while ( word = words.pop() ) {
          line.push(word);
          tspan.text(line.join(' '));

          if ( tspan.node().getComputedTextLength() > width ) {
            line.pop();
            tspan.text( line.join(' ') );

            line = [word];

            tspan = text.append('tspan')
                        .attr('x', 0)
                        .attr('y', y)
                        .attr('dy', `${++lineNumber * lineHeight + dy}em`)
                        .text(word);
          }
        }
      });
    } 

    $('#click-or-tap').text(function() {
      return window.isMobile ? 'Tap' : 'Click';
    });
  }

  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();

  let supportDiv = $('#support'),
              slideDiv = $('#slide-container');

  let w = window.innerWidth,
      h = window.innerHeight;

  if (w < 1030 || h < 460) {
    supportDiv.removeClass('hide');
    slideDiv.hide();
  } else {
    supportDiv.addClass('hide');
    slideDiv.show();
  }

  $(window).resize(() => {
    let resizeW = window.innerWidth,
        resizeH = window.innerHeight;

    if (resizeW < 1030 || resizeH < 460) {
      supportDiv.removeClass('hide');
      slideDiv.hide();

      if ($('#new-path-popup').hasClass('end-path')) {
        $('#new-path-popup').addClass('js-hide');
      } 
    } else {
      supportDiv.addClass('hide');
      slideDiv.show();

      if ($('#new-path-popup').hasClass('end-path')) {
        $('#new-path-popup').removeClass('js-hide'); 
      } 
    }
  });
});