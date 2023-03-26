var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    var elements = $('.sticky');
    Stickyfill.add(elements);

    if ($(window).innerWidth() < 1030 && isMobile) {
      if (window.innerHeight > window.innerWidth) {
        $('.js-rotate').show();
        $('.js-rotate').animate({'opacity' : 1}, 750);
        $('body').addClass('rotate');
      }
    }

    var container = d3.select('#scroll'),
        graphic = container.select('.scroll__graphic'),
        chart = graphic.select('.chart'),
        text = container.select('.scroll__text'),
        step = text.selectAll('.step'),
        $currentStep;

    var dataByReport; 

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
      // 1. update height of step elements
      // var stepHeight = Math.floor($(window).innerHeight() * 0.75);
      // step.style('height', stepHeight + 'px');

      // 2. update height of graphic element
      graphic.style('height', $(window).innerHeight() + 'px');

      if ( $(window).innerWidth() > 1030 && !isMobile ) {
        chart.style('height', Math.floor($(window).innerHeight() / 1.25) + 'px');
      } else {
        chart.style('height', Math.floor($(window).innerHeight() / 1.1) + 'px');
      }

      // 3. tell scrollama to update new element dimensions
      scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
      // response = { element, direction, index }

      // add color to current step only
      step.classed('is-active', function (d, i) {
        return i === response.index;
      });

      // update chart based on step
      var vertical = d3.select('.step.is-active')
                       .attr('data-step'),
          caseStudy = d3.select('.step.is-active')
                        .attr('data-featured');

      $currentStep = vertical;

      $('.nav__item').removeClass('is-active');
      $(`.nav__item[data-nav="${$currentStep}"]`).addClass('is-active');

      update(vertical);

      if (caseStudy)
        updateCaseStudy( JSON.parse(caseStudy) );
    }

    function handleContainerExit(response) {
      // response = { direction }

      // un-sticky the graphic, and pin to top/bottom of container
      graphic.classed('is-fixed', false);
      graphic.classed('is-bottom', response.direction === 'down');
    }

    function letsGo() {
      // 1. force a resize on load to ensure proper dimensions are sent to scrollama
      handleResize();

      // 2. setup the scroller passing options
      // this will also initialize trigger observations
      // 3. bind scrollama event handlers (this can be chained like below)
      if ( $(window).innerWidth() > 1030 && !isMobile ) {
        scroller.setup({
                  container: '#scroll',
                  graphic: '.scroll__graphic',
                  text: '.scroll__text',
                  step: '.scroll__text .step'
                })
                .onStepEnter(handleStepEnter)
                .onStepExit(handleContainerExit);
      } else {
        scroller.setup({
                  container: '#scroll',
                  graphic: '.scroll__graphic',
                  text: '.scroll__text',
                  step: '.scroll__text .step',
                  offset: 1
                })
                .onStepEnter(handleStepEnter)
                .onStepExit(handleContainerExit);
      }

      // setup resize event
      window.addEventListener('resize', handleResize);

      d3.csv('js/data.csv', ready);
    }

    function ready(data) {
      dataByReport = d3.nest()
                       .key( ƒ('report') )
                       .entries(data);

      console.log(dataByReport)                 
      dataByReport = dataByReport.sort(function(a, b) {
        return d3.ascending(a.key, b.key);
      });

      var allVerticals = d3.set( data.map( ƒ('explore_vertical') ) ).values(),
          allReports = d3.set( data.map( ƒ('report') ) ).values(),
          allCaseStudies = data.filter( function(d) {
            if (d.case_study === 'TRUE') {
              return d;
            }
          });

      allVerticals = allVerticals.sort(function(a, b) {
        return d3.ascending(a, b);
      });

      allReports = allReports.sort(function(a, b) {
        return d3.ascending(a, b);
      });

      var verticalSelect = d3.select('#vertical-select');

      verticalSelect.append('option')
                    .text('Select a Vertical')
                    .attr({
                      'disabled': true,
                      'selected': true
                    });

      verticalSelect.append('option')
                    .text('All Sectors')
                    .attr('value', 'Explore');

      verticalSelect.appendMany(allVerticals, 'option')
                    .text( ƒ() )
                    .attr('value', ƒ());

      verticalSelect.on('change', function(d) {
                      var vertical = d3.select(this).property('value');

                      update(vertical, true);
                    });

      var caseStudySelect = d3.select('#case-study-select');

      caseStudySelect.append('option')
                     .text('Select a Case Study')
                     .attr({
                       'disabled': true,
                       'selected': true
                     });

      allReports.forEach(function(d) {
        var optGroup = caseStudySelect.append('optgroup.pv3')
                                      .attr('label', d),
            optCaseStudies = allCaseStudies.filter( function(e) {
              if (e.report === d) {
                return e;
              }
            });
        
        optGroup.appendMany(optCaseStudies, 'option')
                .text( ƒ('brand') )
                .attr('value', function(e) {
                  return JSON.stringify(e);
                });
      });

      caseStudySelect.on('change', function(d) {
        var caseStudy = d3.select(this).property('value');

        updateCaseStudy( JSON.parse(caseStudy) );
      });

      draw();
    } 

    function draw() {
      var total,
          width,
          height,
          columns = $(window).innerWidth() > 1030 && !isMobile ? 4 : null,
          rows = $(window).innerWidth() > 1030 && !isMobile ? null : 4,
          max = null,
          squareSize,
          gap = 4,
          theData = {};

      dataByReport.forEach(function(d, i) {
        total = d.values.length;

        if ( $(window).innerWidth() > 1030 && !isMobile ) {
          rows = Math.floor(total / columns);  

          if (!max || rows > max) 
            max = rows;
        } else {
          columns = Math.floor(total / rows);

          if (!max || columns > max) 
            max = columns;
        }
      });

      dataByReport.forEach(function(d, i) {
        var sortBy = ['Leader', 'Other', 'Laggard'],
            sortByObj = {};

        sortBy.forEach(function(e, j) {
          sortByObj[e] = j + 1;
        });

        theData = d.values;

        theData = theData.sort(function(a, b) {
          return d3.descending(a.brand, b.brand);
        });

        theData = theData.sort(function(a, b) {
          return (sortByObj[a.class] || 0) - (sortByObj[b.class] || 0);
        });

        if ( $(window).innerWidth() > 1030 && !isMobile ) {
          var chartBox = chart.append(`div#chart-${i + 1}.col.col-2.h100`);  

          var label = chartBox.append('h6.mb2.grey40.neue-roman')
                              .html( function(e) { return theData[0].report; } );

          var reportCopy = [
            {
              'name' : 'Omnichannel',
              'copy' : 'From its inception, digital has accelerated the opportunities for always-on interaction and sales channels, but it’s taken a while for the retail industry (via infrastructure and technology) and consumers (via behavior and devices) to reach full omnichannel potential. L2’s analysis found that while most retailers are getting the basics right, leaders break away by employing omnichannel tactics and technologies across the entire retail operation.'
            },
            {
              'name' : 'Loyalty',
              'copy' : 'Sixteen percent of brands are Leaders, they successfully distribute content across multiple touchpoints tie it to a robust checkout process. This quadrant is dominated by sophisticated Department Stores and Specialty Retailers, and includes brands like Neiman Marcus and Sephora.'
            },
            {
              'name' : 'Localization',
              'copy' : 'Fifteen percent of brands feature strong content creation but fail to streamline the checkout process. Many of these brands are backed by large conglomerates with substantial content budgets but weak direct-to-consumer commerce, like L’Oréal Paris.'
            },
            {
              'name' : 'Mobile',
              'copy' : 'Sixty-one percent of brands are Laggards, characterized by limited content and a clunky checkout process. This quadrant includes CPG brands such as Dove that relied on third-party retailers for point-of-sale, as well as Consumer Electronics and Fashion brands that struggled to implement expedited payment options like Bose and Gucci.'
            },
            {
              'name' : 'Content & Commerce',
              'copy' : 'Sixty-one percent of brands are Laggards, characterized by limited content and a clunky checkout process. This quadrant includes CPG brands such as Dove that relied on third-party retailers for point-of-sale, as well as Consumer Electronics and Fashion brands that struggled to implement expedited payment options like Bose and Gucci.'
            },
            {
              'name' : 'Data & Targeting',
              'copy' : 'Sixty-one percent of brands are Laggards, characterized by limited content and a clunky checkout process. This quadrant includes CPG brands such as Dove that relied on third-party retailers for point-of-sale, as well as Consumer Electronics and Fashion brands that struggled to implement expedited payment options like Bose and Gucci.'
            }
          ];

          thisCopy = reportCopy.filter( function(e) {
            if (e.name === d.key) {
              return e;
            }
          });

          var info = chartBox.append('div.mb2')
                             .datum(thisCopy)
                             .html(`<img src="img/info.svg" alt="" class="w100 / pointer">`)
                             .style({
                               'width': '15px',
                               'height': '15px'
                             });

          chart.append('div.diq-tip');

          info.on('mouseenter', function(e) { 
                d3.select('.diq-tip')
                  .html( function() {
                    return `<p class='neue-roman / grey40'>${e[0]['copy']}</p>`;
                  });

                  d3.select('.diq-tip')
                    .style({
                      'visibility' : 'visible',
                      'opacity' : 1, 
                      'top' : (d3.event.clientY - 175) + 'px',
                      'left' : (d3.event.clientX - 40) + 'px'
                    });
              })
              // .on('mouseleave', function(d) {
              //   d3.select('.diq-tip')
              //     .style({
              //       'visibility' : 'hidden',
              //       'opacity' : 0
              //     });
              // });
        } else {
          var chartBox = chart.append(`div#chart-${i + 1}.w100`);

          var label = chartBox.append('h6.mb1.grey40')
                              .html( function(e) { return theData[0].report; } );
        }

        if ( $(window).innerWidth() > 1030 && !isMobile ) {
          chartBox.style('height', '100%');
        } else {
          chartBox.style('height', '16.666%');
        }

        width = $(`#chart-${i + 1}`).innerWidth();
        height = $(`#chart-${i + 1}`).innerHeight();

        if ( height > width ) {
          squareSize = (height / max) - (gap * 2);
        } else {
          squareSize = (width / max) - (gap * 2);
        }

        if (squareSize < 0)
          squareSize = 1;

        d3.selectAll('.chart-legend__square')
          .style({
            'width': function() {
              return squareSize >= 18 ? '18px' : squareSize + 'px';
            },
            'height': function() {
              return squareSize >= 18 ? '18px' : squareSize + 'px'
            }
          });

        var svg = chartBox.append('svg')
                          .attr({
                            'width': width,
                            'height': height
                          });

        var g = svg.append('g')
                   .translate([3, 3]);

        var item = g.selectAll('div')
                    .data(theData);

        if ( $(window).innerWidth() > 1030 && !isMobile ) {
          item.enter()
              .append('rect.item')
              .attr({
                'width': squareSize,
                'height': squareSize,
                'fill': function(e) { return selectColor(e.class); },
                'x': function(e, j) {
                  var col = j % columns;
                  return (col * squareSize) + (col * gap);
                },
                'y': function(e, j) {
                  var row = Math.floor(j / columns);
                  return (row * squareSize) + (row * gap);
                },
                'data-vertical': ƒ('vertical'),
                'data-explore-vertical': ƒ('explore_vertical'),
              });
        } else {
          item.enter()
              .append('rect.item')
              .attr({
                // 'width': (width / max) - gap,
                'width': squareSize,
                'height': squareSize,
                'fill': function(e) { return selectColor(e.class); },
                'x': function(e, j) {
                  var col = Math.floor(j / rows);
                  return (col * squareSize) + (col * gap);
                },
                'y': function(e, j) {
                  var row = j % rows;
                  return (row * squareSize) + (row * gap);
                },
                'data-vertical': ƒ('vertical')
              });
        }
      });

      if ( $(window).innerWidth() > 1030 && !isMobile ) {
        chart.append('div.diq-tip');

        d3.selectAll('.item')
          .on('mouseenter', function(d, i) { 
            d3.select('.diq-tip')
              .html( function() {
                return `<h5 class="mb2 / neue-bold / white">${ d.brand }</h5>
                        <h5 class="tip-label / mb3 / neue-bold"></h5>

                        <div class="tip-chart / mb3"></div>

                        <div class="legend / mb2">
                          <div class="inline-block / mr3">
                            <div class="tip-legend__square / inline-block / mr2 / bg-grey40"></div>
                            <h6 class="neue-bold / inline-block / grey40">
                              <span class="legend__brand">${d.brand}</span>
                            </h6>
                          </div>

                          <div class="inline-block / mr3">
                            <div class="legend__square / inline-block / mr2 / bg-grey40"></div>
                            <h6 class="neue-bold / inline-block / grey40">
                              <span class="legend__report">${d.report}</span> Average
                            </h6>
                          </div>
                         
                          <div class="inline-block / mr3">
                            <div class="legend__square / inline-block / mr2 / bg-grey85"></div>
                            <h6 class="neue-bold / inline-block / grey40">
                              <span class="legend__sector">${d.vertical}</span> Average
                            </h6>
                          </div>
                        </div>`;
              });

              d3.select('.diq-tip')
                .style({
                  'visibility' : 'visible',
                  'opacity' : 1, 
                  'top' : (d3.event.clientY - 310) + 'px',
                  'left' : (d3.event.clientX - 40) + 'px'
                });

            if (d.case_study) {
              updateCaseStudy(d);
            } else {
              updateTipChart(d, '.tip-chart');
            }
          })
          // .on('mouseleave', function(d) {
          //   d3.select('.diq-tip')
          //     .style({
          //       'visibility' : 'hidden',
          //       'opacity' : 0
          //     });
          // });
      } else {
        d3.selectAll('.item')
          .on('touchstart', function(d, i) { 
            if (d.case_study)
              updateCaseStudy(d);
          });
      }
    
      if ( $(window).innerWidth() > 1030 && !isMobile ) {
        d3.select('.chart-legend')
          .style('bottom', '-3rem');
      }

      d3.select(window).on('resize', resize);

      function resize() {
        var newColumns = $(window).innerWidth() > 1030 && !isMobile ? 4 : null,
            newRows = $(window).innerWidth() > 1030 && !isMobile ? null : 4;

        dataByReport.forEach(function(d, i) {
          if ( $(window).innerWidth() > 1030 && !isMobile ) {
            newRows = Math.floor(total / newColumns);  

            if (!max || newRows > max) 
              max = newRows;
          } else {
            newColumns = Math.floor(total / newRows);

            if (!max || newColumns > max) 
              max = newColumns;
          }
        });

        dataByReport.forEach(function(d, i) {
          chartBox = d3.select(`div#chart-${i + 1}`);

          newWidth = $(`#chart-${i + 1}`).innerWidth();
          newHeight = $(`#chart-${i + 1}`).innerHeight();

          if ( newHeight > newWidth ) {
            squareSize = (newHeight / max) - (gap * 1.5);
          } else {
            squareSize = (newWidth / max) - (gap * 1.5);
          }

          if (squareSize < 0)
            squareSize = 1;

          chartBox.select('svg')
                  .attr({
                    'width': newWidth,
                    'height': newHeight
                  });

          if ( $(window).innerWidth() > 1030 && !isMobile ) {
            d3.selectAll('.item')
              .attr({
                'width': squareSize,
                'height': squareSize
              });
          } else {
            d3.selectAll('.item')
              .attr({
                'width': squareSize,
                'height': squareSize
              });
          }
        });
      }
    }

    function update(vertical, explore = false) {
      var dataType = explore ? 'explore-vertical' : 'vertical';

      if (vertical != '') {
        var squares = d3.selectAll(`.item[data-${dataType}='${vertical}']`);

        d3.selectAll('.item')
          .transition()
          .duration(500)
          .style({
            'opacity': 0.25,
            'stroke': 'black',
            'stroke-width': 0
          });

        d3.selectAll('.stroke')
          .classed('stroke', false);

        squares.transition()
               .duration(750)
               .style({
                 'opacity': 1,
                 'stroke': function(d) {
                   return d.case_study ? 'white' : 'black';
                 },
                 'stroke-width': function(d) {
                   return d.case_study ? 3 : 0;
                 }
               });
      } else {
        d3.selectAll('.item')
          .transition()
          .duration(500)
          .style({ 
            'opacity': 1,
            'stroke': 'black',
            'stroke-width': 0
          });
      }

      if (vertical === 'Explore') {
        d3.selectAll('.item')
          .transition()
          .duration(500)
          .style({
            'opacity': 1,
            'stroke': function(d) {
              return d.case_study ? 'white' : 'black';
            },
            'stroke-width': function(d) {
              return d.case_study ? 3 : 0;
            }
          });
      }
    }

    function updateCaseStudy(data) {
      var brand = data['brand'],
          report = data['report'],
          vertical = $currentStep === 'Explore' ? 'Explore' : data['vertical'],
          klass = data['class'];

      d3.selectAll(`.step[data-step="${vertical}"] .case-study`)
        .remove();

      d3.json('js/caseStudies.json', function(caseStudies) {
        var studyData = caseStudies.filter( function(d) {
          if (d.report === report &&
              d.brand === brand) {
            return d;
          }
        });

        d3.select(`.step[data-step="${vertical}"]`)
          .append('div.case-study.pv3.ph4.ba.b-grey60')
          .html(`<p class="mb1 / neue-bold / grey60">
                   Case Study: <span class="white /case-study__title">${studyData[0]['title']}</span>
                 </p>

                 <h3 class="case-study__brand / neue-bold / mb4">${studyData[0]['brand']}</h3>

                 <div class="case-study__chart / mb3 pl5-l"></div>

                 <div class="legend / mb4 mb5-l ml5-l">
                   <div class="inline-block / mr3">
                     <div class="brand-legend__square legend__square / inline-block / mr2"></div>
                     <h6 class="neue-bold / inline-block / grey40">
                       <span class="legend__brand">${studyData[0]['brand']}</span>
                     </h6>
                   </div>

                   <div class="inline-block / mr3">
                     <div class="legend__square / inline-block / mr2 / bg-grey40"></div>
                     <h6 class="neue-bold / inline-block / grey40">
                       <span class="legend__report">${report}</span> Average
                     </h6>
                   </div>
                   
                   <div class="inline-block / mr3">
                     <div class="legend__square / inline-block / mr2 / bg-grey85"></div>
                     <h6 class="neue-bold / inline-block / grey40">
                       <span class="legend__sector">${data['vertical']}</span> Average
                     </h6>
                   </div>
                 </div>
                 
                 <img src="img/icons/${report}-${brand}.svg" class="relative / hide block-l / fl-l / w5 h5 / mr4 mb3" />
                 <p class="case-study__text / mb3 / white">${studyData[0]['text']}</p>

                 <h6 class="neue-roman / grey40 / pb3">${studyData[0]['footnote']}</h6>`)
          .style('opacity', 0)
          .transition()
          .duration(300)
          .style('opacity', 1);

        d3.select(`.step[data-step="${vertical}"] .case-study .case-study__brand`)
          .style({
            'color': function(d) {
              return klass ? selectColor(klass) : 'white';
            }
          });      

        d3.select(`.step[data-step="${vertical}"] .case-study .brand-legend__square`)
          .style({
            'background-color': function(d) {
              return selectColor(klass);
            }
          })

        updateTipChart(data, `.step[data-step="${vertical}"] .case-study .case-study__chart`);
        updateTipChart(data, '.tip-chart');
      });
    }

    function updateTipChart(data, el) {
      d3.select('.tip-chart svg').remove();

      var report = data['report'],
          vertical = data['vertical'];

      var axes = {
        'Omnichannel': {
          'max': 10,
          'x-line': 5,
          'y-line': 5,
          'top-left': 'E-Commerce Focused',
          'bottom-right': 'Brick & Mortar Focused'
        },
        'Localization': {
          'max': 100,
          'x-line': 50,
          'y-line': 50,
          'top-left': 'E-Commerce Focused',
          'bottom-right': 'Content Focused'
        },
        'Content & Commerce': {
          'max': 10,
          'x-line': 4,
          'y-line': 2.5,
          'top-left': 'Limited Content, Optimized Checkout',
          'bottom-right': 'Optimized Content, Difficult Checkout'
        },
        'Loyalty': {
          'max': 10,
          'x-line': 3,
          'y-line': 3,
          'top-left': 'Low Variety, High Integration',
          'bottom-right': 'High Variety, Low Integration'
        },
        'Mobile': {
          'max': 10,
          'x-line': 5,
          'y-line': 5,
          'top-left': 'Marketing-First',
          'bottom-right': 'Content-First'
        },
        'Data & Targeting': {
          'max': 10,
          'x-line': 6.6,
          'y-line': 3.5,
          'top-left': 'Streamliners',
          'bottom-right': 'Data Miners'
        }
      },
      graphData = axes[ data['report'] ],
      quadrants = [
        { 'name': graphData['top-left'],
          'position': 'top-left' },
        { 'name': 'Leader',
          'position': 'top-right' },
        { 'name': 'Laggard',
          'position': 'bottom-left' },
        { 'name': graphData['bottom-right'],
          'position': 'bottom-right' }
      ];

      d3.select('.tip-label')
        .html(function() {
          if (data['score_x'] > graphData['y-line']) {
            if (data['score_y'] > graphData['x-line']) {
              return 'Leader';
            } else {
              return graphData['bottom-right'];
            }
          } else {
            if (data['score_y'] > graphData['x-line']) {
              return graphData['top-left'];
            } else {
              return 'Laggard';
            }
          }
        })
        .style('color', function(d) { 
          return selectColor(data['class']); 
        });

      if ( $(window).innerWidth() > 1030 && !isMobile ) {
        var sides = el === '.tip-chart' ? 25 : 75,
            margin = {top: 10, right: sides, bottom: 20, left: 5};
      } else {
        var margin = {top: 10, right: 0, bottom: 20, left: 0};
      }

      var containerWidth = $(`${el}`).width(),
          containerHeight = $(`${el}`).height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var xScale = d3.scale.linear()
                     .domain([0, graphData['max']])
                     .range( [0, width] ),
          yScale = d3.scale.linear()
                     .domain([0, graphData['max']])
                     .range( [height, 0] );

      var tipsvg = d3.select(`${el}`)
                     .append('svg')
                     .attr({ 
                       'width' : width + margin.left + margin.right,
                       'height' : height + margin.top + margin.bottom
                     })
                     .append('g')
                     // .translate([margin.left, margin.top]);

      var xAxisLine = tipsvg.append('line.quad-line')
                            .attr({
                              'x1' : xScale(0),
                              'y1' : yScale( graphData['x-line'] ),
                              'x2' : xScale(graphData['max']),
                              'y2' : yScale( graphData['x-line'] )
                            });

      var yAxisLine = tipsvg.append('line.quad-line')
                            .attr({
                              'x1' : xScale( graphData['y-line'] ),
                              'y1' : yScale(0),
                              'x2' : xScale( graphData['y-line'] ),
                              'y2' : yScale(graphData['max'])
                            });

      var quadGroup = tipsvg.appendMany(quadrants, 'g.quad-group')
                            .translate(function(d) {
                              var x, y;

                              switch (d.position) {
                                case 'top-left':
                                 x = 0;
                                 y = 2;
                                 break;

                               case 'top-right':
                                 x = width;
                                 y = 2;
                                 break;

                               case 'bottom-left':
                                 x = 0;
                                 y = height - 5;
                                 break;

                               case 'bottom-right':
                                 x = width;
                                 y = height - 5;
                                 break;
                              }

                              return [x, y];
                            });

      quadGroup.append('text.quad-label')
               .text( ƒ('name') ) 
               .attr({ 
                 'text-anchor' : function(d) {
                   var anchor;

                   switch(d.position) {
                     case 'top-left':
                       anchor = 'start';
                       break;

                     case 'top-right':
                       anchor = 'end';
                       break;

                     case 'bottom-left':
                       anchor = 'start';
                       break;

                     case 'bottom-right':
                       anchor = 'end';
                       break;
                   }

                   return anchor;
                 }
               }).
               call(wrap, 50)

      var averages = getAverages(report, vertical);

      var avgGroup = tipsvg.selectAll('g.avgGroup')
                           .data(averages)
                           .enter()
                           .append('g.avgGroup')
                           .translate(function(d) {
                             return [xScale(d.score_x), yScale(d.score_y)];
                           });

      avgGroup.append('rect.box')
              .attr({
                'width': '9px',
                'height': '9px',
                'fill': ƒ('color')
              });

      var brandGroup = tipsvg.append('g')
                             .datum(data)
                             .translate(function(d) {
                               return [xScale(d.score_x), yScale(d.score_y)];
                             });

      brandGroup.append('rect.box')
                .attr({
                  'width': '9px',
                  'height': '9px',
                  'fill': function(d) { return selectColor(d.class); }
                });

      brandGroup.append('text.neue-bold')
                .text( ƒ('brand') )
                .style({
                  'text-anchor': 'middle',
                  'fill': function(d) { return selectColor(d.class); }
                })
                .translate( function(d) {
                  return [0, 25];
                  // return d.score_y > (graphData['max'] / 4) ? [3, 25] : [3, -6];
                })
                .call(wrap, 100);

      d3.select('.tip-legend__square')
        .style({
          'background-color': function(d) {
            return selectColor(data['class']);
          }
        });
    }

    function getAverages(report, vertical) {
      var reportData = dataByReport.filter( function(d) {
            return d.key === report;
          }),
          verticalData = reportData[0]['values'].filter( function(d) {
            return d.vertical === vertical;
          });

      var reportMeanX = d3.mean(reportData[0].values, ƒ('score_x')),
          reportMeanY = d3.mean(reportData[0].values, ƒ('score_y')),
          verticalMeanX = d3.mean(verticalData, ƒ('score_x')),
          verticalMeanY = d3.mean(verticalData, ƒ('score_y'));

      return [{ 'brand': `${report} Average`,
                'score_x': reportMeanX,
                'score_y': reportMeanY,
                'color': '#999999'},
              { 'brand': `${vertical} Average`,
                'score_x': verticalMeanX,
                'score_y': verticalMeanY,
                'color': '#262626' }];
    }

    function selectColor(klass) {
      switch (klass) {
        case 'Leader':
          return '#17D455';
          break;
        case 'Laggard':
          return '#E62A02';
          break;
        default:
          return '#E6D101';
      }
    }

    letsGo();

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            pieces, 
            piece,
            line_width,
            x_offset,
            tspan,
            previous_content;

        pieces = text.text()
                     .split(/\s+/)
                     .reverse();

        text.text('');

        tspan = text.append('tspan');
        tspan.attr({
               'dx': 0,
               'dy': 0
             });

        x_offset = 0;

        while (pieces.length > 0) {
          piece = pieces.pop();

          tspan.text(tspan.text() + ' ' + piece);

          line_width = tspan.node()
                            .getComputedTextLength() || 0;

          if (line_width > width) {
              previous_content = tspan.text()
                                      .split(' ')
                                      .slice(0, -1)
                                      .join(' ');

              tspan.text(previous_content);

              x_offset = tspan.node().getComputedTextLength() * -1;

              tspan = text.append('tspan');
              tspan.attr({
                     'dx': x_offset,
                     'dy': '1em'
                   })
                   .text(piece);
          }
        }
      });
    }

    $(window).scroll( function() {
      var fromTop = $(window).scrollTop();
      $('body').toggleClass('down', (fromTop > 2500));
    });

    if ($(window).innerWidth() < 1030 && isMobile) {
      $(window).on('orientationchange', function() {
        if (window.innerHeight > window.innerWidth) {
          $('.js-rotate').show();
          $('.js-rotate').animate({'opacity' : 1}, 750);
          $('body').addClass('rotate');
        } else {
          $('.js-rotate').hide();
          $('.js-rotate').animate({'opacity' : 0}, 750);
          $('body').removeClass('rotate');
        }
      });
    }
  }

  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});