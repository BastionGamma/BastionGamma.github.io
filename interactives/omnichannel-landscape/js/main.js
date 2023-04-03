var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) || $(window).innerWidth < 1030;
    window.myEvent = isMobile ? 'touchstart' : 'click';

    console.log('Height', $(window).innerHeight(), window.tooShort);

    const ƒ = d3.f;

    const sky = '#009AD7';   

    var visitedPaths = [];
    
    function enableClick() {
      $('body').on(window.myEvent, '.js-trigger', function(e) {
        let path = $(e.target).data('path'),
            goto = $(e.target).data('goto'),
            func = $(e.target).data('func');

        moveOn({path: path, goto: goto, func: func});
      });
    }

    function moveOn(slide) {
      console.log(slide);

      if (slide.goto === 'stay') {
        if (slide.func) 
          eval(slide.func);
      } else {
        let url = `${ slide.path }${ slide.goto }.html`;

        $(window).scrollTop(0);

        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function() {
            $('#slide').fadeOut('fast').remove();  
          },
          complete: function() {},
          success: function(data) {
            $('#slide-container').html( $(data).siblings('#slide') )
                                 .hide()
                                 .fadeIn('slow', function() {
                                   if (slide.func) 
                                     eval(slide.func);
                                 });

            $('#click-or-tap').text(function() {
              return window.isMobile ? 'Tap' : 'Click';
            });
          },
          error: function() {}
        });
      }
    }

    // INTRO
    function intro0(start) {
      if (start) {
        var i0tl = new TimelineLite().to('#line-0', 0.75, { opacity: 1, top: '96vh' }, '+=0.5')
                                     .to('#line-1', 0.75, { opacity: 0.9, top: '73.5vh' }, '-=0.5')
                                     .to('#line-2', 0.75, { opacity: 0.8, top: '58vh' }, '-=0.5')
                                     .to('#line-3', 0.75, { opacity: 0.7, top: '48vh' }, '-=0.6')
                                     .to('#line-4', 0.75, { opacity: 0.6, top: '42vh' }, '-=0.6')
                                     .to('#line-5', 0.75, { opacity: 0.5, top: '38vh' }, '-=0.65')
                                     .to('#line-6', 0.75, { opacity: 0.4, top: '35vh' }, '-=0.65')
                                     .to('#line-7', 0.75, { opacity: 0.3, top: '33vh' }, '-=0.65')
                                     .to('#i0-title', 0.75, { opacity: 1 }, '+=0.25')
                                     .to('#i0-copy', 0.75, { opacity: 1 }, '-=0.5')
                                     .to('#i0-click', 1, {opacity: 1}, '+=0.5')
                                     .add( enableClick );
      } else {
        var i0tl = new TimelineLite().to('#i0-title', 0.75, { opacity: 1 }, '+=0.25')
                                     .to('#i0-copy', 0.75, { opacity: 1 }, '-=0.5')
                                     .to('#i0-click', 1, {opacity: 1}, '+=0.5')
                                     .add( enableClick );
      }
    }

    function intro1() {
      var i1tl = new TimelineLite().to('#i1-subtitle', 0.75, { opacity: 1 }, '+=0.25')
                                   .to('#i1-title', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#i1-click', 1, {opacity: 1}, '+=0.5');
    }

    function intro2() {
      var i2tl = new TimelineLite().to('#i2-chart', 0.75, { opacity: 1 }, '+=0.25')
                                   .add( intro2Chart )
                                   .to('#i2-click', 1, {opacity: 1}, '+=0.5');
    }

    function intro2Chart() {
      d3.select('.chart-container[data-chart="intro2-chart"] svg')
        .remove(); 


      if (!isMobile) {
        var margin = {top: 25, right: 0, bottom: 50, left: 0};
      } else {
        var margin = {top: 25, right: 15, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="intro2-chart"]').width(),
          containerHeight = $('.chart-container[data-chart="intro2-chart"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
                     .rangeRound([0, width]),
          x2Scale = d3.scaleBand(),
          yScale = d3.scaleLinear()
                     .range([height, 0]);

      if (!isMobile) {
        xScale.paddingInner(0.2);
        x2Scale.padding(0.075);
      } else {
        xScale.paddingInner(0.35);
        x2Scale.padding(0.25);
      }

      var svg = d3.select('.chart-container[data-chart="intro2-chart"]')
                  .append('svg')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/i2.csv', function(d, i, columns) {
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

        var xAxisGroup = svg.append('g.axis')
                            .translate([0, height]);

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attr('text-anchor', 'middle')
                    .translate([0, 10])
                    .styles({
                      'opacity': 0,
                      'font-weight': 700
                    })
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)
                    .call(axisWrap, xScale.bandwidth());
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -32,
                      'text-anchor': 'start'
                    })
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);
        }

        var barGroup = svg.appendMany('g', data)
                          .translate(d => [xScale(d.vertical), 0]);

        barGroup.appendMany('rect', function(d, i) {
                  return keys.map(function(key) {
                    return {index: i, key: key, value: d[key]}; 
                  });
                })
                .attrs({
                  'x': d => x2Scale(d.key),
                  'y': d => yScale(0),
                  'width': x2Scale.bandwidth(),
                  'height': 0,
                  'fill': function(d) {
                    return d.key === '2017' ? 'white' : sky;
                  },
                  'data-bar': d => d.index
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
                  'dx': function(d) { 
                    return !isMobile ? x2Scale.bandwidth() / 2.75 : -2;
                  },
                  'dy': function(d) {
                    return d.value > 0 ? -12 : 0;
                  }
                })
                .text(d => `${d.value}%`)
                .styles({
                  'opacity': 0,
                  'font-weight': function(d) {
                    return !isMobile ? 700 : 400;
                  },
                  'fill': 'white'
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({ 'y': d => yScale(d.value) })
                .style('opacity', 1);
      });
    }

    function intro2point2() {
      var svg = d3.select('.chart-container[data-chart="intro2-chart"] svg');

      var bar = svg.selectAll('rect');

      bar.transition()
         .duration(750)
         .delay(function(d, i) { return i * 100; })
         .style('opacity', function(d) {
           if ( d.index === 1 || 
                d.index === 2 ||
                d.index === 4 ){
             return 0.25;
           } else {
             return 1;
           }
         });

      var i2tl2 = new TimelineLite().to('#i2-copy', 0.75, { opacity: 0, display: 'none' }, '+=0.5')
                                    .to('#i2-copy2', 0.75, { opacity: 1, display: 'block' })
                                    .add( changeFunc );

      function changeFunc() {
        $('#i2-click').children().eq(1).data('func', 'intro2point3()');
      }
    }

    function intro2point3() {
      var svg = d3.select('.chart-container[data-chart="intro2-chart"] svg');

      var bar = svg.selectAll('rect');

      bar.transition()
         .duration(750)
         .delay(function(d, i) { return i * 100; })
         .style('opacity', function(d) {
           if ( d.index === 1 ){
             return 1;
           } else {
             return 0.25;
           }
         });

      var i2tl3 = new TimelineLite().to('#i2-copy2', 0.75, { opacity: 0, display: 'none' }, '+=0.5')
                                    .to('#i2-copy3', 0.75, { opacity: 1, display: 'block' })
                                    .add( changeFunc );

      function changeFunc() {
        $('#i2-click').children().eq(1).data('goto', 3);
        $('#i2-click').children().eq(1).data('func', 'intro3()');
      }
    }

    function intro3() {
      var i3tl = new TimelineLite().to('#i3-copy', 0.75, { opacity: 1 }, '+=0.25')
                                   .to('#i3-chart', 0.75, { opacity: 1 }, '-=0.5')
                                   .add( intro3Chart )
                                   .to('#i3-click', 1, {opacity: 1}, '+=0.5');
    }

    function intro3Chart() {
      d3.select('.chart-container[data-chart="intro3-chart"] svg')
        .remove(); 

      var margin = {top: 25, right: 28, bottom: 35, left: 75},
          containerWidth = $('.chart-container[data-chart="intro3-chart"]').width(),
          containerHeight = $('.chart-container[data-chart="intro3-chart"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom; 

      var xScale = d3.scaleTime()  
                     .range( [0, width] ),
          yScale = d3.scaleLinear()
                     .range( [height, 0] );

      var path = d3.line()
                   .x(function(d) { return xScale(d.date); })
                   .y(function(d) { return yScale(d.Desktop); });

      var path2 = d3.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.Mobile); });

      var svg = d3.select('.chart-container[data-chart="intro3-chart"]')
                  .append('svg')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      d3.csv('js/i3.csv', function(error, data) {
        if (error) throw error;

        data.forEach( function(d) {
          d.date = new Date(d.date);
          d.Desktop = +d.Desktop;
          d.Mobile = +d.Mobile;
        });

        xScale.domain( d3.extent(data, d => d.date) );

        yScale.domain( [0, d3.max(data, d => d.Mobile) + 10] );

        var xAxis = d3.axisBottom(xScale)
                      .tickValues( [ data[0].date, data[data.length - 1].date ] )
                      .tickFormat( d3.timeFormat('%b %Y') ),
            yAxis = d3.axisLeft(yScale)
                      .ticks(5)
                      .tickFormat( d3.format('~s') );

        svg.append('g.x.axis')
           .translate( [0, height] )
           .call(xAxis)
           .styles({
            'opacity': 0,
            'font-weight': 700
           })
           .transition()
           .duration(1000)
           .style('opacity', 1);

        svg.select('.x.axis')
           .selectAll('.tick text')
           .translate([0, 10])

        svg.append('g.y.axis')
           .call(yAxis)
           .styles({
            'opacity': 0,
            'font-weight': 700
           })
           .transition()
           .duration(1000)
           .style('opacity', 1);

        svg.select('.y.axis')
           .selectAll('.tick text')
           .translate([-10, 0])

        svg.append('text.label')
           .attr('transform', 'rotate(-90)')
           .attr('y', -75)
           .attr('x',  0 - (height / 2))
           .attr('dy', '1em')
           .styles({
            'text-anchor': 'middle',
            'font-weight': 700
           })
           .text('Monthly Search Volume')
           .style('opacity', 0)
           .transition()
           .duration(1000)
           .style('opacity', 1);

        var line = svg.append('path.path')
                      .data(function(d) {
                        console.log(data);

                        return [data];
                      })
                      .attr('d', path);

        var totalLength = line.node().getTotalLength();

        line.attrs({
              'stroke-dasharray': totalLength + ' ' + totalLength,
              'stroke-dashoffset': totalLength
            })
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);

        var line2 = svg.append('path.path.o50')
                       .data([data])
                       .attr('d', path2);

        var totalLength2 = line2.node().getTotalLength();

        line2.attrs({
              'stroke-dasharray': totalLength2 + ' ' + totalLength2,
              'stroke-dashoffset': totalLength2
            })
            .transition()
            .duration(1500)
            .delay(500)
            .attr('stroke-dashoffset', 0);
      });
    }

    function intro4() {
      var i4tl = new TimelineLite().to('#i4-subtitle', 0.75, { opacity: 1 }, '+=0.25')
                                   .to('#i4-title', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#i4-copy', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#i4-click', 1, {opacity: 1}, '+=0.5');
    }

    function choice1() {
      var c1tl = new TimelineLite().to('#c1-copy', 0.75, { opacity: 1 }, '+=0.25')
                                   .to('#c1-hex1', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-plus1', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-hex2', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-plus2', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-hex3', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-copy2', 0.75, { opacity: 1 }, '-=0.5')
                                   .to('#c1-click', 1, {opacity: 1}, '+=0.5');
    }

    function choice1point1() {
      if (!isMobile) {
        var c1tl2 = new TimelineLite().to('#c1-copy2', 0.75, { opacity: 0 }, '+=0.5')
                                      .to('#c1-click', 0.75, { opacity: 0 }, '-=0.1')
                                      .to('#c1-button1', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-button2', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-button3', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-choice', 0.75, { attr: { viewBox: '0 35 1440 300' } }, '-=0.5')
                                      .to('#c1-copy3', 0.75, { opacity: 1, display: 'block' }, '-=0.5')
                                      .add( appendCards );
      } else {
        var c1tl2 = new TimelineLite().to('#c1-copy2', 0.75, { opacity: 0 }, '+=0.5')
                                      .to('#c1-click', 0.75, { opacity: 0 }, '-=0.1')
                                      .to('#c1-button1-m', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-button2-m', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-button3-m', 0.75, { opacity: 1 }, '-=0.5')
                                      .to('#c1-copy3', 0.75, { opacity: 1, display: 'block' }, '-=0.5')
                                      .add( appendCards );
      }
    }

    function appendCards() {
      $('body').on(window.myEvent, '.js-transition h4', function(e) {
        e.stopPropagation();
      });

      $('body').on(window.myEvent, '.js-transition', function(e) {
        let path = $(e.target).data('path');

        transitionOut(path);
      });
    }

    var $currentCard = 0,
        prevEnabled = false,
        closeEnabled = false;

    function transitionOut(path) {
      let url = `${ path }-card.html`;

      $currentCard = 0;

      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function() {
          if ( $('#card') )
            $('#card').fadeOut('fast').remove();
        },
        complete: function() {},
        success: function(data) {
          $('#card-container').html( $(data).siblings('#card') )
                              .hide()
                              .fadeIn('slow');
        },
        error: function() {}
      });

      var trtl = new TimelineLite().to('#slide-container', 2, { 
                                     top: '-100%',
                                     ease: Power0.easeNone
                                   }, '+=0.5')

                                   .to('#line-0', 2, { 
                                     top: '-1%',
                                     ease: Power0.easeNone
                                   }, '-=2')
                                   .to('#line-1', 2.2, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=2')
                                   .to('#line-2', 2.5, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=2.2')
                                   .to('#line-3', 2.9, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=2.5')
                                   .to('#line-4', 3.4, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=2.9')
                                   .to('#line-5', 4, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=3.4')
                                   .to('#line-6', 4.7, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=4')
                                   .to('#line-7', 5.5, { 
                                     top: '-1%',
                                     ease: Power0.easeNone 
                                   }, '-=4.7')

                                   .to('#card-container', 4.4, { 
                                     bottom: '100%',
                                     ease: Power0.easeNone 
                                   }, '-=5.5')
                                   .add( enableNext );          
    }

    function enableNext() {
      $('#next-arrow').off(window.myEvent);

      $('#next-arrow').on(window.myEvent, function(event) {
        event.preventDefault();

        if ($currentCard < 4) {
          goto = $currentCard + 1

          nextCard($currentCard, goto);

          if ($currentCard === 3) enableClose();
        } else {
          enableClose();
        }

        enablePrev();

        $currentCard = goto;
      });
    }

    function enablePrev() {
      if (!prevEnabled) {
        if (!isMobile) {
          $('#prev-arrow').html('<h4 class="center-v--rel / white / pointer"><i class="l2-right-angle"></i></h4>');
        } else {
          $('#prev-arrow').html('<h3 class="center-v--rel / white / pointer"><i class="l2-right-angle"></i></h3>');
        }

        $('#prev-arrow').on(window.myEvent, function(event) {
          if ($currentCard <= 0) {
            disablePrev();
          } else {
            event.preventDefault();

            goto = $currentCard - 1;

            prevCard($currentCard, goto);

            $currentCard = goto;

            if ($currentCard === 0) disablePrev();

            if (closeEnabled && $currentCard < 4) disableClose();
          }
        });
      }

      prevEnabled = true;
    }

    function nextCard($currentCard, goto) {
      $(`.card[data-card='${ $currentCard }']`).addClass('donezo');

      window.setTimeout(function() {
        $(`.card[data-card='${ $currentCard }']`).hide();
      }, 100);

      $(`.card[data-card='${ goto }']`).addClass('front');

      $(`.dot[data-nav='${ $currentCard }']`).removeClass('current');
      $(`.dot[data-nav='${ goto }']`).addClass('current');

      var func = $(`.card[data-card='${ goto }']`).data('func');

      if (func) 
        eval(func);
    }

    function prevCard($currentCard, goto) {
      $(`.card[data-card='${ $currentCard }']`).removeClass('front');

      $(`.card[data-card='${ goto }']`).show();

      window.setTimeout(function() {
        $(`.card[data-card='${ goto }']`).removeClass('donezo');
        $(`.card[data-card='${ goto }']`).addClass('front');
      }, 10);

      $(`.dot[data-nav='${ $currentCard }']`).removeClass('current');
      $(`.dot[data-nav='${ goto }']`).addClass('current');

      var func = $(`.card[data-card='${ goto }']`).data('func');

      if (func) 
        eval(func);
    }

    function enableClose() {
      if (!closeEnabled ) {
        $('#next-arrow').off(window.myEvent);

        $('#next-arrow').html('<h6 class="sky / ttu / pointer">Close</h6>');

        $('#next-arrow').on(window.myEvent, function() {
          transitionIn();

          window.setTimeout(function() {
            disablePrev();
            disableClose();
          }, 1000);
        });
      }

      closeEnabled = true;
    }

    function disablePrev() {
      $('#prev-arrow').off(window.myEvent);

      $('#prev-arrow').html('');

      prevEnabled = false;
    }

    function disableClose() {

      $('#next-arrow').off(window.myEvent);

      if (!isMobile) {
        $('#next-arrow').html('<h4 class="center-v--rel / white / pointer"><i class="l2-left-angle"></i></h4>');
      } else {
        $('#next-arrow').html('<h3 class="center-v--rel / white / pointer"><i class="l2-left-angle"></i></h3>');
      }
      
      enableNext();

      closeEnabled = false;
    }

    function transitionIn() {
      var trtl2 = new TimelineLite().to('#card-container', 2.2, { 
                                      bottom: '-75%',
                                      ease: Power0.easeNone 
                                    }, '+=0.5') 
                                    .to('#line-0', 1, { 
                                      top: '96vh',
                                      ease: Power0.easeNone
                                    }, '-=1')
                                    .to('#line-1', 1, { 
                                      top: '73.5vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-2', 1, { 
                                      top: '58vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-3', 1, { 
                                      top: '48vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-4', 1, { 
                                      top: '42vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-5', 1, { 
                                      top: '38vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-6', 1, { 
                                      top: '35vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    .to('#line-7', 1, { 
                                      top: '33vh',
                                      ease: Power0.easeNone 
                                    }, '-=1')
                                    
                                    .to('#slide-container', 1.5, { 
                                      top: '0%',
                                      ease: Power0.easeNone
                                    }, '-=1.5')
                                    .add( disableCard );
      
      function disableCard() {
        $('#next-arrow').off(window.myEvent);
        $('#prev-arrow').off(window.myEvent);
      }
    }

    function smCard2() { 
      d3.select('svg.sm-chart')
        .remove();

      var data = [{ 'name': 'Brand Adoption',
                    'val': 97 }];

      var margin = {top: 0, right: 0, bottom: 0, left: 0},
          containerWidth = $('.chart-container[data-chart="sm-chart"]').width(),
          containerHeight = $('.chart-container[data-chart="sm-chart"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name) )
                     .range([height, 0])
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="sm-chart"]')
                  .append('svg.sm-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var skyBar = barGroup.append('rect.sky-bar')
                           .attrs({
                             'width': width - 70,
                             'height': yScale.bandwidth(),
                             'y': d => yScale(d.name),
                           })
                           .styles('opacity', 0);

      skyBar.transition()
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
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) - 70 );


      var valLabel = barGroup.append('text.white-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 50,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '15px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function smCard3() {
      d3.select('.chart-container[data-chart="sm-chart2"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 0, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="sm-chart2"]').width(),
          containerHeight = $('.chart-container[data-chart="sm-chart2"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="sm-chart2"]')
                  .append('svg.sm-chart2')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['drive_to_store', 'fulfillment'])
                     .range(['#FFFFFF', '#009AD7']);

      if (!isMobile) {
        xScale.paddingInner(0.4);
      } else {
        xScale.paddingInner(0.45);
      }

      d3.csv('js/sm.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        data.sort( function(a, b) { return b.total - a.total; } );

        xScale.domain( data.map( d => d.vertical ) );

        yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

        cScale.domain(keys);

        var series = svg.appendMany('g.series', d3.stack().keys(keys)(data))
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

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .call(axisWrap, xScale.bandwidth())
                    .styles({
                      'opacity': 0,
                      'font-weight': 700
                    })
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate(function(d) {
                  if (Math.round((d[1] - d[0])) > 1) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( d => `${ (d[1] - d[0]).toFixed(1) }%` )
                .styles({
                  'fill': function(d) {
                    return Math.round((d[1] - d[0])) > 3 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle',
                  'font-weight': 700,
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate(function(d) {
                  if (Math.round((d[1] - d[0])) > 1) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( function(d) {
                  if ((d[1] - d[0]) > 1) {
                    return `${ Math.round((d[1] - d[0])).toFixed(0) }%`;
                  } else {
                    return `${ (d[1] - d[0]).toFixed(1) }%`;
                  }
                })
                .styles({
                  'fill': function(d) {
                    return Math.round((d[1] - d[0])) > 3 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle',
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        }
      });
    }

    function smCard4() {
      d3.select('.chart-container[data-chart="sm-chart3"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 0, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="sm-chart3"]').width(),
          containerHeight = $('.chart-container[data-chart="sm-chart3"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="sm-chart3"]')
                  .append('svg.sm-chart3')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['drive_to_store', 'fulfillment'])
                     .range(['#FFFFFF', '#009AD7']);

      if (!isMobile) {
        xScale.paddingInner(0.4);
      } else {
        xScale.paddingInner(0.45);
      }

      d3.csv('js/sm.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        data.sort( function(a, b) { return b.total - a.total; } );

        xScale.domain( data.map( d => d.vertical ) );

        yScale.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

        cScale.domain(keys);

        var series = svg.appendMany('g.series', d3.stack().keys(keys)(data))
                        .attr('fill', d => cScale(d.key));

        series.appendMany('rect', ƒ())
              .attrs({
                'x': d => xScale(d.data.vertical),
                'y': d => yScale(d[1]),
                'height': d => yScale(d[0]) - yScale(d[1]),
                'width': xScale.bandwidth()
              });

        var xAxisGroup = svg.append('g.stack-axis')
                            .translate([0, height]);

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .call(axisWrap, xScale.bandwidth())
                    .styles({
                      'opacity': 1,
                      'font-weight': 700
                    });

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
                })
                .translate(function(d) {
                  if (Math.round((d[1] - d[0])) > 1) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( d => `${ (d[1] - d[0]).toFixed(1) }%` )
                .styles({
                  'fill': function(d) {
                    return Math.round((d[1] - d[0])) > 3 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle',
                  'font-weight': 700
                });
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .styles('opacity', 1);

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
                })
                .translate(function(d) {
                  if (Math.round((d[1] - d[0])) > 1) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( function(d) {
                  if ((d[1] - d[0]) > 1) {
                    return `${ Math.round((d[1] - d[0])).toFixed(0) }%`;
                  } else {
                    return `${ (d[1] - d[0]).toFixed(1) }%`;
                  }
                })
                .styles({
                  'fill': function(d) {
                    return Math.round((d[1] - d[0])) > 3 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle'
                });
        }

        series.selectAll('rect')
              .transition()
              .duration(750)
              .delay(function(d, i) { return i * 100; })
              .style('opacity', function(d, i) {
                if ( i === 0 || 
                     i === 1 ) {
                  return 1;
                } else {
                  return 0.25;
                }
              });

        series.selectAll('text')
              .transition()
              .duration(750)
              .delay(function(d, i) { return i * 100; })
              .style('opacity', function(d, i) {
                if ( i === 0 || 
                     i === 1 ) {
                  return 1;
                } else {
                  return 0.25;
                }
              });
      });
    }

    function smCard5() {
      var smtl5 = new TimelineLite().to('#sm-img1', 0.75, { opacity: 1 }, '+=0.5')
                                    .to('#sm-img2', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#sm-img3', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#sm-img4', 0.75, { opacity: 1 }, '-=0.5');
    }

    function emCard2() {
      d3.select('svg.em-chart')
        .remove();

      var data = [{ 'name': 'Brand Adoption',
                    'val': 93 }];

      var margin = {top: 0, right: 0, bottom: 0, left: 0},
          containerWidth = $('.chart-container[data-chart="em-chart"]').width(),
          containerHeight = $('.chart-container[data-chart="em-chart"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name) )
                     .range([height, 0])
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="em-chart"]')
                  .append('svg.em-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var skyBar = barGroup.append('rect.sky-bar')
                           .attrs({
                             'width': width - 70,
                             'height': yScale.bandwidth(),
                             'y': d => yScale(d.name),
                           })
                           .styles('opacity', 0);

      skyBar.transition()
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
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) - 70 );


      var valLabel = barGroup.append('text.white-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 50,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '15px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function emCard3() {
      d3.select('.chart-container[data-chart="em-chart2"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 0, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="em-chart2"]').width(),
          containerHeight = $('.chart-container[data-chart="em-chart2"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="em-chart2"]')
                  .append('svg.sm-chart2')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['drive_to_store', 'fulfillment'])
                     .range(['#FFFFFF', '#009AD7']);

      if (!isMobile) {
        xScale.paddingInner(0.4);
      } else {
        xScale.paddingInner(0.45);
      }

      d3.csv('js/em1.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        data.sort( function(a, b) { return b.total - a.total; } );

        xScale.domain( data.map( d => d.vertical ) );

        yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

        cScale.domain(keys);

        var series = svg.appendMany('g.series', d3.stack().keys(keys)(data))
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

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .call(axisWrap, xScale.bandwidth())
                    .styles({
                      'opacity': 0,
                      'font-weight': 700
                    })
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate(function(d) {
                  if ( (d[1] - d[0]) > 1 ) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( d => `${ (d[1] - d[0]).toFixed(1) }%` )
                .styles({
                  'fill': function(d) {
                    return (d[1] - d[0]) > 1 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle',
                  'font-weight': 700,
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate(function(d) {
                  if ( (d[1] - d[0]) > 1 ) {
                    return [xScale.bandwidth() / 2, 5];
                  } else {
                    return [xScale.bandwidth() / 2, -12];
                  }
                })
                .text( function(d) {
                  if ((d[1] - d[0]) > 1) {
                    return `${ Math.round((d[1] - d[0])).toFixed(0) }%`;
                  } else {
                    return `${ (d[1] - d[0]).toFixed(1) }%`;
                  }
                })
                .styles({
                  'fill': function(d) {
                    return (d[1] - d[0]) > 1 ? 'black' : 'white';
                  },
                  'text-anchor': 'middle',
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        }
      });
    }

    function emCard4() {
      d3.select('.chart-container[data-chart="em-chart3"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 10, bottom: 5, left: 12};
      }

      var containerWidth = $('.chart-container[data-chart="em-chart3"]').width(),
          containerHeight = $('.chart-container[data-chart="em-chart3"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="em-chart3"]')
                  .append('svg.sm-chart3')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.2),
          x2Scale = d3.scaleBand()
                      .padding(0.05),
          yScale = d3.scaleLinear()
                     .range([height, 0]);

      if (!isMobile) {
        xScale.paddingInner(0.2);
        x2Scale.padding(0.05);
      } else {
        xScale.paddingInner(0.3);
        x2Scale.padding(0.2);
      }

      d3.csv('js/em2.csv', function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        d.total = t;

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

        var xAxisGroup = svg.append('g.axis')
                            .translate([0, height]);

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attr('text-anchor', 'middle')
                    .translate([0, 10])
                    .styles({
                      'opacity': 0,
                      'font-weight': 700
                    })
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)
                    .call(axisWrap, xScale.bandwidth());
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .styles('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)
        }

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
                  'fill': d => d.key === 'overall' ? 'white' : sky
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 250; })
                .attrs({
                  'y': d => yScale(d.value),
                  'height': d => height - yScale(d.value)
                });

        if (!isMobile) {
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
                  .text(d => `${ Math.round(d.value) }%`)
                  .styles({
                    'opacity': 0,
                    'fill': 'white',
                    'font-weight': 700
                  })
                  .transition()
                  .duration(1000)
                  .delay(function(d, i) { return i * 250; })
                  .attrs({ 'y': d => yScale(d.value) })
                  .style('opacity', 1);
        } else {
          barGroup.appendMany('text.label', function(d) {
                    return keys.map(function(key) {
                      return {key: key, value: d[key]}; 
                    });
                  })
                  .attrs({
                    'x': d => x2Scale(d.key),
                    'y': yScale(0),
                    'dx': x2Scale.bandwidth(),
                    'dy': function(d) {
                      return d.value > 0 ? -12 : 0;
                    }
                  })
                  .text(d => `${ Math.round(d.value) }%`)
                  .styles({
                    'opacity': 0,
                    'text-anchor': 'middle',
                    'fill': 'white'
                  })
                  .transition()
                  .duration(1000)
                  .delay(function(d, i) { return i * 250; })
                  .attrs({ 'y': d => yScale(d.value) })
                  .style('opacity', 1);
        }
      });
    }

    function emCard5() {
      var emtl5 = new TimelineLite().to('#em-img1', 0.75, { opacity: 1 }, '+=0.5')
                                    .to('#em-img2', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#em-img3', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#em-img4', 0.75, { opacity: 1 }, '-=0.5');
    }

    function daCard2() {
      d3.select('svg.da-chart')
        .remove();

      var data = [{ 'name': 'Brand Adoption',
                    'val': 85 }];

      var margin = {top: 0, right: 0, bottom: 0, left: 0},
          containerWidth = $('.chart-container[data-chart="da-chart"]').width(),
          containerHeight = $('.chart-container[data-chart="da-chart"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var yScale = d3.scaleBand()
                     .domain( data.map(d => d.name) )
                     .range([height, 0])
          xScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);

      var svg = d3.select('.chart-container[data-chart="da-chart"]')
                  .append('svg.da-chart')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top])

      var barGroup = svg.appendMany('g.bar-group', data);

      var skyBar = barGroup.append('rect.sky-bar')
                           .attrs({
                             'width': width - 70,
                             'height': yScale.bandwidth(),
                             'y': d => yScale(d.name),
                           })
                           .styles('opacity', 0);

      skyBar.transition()
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
             .ease(d3.easePoly)
             .attr('width', d => xScale(d.val) - 70 );


      var valLabel = barGroup.append('text.white-label.neue-bold')
                             .text( d => `${d.val}%`)
                             .attrs({
                               'x': width - 50,
                               'y': d => yScale(d.name) + (yScale.bandwidth() / 2)
                             })
                             .translate(function(d) { 
                               return [0, (d3.select(this).node().getBBox().height / 3.5)]; 
                             })
                             .styles({
                                'opacity': 0,
                                'font-size': '15px'
                              });

      valLabel.transition()
              .duration(1000)
              .ease(d3.easePoly)
              .style('opacity', 1);
    }

    function daCard3() {
      d3.select('.chart-container[data-chart="da-chart2"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 0, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="da-chart2"]').width(),
          containerHeight = $('.chart-container[data-chart="da-chart2"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="da-chart2"]')
                  .append('svg.da-chart2')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['drive_to_store', 'fulfillment'])
                     .range(['#FFFFFF', '#009AD7']);

      if (!isMobile) {
        xScale.paddingInner(0.4);
      } else {
        xScale.paddingInner(0.45);
      }

      d3.csv('js/da.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        data.sort( function(a, b) { return b.total - a.total; } );

        xScale.domain( data.map( d => d.vertical ) );

        yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

        cScale.domain(keys);

        var series = svg.appendMany('g.series', d3.stack().keys(keys)(data))
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

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .call(axisWrap, xScale.bandwidth())
                    .styles({
                      'opacity': 0,
                      'font-weight': 700
                    })
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate( [xScale.bandwidth() / 2, 5] )
                .text( function(d) { 
                  if ( (d[1] - d[0]) > 2 )
                    return `${ (d[1] - d[0]).toFixed(1) }%`;
                })
                .styles({
                  'fill': 'black',
                  'text-anchor': 'middle',
                  'font-weight': 700,
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .styles('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': yScale(0)
                })
                .translate( [xScale.bandwidth() / 2, 5] )
                .text( function(d) {
                  if ((d[1] - d[0]) > 1) return `${ Math.round((d[1] - d[0])).toFixed(0) }%`;
                })
                .styles({
                  'fill': 'black',
                  'text-anchor': 'middle',
                  'opacity': 0
                })
                .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .attr('y', d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2)
                .style('opacity', 1);
        }
      });
    }

    function daCard4() {
      d3.select('.chart-container[data-chart="da-chart3"] svg')
        .remove(); 

      if (!isMobile) {
        var margin = {top: 25, right: 75, bottom: 50, left: 75};
      } else {
        var margin = {top: 25, right: 0, bottom: 5, left: 15};
      }

      var containerWidth = $('.chart-container[data-chart="da-chart3"]').width(),
          containerHeight = $('.chart-container[data-chart="da-chart3"]').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var svg = d3.select('.chart-container[data-chart="da-chart3"]')
                  .append('svg.da-chart3')
                  .attrs({
                    'width': width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                  })
                  .append('g')
                  .translate([margin.left, margin.top]);

      var yScale = d3.scaleLinear()
                     .range([height, 0]),
          xScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .align(0.2),
          cScale = d3.scaleOrdinal()
                     .domain(['drive_to_store', 'fulfillment'])
                     .range(['#FFFFFF', '#009AD7']);

      if (!isMobile) {
        xScale.paddingInner(0.4);
      } else {
        xScale.paddingInner(0.45);
      }

      d3.csv('js/da.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;

        return d;
      }, function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        data.sort( function(a, b) { return b.total - a.total; } );

        xScale.domain( data.map( d => d.vertical ) );

        yScale.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

        cScale.domain(keys);

        var series = svg.appendMany('g.series', d3.stack().keys(keys)(data))
                        .attr('fill', d => cScale(d.key));

          series.appendMany('rect', ƒ())
              .attrs({
                'x': d => xScale(d.data.vertical),
                'y': d => yScale(d[1]),
                'height': d => yScale(d[0]) - yScale(d[1]),
                'width': xScale.bandwidth()
              });

        var xAxisGroup = svg.append('g.stack-axis')
                            .translate([0, height]);

        if (!isMobile) {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .call(axisWrap, xScale.bandwidth())
                    .styles({
                      'opacity': 1,
                      'font-weight': 700
                    });

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
                })
                .translate( [xScale.bandwidth() / 2, 5] )
                .text( function(d) { 
                  if ( (d[1] - d[0]) > 2 )
                    return `${ (d[1] - d[0]).toFixed(1) }%`;
                })
                .styles({
                  'fill': 'black',
                  'text-anchor': 'middle',
                  'font-weight': 700,
                  'opacity': 1
                });
        } else {
          xAxisGroup.call( d3.axisBottom(xScale) )
                    .selectAll('.tick text')
                    .attrs({
                      'transform': 'rotate(-90)',
                      'dx': 5,
                      'dy': -24,
                      'text-anchor': 'start'
                    })
                    .styles('opacity', 1);

          series.appendMany('text', ƒ())
                .attrs({
                  'x': d => xScale(d.data.vertical),
                  'y': d => yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2-2
                })
                .translate( [xScale.bandwidth() / 2, 5] )
                .text( function(d) {
                  if ((d[1] - d[0]) > 1) return `${ Math.round((d[1] - d[0])).toFixed(0) }%`;
                })
                .styles({
                  'fill': 'black',
                  'text-anchor': 'middle',
                  'opacity': 1
                });
        }

        series.selectAll('rect')
              .transition()
              .duration(750)
              .delay(function(d, i) { return i * 100; })
              .style('opacity', function(d, i) {
                if ( i === 0 || 
                     i === 1 || 
                     i === 2 ||
                     i === 3 ) {
                  return 1;
                } else {
                  return 0.25;
                }
              });

        series.selectAll('text')
              .transition()
              .duration(750)
              .delay(function(d, i) { return i * 100; })
              .style('opacity', function(d, i) {
                if ( i === 0 || 
                     i === 1 || 
                     i === 2 ||
                     i === 3 ) {
                  return 1;
                } else {
                  return 0.25;
                }
              });
      });
    }

    function daCard5() {
      var datl5 = new TimelineLite().to('#da-img1', 0.75, { opacity: 1 }, '+=0.5')
                                    .to('#da-img2', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#da-img3', 0.75, { opacity: 1 }, '-=0.5')
                                    .to('#da-img4', 0.75, { opacity: 1 }, '-=0.5');
    }

    moveOn({path: 'intro', goto: '0', func: 'intro0(true)'});

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

    $(window).scrollTop(0);
  }

  return {
    init:init
  }
})();

$(document).ready(function(){
  window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) || $(window).innerWidth < 1030;
  window.tooShort = !window.isMobile && $(window).innerHeight() <= 700;

  let supportDiv = $('#support'),
        slideDiv = $('#slide-container'); 

  if (window.tooShort) {
    supportDiv.removeClass('hide');
    slideDiv.hide();
  } else {
    supportDiv.addClass('hide');
    slideDiv.show();

    l2Utils.init();
  }
});