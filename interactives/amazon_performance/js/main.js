// TODO:
// - Fix tooltip bug
// - Top always dotted line?
// - Percent change becomes avg of month 1 v avg of month 2

// - Select date range:  
//   - Needs interface
//   - Change the domain from extant to selected dates

// Ranking sort

// ToDo:
//  - Hide defaults when more than one brand is selected
//  - Column sort...
// - Categories persist when toggling b/w graph/rank
// cat title resets with graph switch

var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    var backround = 'grey85';

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    /* ========== GLOBALS ========== */
    var $timeScale,
        $graph = 'graph';

    /* ========== SET RESPONSIVE CONTAINER ========== */
    var margin = {top: 25, right: 0, bottom: 30, left: 50};

    var containerWidth = $('.chart-container').width(),
        containerHeight = $('.chart-container').height(),
        width = containerWidth - margin.left - margin.right,
        height = containerHeight - margin.top - margin.bottom;

    /* ========== SET SCALES ========== */
    var xScale = d3.time.scale()
                   .range( [0, width] ),
        yScale = d3.scale.linear()
                   .range( [height, 0] );

    var colors = [ '#E62A02', '#e60213', '#e60402', '#e61702', '#e63d02', '#e65002', '#e66302',
                   '#FFA600', '#ff6600', '#ff7c00', '#ff9100', '#ffbb00', '#ffd100', '#ffe600',
                   '#f3bc15', '#f3ce15', '#f3e115', '#f3f315', '#e1f315', '#cef315', '#bcf315',
                   '#17D455', '#17d426', '#17d436', '#17d445', '#17d465', '#17d475', '#17d484',
                   '#229ED8', '#22ccd8', '#22bcd8', '#22add8', '#228fd8', '#2280d8', '#2271d8',
                   '#0540c2', '#0531c2', '#0521c2', '#0511c2', '#0905c2', '#1805c2', '#2805c2',
                   '#8648CD', '#6548cd', '#7048cd', '#7b48cd', '#9148cd', '#9c48cd', '#a748cd',
                   '#D66EC2', '#d06ed6', '#d66ed3', '#d66ecb', '#d66eb9', '#d66eb1', '#d66ea8' ];

    /* ========== SET AXES ========== */
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom')
                  .ticks(6)
                  .tickSize( -height ),
        yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('left')
                  .tickSize( width );

    /* ========== PATH GENERATOR ========== */
    var path = d3.svg.line()
                     .x(function(d) {
                       if (d.fact_date) {
                         if (Object.prototype.toString.call(d.fact_date) == '[object Date]') {
                           // If d.fact_date is Date object return d.fact_date
                           return xScale(d.fact_date);
                         } else {
                           // If d.fact_date is not a Date object convert to Date first
                           return xScale( d3.time.format('%Y-%m-%d').parse(d.fact_date) );
                         }
                       }
                     })
                     .y(function(d) { return yScale(d[$timeScale]); })
                     .interpolate('basis');

    /* ========== TIME FORMATING FUNCTION ========== */
    var formatLabel = d3.time.format('%B %_d, %Y');

    /* ========== LOAD CATEGORIES.CSV DATA FILE ========== */
    d3.csv('js/categories.csv', ready);
    // d3.csv('/interactives/amazon_performance_rank/js/categories.csv', ready);

    function ready(err, data) {
      if (err) console.warn('Error', err);

      /* ========== CONVERT DATA TO INTEGERS ========== */
      data.forEach( function(d) {
        d.id = +d.id;
        d.level = +d.level;
        d.parent_id = +d.parent_id;
      });

      /* ========== GET LIST OF ALL CATEGORIES ========== */
      var allCategories = d3.set( data.map( function(d) { return d.category; } ) ).values();  
          
      /* ========== BUILD CATEGORY DROPDOWN ========== */
      var categorySelect = d3.select('#category-select');

      categorySelect.appendMany(allCategories, 'option')
                    .text( ƒ() )
                    .attr('value', ƒ());

      $('#category-select').chosen()
                           .change(function(d) {
                             var category = d3.select(this).property('value');

                             // Set the chosen category
                             set(category); 
                           });

      set();

      function set(category) {
        if (!category)
          category = allCategories[0];

        /* ========== RESET BUTTON CLASSES ========== */
        d3.selectAll('.timescale-btn')
          .classed('active', false);

        d3.select('.timescale-btn')
          .classed('active', true);

        /* ========== GET ID OF CATEGORY ========== */
        var dataID,
            categoryData = data.filter( function(d) {
              if (d.category === category) {
                dataID = d.id;
                return d.category;
              }
            });

        /* ========== UPDATE GRAPH TITLE ========== */
        d3.select('.category-title')
          .text(category);

        /* ========== PULL DATA FILE BASED ON ID ========== */
        d3.tsv('js/ids/' + dataID + '.tsv', build);
        // d3.tsv('/interactives/amazon_performance_rank/js/ids/' + dataID + '.tsv', build);
      }

      function reset() {
        d3.select('.chart-container svg')
          .remove(); 

        d3.select('.chart-container div')
          .remove();

        d3.selectAll('.legend__item')
          .remove();

        d3.selectAll('.brand-legend')
          .classed('hide', true);

        if ( $('.select-brand') )
          $('.select-brand').remove();

        if ( $('#brand-select') )
          $('#brand-select').remove();

        if ( $('#brand_select_chosen') )
          $('#brand_select_chosen').remove();

        if ( $('.mouse-over-effects') )
          $('.mouse-over-effects').remove();
      }

      function build(err, catData) {
        /* ========== RESET DROPDOWNS ========== */
        reset();

        updateTimescale();
        updateLegend();

        /* ========== CONVERT DATA TO INTEGERS ========== */
        catData.forEach( function(d) {
          d.overall_score_1 = +d.overall_score_1;
          d.overall_score_7 = +d.overall_score_7;
          d.overall_score_14 = +d.overall_score_14;
          d.overall_score_30 = +d.overall_score_30;
          d.overall_score_90 = +d.overall_score_90;
          d.overall_score_365 = +d.overall_score_365;
          d.url_id = +d.url_id;
        });

        /* ========== GROUP DATA BE BRAND ========== */
        var dataByBrand = d3.nest()
                            .key( ƒ('brand') )
                            .entries(catData);

        /* ========== GET LIST OF ALL BRANDS ========== */
        var allBrands = d3.set( dataByBrand.map(function(d) { return d.key; }) ).values();

        allBrands = allBrands.sort(function(a, b) {
          return d3.ascending(a, b);
        });

        /* ========== GET LIST OF ALL DATES ========== */
        var allDates = catData.map(function(d) {
          return d3.time.format('%Y-%m-%d').parse(d.fact_date);
        });

        /* ========== UPDATE THE TIMESCALE ========== */
        // d3.selectAll('.timescale-btn')    
        //   .on('click', function() {
        //     $timeScale = $(this).data('timescale');

        //     d3.selectAll('.timescale-btn')
        //       .classed('active', false);

        //     d3.select(this)
        //       .classed('active', true);

        //     updateTimescale();
        //   }); 

        $('body').on(myEvent, '.graph-btn', function(e) {
          $graph = $(this).data('graph');

          var self = d3.select(this);

          if ( !self.classed('active') ) {
            d3.selectAll('.graph-btn')
              .classed('active', false);

            d3.select(this)
              .classed('active', true);

            $graph == 'graph' ? buildGraph() : buildRanking();
          }
        }); 

        $graph == 'graph' ? buildGraph() : buildRanking();

        function buildGraph() {
          reset();

          $timeScale = 'overall_score_7';

          /* ========== APPEND SVG ========== */
          var svg = d3.select('.chart-container')
                      .append('svg')
                      .attr({
                        'width' : width + margin.left + margin.right,
                        'height' : height + margin.top + margin.bottom
                      })
                      .append('g')
                      .translate([margin.left, margin.top]);

          /* ========== BUILD AXES GROUPS ========== */
          var yAxisGroup = svg.insert('g.y.axis', '.mouse-over-effects')
                              .translate([width , 0]),
              xAxisGroup = svg.insert('g.x.axis', '.mouse-over-effects')
                              .translate([0, height]);

          /* ========== BUILD AXIS LABELS ========== */
          var leftAxisLabel = xAxisGroup.append('g')
                                        .translate([0, 25]);

          leftAxisLabel.append('text.left.axis.label')
                       .attr({ 'text-anchor': 'start' });

          var rightAxisLabel = xAxisGroup.append('g')
                                         .translate([width, 25]);

          rightAxisLabel.append('text.right.axis.label')
                        .attr({ 'text-anchor': 'end' });

          var yAxisLabel = yAxisGroup.append('g')
                                     .attr('transform', 'translate(' + -(width + 35) + ', ' + (height / 2) + ')');

          yAxisLabel.append('text.y.axis.label.grey20.f5')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .text('Amazon Performance Score')
                    .attr('class', 'y axis label grey20 ');  

          /* ========== SET SCALE DOMAINS ========== */
          xScale.domain( d3.extent(allDates) );
          yScale.domain( [0, 10] );

          /* ========== BUILD AXES LABELS ========== */
          d3.select('.left.axis.label')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .text( formatLabel( new Date( allDates[0] ) ) )
            .style('opacity', 1);

          d3.select('.right.axis.label')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .text( formatLabel( new Date( allDates[allDates.length - 1] ) ) )
            .style('opacity', 1);

          /* ========== BUILD BRAND LIST DROPDOWN ========== */
          var brandSelect = d3.select('.select-container');

          brandSelect.insert('h5.select-brand.mt4.mb2.white', '.hierarchy')
                     .html('Select Brand <span class="grey40">(</span><span class="grey40 number-of-brands">n Brands</span><span class="grey40">)</span>');

          var select = brandSelect.insert('select#brand-select.w100', '.hierarchy')
                                  .attr({ 'name': 'brand-select' });

          select.append('option')
                .attr('disabled', true)
                .text('Select Brand');

          select.appendMany(allBrands, 'option')
                .text( ƒ() )
                .attr('value', ƒ());

          $('#brand-select').chosen({ placeholder_text_single: 'Select Brand' })
                            .on('change', function(d) {
                               var brand = d3.select(this).property('value');

                               // Add selected brand to the graph
                               addBrand(brand); 
                            });

          /* ========== UPDATE NUMBER OF BRANDS IN SUBTITLE ========== */
          d3.selectAll('.number-of-brands')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .text(allBrands.length + ' Brands')
            .style('opacity', 1);

          /* ========== BUILD MOUSEOVER TOOLTIP GROUP ========== */
          mouseG = svg.append('g.mouse-over-effects');

          mouseG.append('path.mouse-line')
                .style({
                  'stroke': '#999999',
                  'stroke-width': '1px',
                  'opacity': '0'
                });

          mouseG.append('svg:rect') 
                .attr({
                  'width': width,
                  'height': height,
                  'fill': 'none',
                  'pointer-events': 'all'
                });

          updateGraph();

          function updateGraph() {
            /* ========== UPDATE THE DOMAIN ========== */
            xScale.domain( d3.extent(allDates) );
            yScale.domain( [0, 10] );

            /* ========== TRANSITION/UPDATE THE AXES ========== */
            xAxisGroup.transition()
                      .duration(1000)
                      .call(xAxis);

            yAxisGroup.transition()
                      .duration(1000)
                      .call(yAxis)
                      .selectAll('text')
                      .attr('dx', '-8');

            /* ========== DRAW DEFAULT BRAND LINES ========== */
            defaults();
          }

          function defaults() {
            /* ========== RESET LINES ========== */
            d3.selectAll('.line')
              .transition()
              .duration(500)
              .style('opacity', 0)
              .remove();
            
            /* ========== SET FUNCTION GLOBALS ========== */
            var top = null,
                winning = null,
                losing = null,
                variable = null;

            /* ========== CALCULATE TOP, WINNING, LOSING, & VARIABLE BRANDS ========== */
            dataByBrand.forEach(function(d) {
              // Top: Highest overall score
              sum = d3.sum(d.values, function(e) {
                return e[$timeScale];
              });

              if (!top || sum > top[0]) 
                top = [sum, d.key];

              // Winning/Losing: most gains/losses between first and last day
              var first = d.values[0][$timeScale],
                  last = d.values[d.values.length - 1][$timeScale],
                  diff = last - first;

              if (diff > 0)
                if (!winning || diff > winning[0])
                  winning = [diff, d.key];

              if (diff <= 0)
                if (!losing || diff < losing[0])
                  losing = [diff, d.key]

              // Variable: Biggest difference between peak and lowest days
              // TODO: May become highest standard deviation from the norm
              var max = null,
                  min = null;

              var color = colors[ Math.floor(Math.random() * (colors.length - 0)) + 0 ];

              d.values.forEach(function(e) {
                e.color = color;

                if (!max || e[$timeScale] > max) 
                  max = e[$timeScale];
                
                if (!min || e[$timeScale] < min)
                  min = e[$timeScale];

                if (!variable || (max - min) > variable[0])
                  variable = [(max - min), d.key];
              })
            });

            /* ========== CALCULATE CATEGORY NORM/AVERAGE ========== */
            var datesForNorm = d3.set( catData.map(function(d) { return d.fact_date; }) ).values();
            
            // Find the average of all points to find the norm 
            var lengths = dataByBrand.map(function(d) { return d.values.length; });

            lengths.sort(function(a, b) {
              return d3.ascending(a, b);
            });

            var longestLength = lengths.pop(),
                norm = [];

            for (i = 0; i < longestLength; i++) {
              var tempArray = [];

              dataByBrand.forEach(function(d) {
                if (d.values[i]) {
                  tempArray.push(d.values[i][$timeScale]);
                }
              });

              var average = d3.mean(tempArray, function(e) { return e; });

              norm.push({
                'brand': 'Category Norm',
                'fact_date': datesForNorm[i],
                'overall_score_7': average
              });
            }

            /* ========== ADD NORM TO DATAOBJECT ========== */
            dataByBrand.push({
              'key': 'Category Norm',
              'values': norm
            });

            /* ========== GRAB DEFAULT BRAND NAMES ========== */
            var topBrand = top.pop(),
                variableBrand = variable.pop(),
                winningBrand = winning.pop(),
                losingBrand = losing.pop();

            /* ========== DRAW DEFAULT LINES ========== */
            addBrand(topBrand, 'top');
            addBrand('Category Norm', 'norm');
            addBrand(winningBrand, 'winning');
            addBrand(losingBrand, 'losing');
          }

          /* ========== ADD NEW BRAND LINE ========== */
          function addBrand(brand, klass) {
            if (!brand)
              brand = allBrands[0];

            if (!klass)
              klass = 'brand';

            if (klass == 'brand') {
              d3.selectAll('.line.default')
                .transition()
                .duration(500)
                .style('opacity', 0.4);
            }

            var color = '';

            /* ========== GRAB DATA FOR DEFAULT BRAND ========== */
            var brandData = dataByBrand.filter( function(d) { return d.key == brand; } )[0];

            /* ========== BUILD LINE ========== */
            var line = svg.insert('path', '.mouse-over-effects')
                          .datum(brandData.values)
                          .attr({
                            'class': function(d) { 
                              return klass == 'brand' ? 'line ' + klass : 'line ' + klass + ' default'; 
                            },
                            'd': function(d) { return path(d); },
                            'data-brand': brand,
                            'data-klass': klass,
                            'stroke': function(d) {
                              if ( klass == 'brand' ) {
                                if (d3.selectAll('.line:not(.default)')[0].length > 1) {
                                  color = d[0].color
                                  return color;
                                } else {
                                  color = 'white';
                                  return color;
                                }
                              }
                            }
                          });

            /* ========== ANIMATE LINE ========== */
            var totalLength = line.node().getTotalLength();

            line.attr({
                  'stroke-dasharray': totalLength + ' ' + totalLength,
                  'stroke-dashoffset': totalLength
                })
                .transition()
                .duration(1500)
                .ease('linear')
                .attr('stroke-dashoffset', 0);

            addLegend(brand, klass, color);
            addTooltip(klass, color);
          }

          /* ========== ADD ITEM TO LEGEND ========== */
          function addLegend(brand, klass, color) {
            switch (klass) {
              case 'top':
                var rank = 'Top Brand';
                break;
              case 'winning':
                var rank = 'Biggest Winner';
                break;
              case 'losing':
                var rank = 'Biggest Loser';
                break;
              case 'variable':
                var rank = 'Most Variable';
                break;
            }

            if (rank)
              brand = rank + ' (' + brand + ')';

            var legend = d3.select('.legend'),
                brandLegend = d3.select('.brand-legend'),
                lineTemplate = '<div class="inline-block / vam / w1 / bg-' + klass + ' / br-pill" style="height: 3px;"></div>' +
                               '<h6 class="inline-block / white / ml1">' + brand + '</h6>',
                pillTemplate = '<h6 class="pv1 ph2 / white bg-transparent / ba br-pill" style="border-color: ' + color + '">' + brand + '<i class="l2-close / ml3 / pointer" style="color: ' + color + '"></i></h6>';

            if (klass == 'brand') {
              if ( brandLegend.classed('hide') ) {
                brandLegend.classed('hide', false);
              }

              brandLegend.insert('div.legend__item.brand__item.inline-block.mr2.mb2', '.clear-all')
                         .attr({
                           'data-brand': brand,
                           'data-klass': klass
                         })
                         .html(pillTemplate);
            } else {
              legend.append('div.legend__item.inline-block.mr3.mb2')
                    .attr({ 'data-brand': brand })
                    .html(lineTemplate);
            }
          }

          /* ========== ADD ITEM TO TOOLTIP ========== */
          function addTooltip(klass, color) {
            var lineDataByBrand = captureLineData();

            var mousePerLine = mouseG.appendMany(lineDataByBrand, 'g.mouse-per-line')
                                     .attr({ 'data-brand': ƒ('key') });

            mousePerLine.append('circle')
                        .attr({
                          'r': 4,
                          'class': 'circle ' + klass
                        })
                        .style({
                          'fill': '#262626',
                          'stroke-width': '2px',
                          'opacity': '0',
                          'stroke': color
                        });

            var tip = mousePerLine.append('g.tooltip')
                                  .translate(function(d, i) {
                                    return Math.abs(i % 2) == 1 ? [-155, -25] : [15, -25];
                                  })
                                  .attr({
                                    'width': 1000,
                                    'height': 50,
                                    'data-brand': ƒ('key')
                                  })
                                  .style('opacity', 0);

            tip.append('text.st-text')
               .translate([8, 18]);

            tip.append('text.nd-text')
               .translate([8, 30]);

            tip.append('text.rd-text')
               .translate([8, 42]);

            tip.insert('rect', '.mouse-per-line g text')
               .attr({
                 'width': 140,
                 'height': 50
               })
               .style({
                 'stroke': '#E5E6E6',
                 'fill': 'rgba(255, 255, 255, 0.9)'
               });

            mouseG.on('mouseout touchend', function() { 
                    d3.select('.mouse-line')
                      .style('opacity', '0');

                    d3.selectAll('.mouse-per-line circle')
                      .style('opacity', '0');

                    d3.selectAll('.mouse-per-line g')
                      .style('opacity', '0');
                  })
                  .on('mouseover touchstart', function() { 
                    d3.select('.mouse-line')
                      .style('opacity', '1');

                    d3.selectAll('.mouse-per-line circle')
                      .style('opacity', '1');

                    d3.selectAll('.mouse-per-line g')
                      .style('opacity', '1');
                  })
                  .on('mousemove touchmove', function() {
                    var mouse = d3.mouse(this);

                    d3.select('.mouse-line')
                      .attr('d', function() {
                        var d = 'M' + mouse[0] + ',' + height;

                        d += ' ' + mouse[0] + ',' + 0;

                        return d;
                      });

                    d3.selectAll('.mouse-per-line')
                      .translate(function(d, i) {
                        var xDate = xScale.invert(mouse[0]),
                            bisect = d3.bisector(function(e) { return e.fact_date; }).left,
                            idx = bisect(d.values[i][$timeScale], xDate);
                        
                        var beginning = 0,
                            end = lines[i].getTotalLength(),
                            target = null;

                        while (true){
                          target = Math.floor((beginning + end) / 2);
                          pos = lines[i].getPointAtLength(target);

                          if ((target === end || target === beginning) && 
                               pos.x !== mouse[0]) {
                            break;
                          }

                          if (pos.x > mouse[0])      
                            end = target;

                          else if (pos.x < mouse[0]) 
                            beginning = target;

                          else break; 
                        }
                        
                        var self = d3.select(this);

                        if (target != 0) {
                          self.style('opacity', 1);
                        } else {
                          self.style('opacity', 0);
                        }

                        self.select('.st-text')
                            .text( ƒ('key') )
                            .style({
                              'font-size': '16px',
                              'fill': '#1A1A1A'
                            });

                        self.select('.nd-text')
                            .text('Score: ' + yScale.invert(pos.y).toFixed(2))
                            .style({
                              'font-size': '12px',
                              'fill': '#666666'
                            })

                        self.select('.rd-text')
                            .text('Date: ' + formatLabel(new Date(xDate)) )
                            .style({
                              'font-size': '12px',
                              'fill': '#666666'
                            })
                          
                        return [mouse[0], pos.y];
                      });
                  });
          }

          d3.select(window).on('resize', resizeGraph);

          function resizeGraph() {
            var newContainerWidth = $('.chart-container').width(),
                newContainerHeight = $('.chart-container').height(),
                newWidth = newContainerWidth - margin.left - margin.right,
                newHeight = newContainerHeight - margin.top - margin.bottom;

            d3.select('svg')
              .attr({
                'width' : newWidth + margin.left + margin.right,
                'height' : newHeight + margin.top + margin.bottom
              });

            xScale.range( [0, newWidth] );
            yScale.range( [newHeight, 0] );

            xAxis.tickSize( -newHeight );
            yAxis.tickSize( newWidth ); 

            xAxisGroup.attr('transform', 'translate(0,' + newHeight + ')')
                      .call(xAxis);

            yAxisGroup.attr('transform', 'translate(' + newWidth + ', 0)')
                      .call(yAxis);    
                      
            rightAxisLabel.translate([newWidth, 25]);

            d3.select('.mouse-over-effects') 
              .attr({
                'width': newWidth,
                'height': newHeight
              });

            d3.selectAll('.line')
              .attr({
                'd': function(d) { return path(d); }
              });
          }
        }

        function buildRanking() {
          reset();

          $timeScale = 'overall_score_30';

          d3.select('.legend')
            .append('div.legend__item.mb3')
            .html('<h6 class="grey20">' + formatLabel( new Date( allDates[0] ) ) + ' &#8211; ' + formatLabel( new Date( allDates[allDates.length - 1] ) ) + '</h6>');

          d3.select('.number-of-brands')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .text(allBrands.length + ' Brands')
            .style('opacity', 1);

          var div = d3.select('.chart-container')
                      .append('div.scrollable.relative.w100.h100.ovr-y--scroll.z1');

          // Build data

          // Rank = based on performance score
          // Change = avg of 1st month vs. avg of 2nd month
          // Deviation = Standard deviation 
          // Score = score on the last day

          var dataByBrand = d3.nest()
                              .key( ƒ('brand') )
                              .entries(catData);

          var rankingData = [];

          dataByBrand.forEach(function(d, i) {
            var deviation = d3.deviation(d.values, ƒ($timeScale)),
                first = d.values[0][$timeScale],
                last = d.values[d.values.length - 1][$timeScale],
                diff = last - first;
          
            first = parseFloat(Math.round(first * 100) / 100).toFixed(2);
            last = parseFloat(Math.round(last * 100) / 100).toFixed(2);
            diff = parseFloat(Math.round(diff * 100) / 100).toFixed(2);

            if (deviation) 
              deviation = parseFloat(Math.round(deviation * 100) / 100).toFixed(2);

            var brandData = dataByBrand.filter( function(e) { return e.key == d.key; } )[0].values;

            if ( !isMobile ) {
              rankingData.push({
                brand: d.key,
                change: diff,
                deviation: deviation,
                score: last,
                data: brandData
              });
            } else {
              rankingData.push({
                brand: d.key,
                score: last
              });
            }
          });

          rankingData = rankingData.sort( function(a, b) {
            return d3.descending(a.score, b.score);
          });

          rankingData.forEach(function(d, i) {
            d.rank = i + 1;
          });

          if ( !isMobile ) {
            var columns = [
                  { head: 'Rank', cl: 'w10', html: ƒ('rank') },
                  { head: 'Brand', cl: 'w30', html: ƒ('brand') },
                  { head: 'Percentage Change', cl: 'w40 pc', html: ƒ('change_fmt') },
                  { head: 'Variability Score', cl: 'w10', html: ƒ('deviation') },
                  { head: 'Performance Score', cl: 'w10', html: ƒ('score') }
                ];
          } else {
            var columns = [
                  { head: 'Rank', cl: 'w20', html: ƒ('rank') },
                  { head: 'Brand', cl: 'w50', html: ƒ('brand') },
                  { head: 'Performance Score', cl: 'w30', html: ƒ('score') }
                ];
          }

          var table = div.append('table.w100#main-table')
                         .style('border-collapse', 'collapse');

          table.append('thead')
               .append('tr')
               .appendMany(columns, 'th')
               .attr('class', ƒ('cl'))
               .text( ƒ('head') )
               .style({
                 'color': '#999999',
                 'font-size': '12px',
                 'font-family': '"Helvetica Neue LT W01_55 Roman", "Ariel", sans-serif'
               });

          var tr = table.append('tbody')
                        .appendMany(rankingData, 'tr')
                        .appendMany(td_data, 'td')
                        .html( ƒ('html') )
                        .attr('class', ƒ('cl'))
                        .style({ 
                          'font-size': function(d) {
                            return $(window).innerWidth() < 768 || isMobile ? '12px' : '20px';
                          } 
                        });

          var fixedHead = div.append('table#header-fixed')
                             .style({
                               'position': 'fixed',
                               'display': 'none',
                               // 'top': '529px',
                               'top': '465px',
                               'border-collapse': 'collapse',
                               'background-color': '#262626',
                               'width': '68.5%',
                               'z-index': '5'
                             });

          var tableOffset = ( $('#main-table').offset().top / 100),
              $header = $('#main-table > thead').clone(),
              $fixedHeader = $('#header-fixed').append($header),
              bodyOffset = 0;

          $('body').scroll(function() {
            bodyOffset = $('body').scrollTop();
            // $fixedHeader.css('top', 529 - bodyOffset + 'px');
            $fixedHeader.css('top', 465 - bodyOffset + 'px');
          });

          $('.scrollable').scroll(function() {
            var offset = $(this).scrollTop();
            
            if (offset >= tableOffset && $fixedHeader.is(':hidden')) {
              $fixedHeader.show();
            } else if (offset < tableOffset) {
              $fixedHeader.hide();
            }
          });

          d3.selectAll('#header-fixed > thead > tr > th')
            .style('padding', '0.5rem 0');

          function td_data(row, i) {
            return columns.map(function(c) {
              var cell = {};

              d3.keys(c).forEach(function(k) {
                if (typeof c[k] == 'function') {
                  cell[k] = c[k](row, i);
                } else {
                  // Set colors, add opporators and percent signs
                  if (c.cl.includes('pc')) {
                    if (row.change > 0) {
                      row.change_fmt = '+' + row.change + '%';
                      c.cl = 'pc-chart neondemon';
                    } else if (row.change < 0) {
                      row.change_fmt = '&#8211;' + Math.abs(row.change) + '%';
                      c.cl = 'pc-chart sangria';
                    } else if (row.change == 0) {
                      row.change_fmt = Math.floor(row.change) + '%';
                      c.cl = 'pc-chart white';
                    }
                  } else {
                    c.cl = 'white';
                  }

                  cell[k] = c[k];
                }
              });

              return cell;
            });
          }

          var pcWidth = $('.pc-chart').innerWidth() / 1.75,
              pcHeight = $('.pc-chart').innerHeight() / 1.2;

          var pcXScale = d3.time.scale()
                           .domain( d3.extent(allDates) )
                           .range( [0, pcWidth] ),
              pcYScale = d3.scale.linear()
                           .domain( [0, d3.max(catData, function(d) { return d[$timeScale]; })] )
                           .range( [(pcHeight - 10), 0] );

          var pcPath = d3.svg.line()
                         .x(function(d) {
                           return pcXScale( d3.time.format('%Y-%m-%d').parse(d.fact_date) );
                         })
                         .y(function(d) { return pcYScale(d[$timeScale]); })
                         .interpolate('basic');

          pcSvg = d3.selectAll('.pc-chart')
                    .append('svg.center-a--abs.ml3.pr3')
                    .attr({
                      width: pcWidth,
                      height: pcHeight
                    });

          pcSvg[0].forEach(function(d, i) {
            d3.select(d)
              .append('path')
              .datum(rankingData[i].data)
              .attr({ 'd': function(e) { return pcPath(e); } })
              .style({
                'stroke-width': '1px',
                'fill': 'none',
                'stroke': function(e) {
                  if (rankingData[i].change > 0) {
                    return '#17D455';
                  } else if (rankingData[i].change < 0) {
                    return '#E62A02';
                  } else {
                    return '#FFFFFF';
                  }
                }
              });
          });

          d3.select(window).on('resize', resizeRanking);

          function resizeRanking() {
            var newPcWidth = $('.pc-chart').innerWidth() / 1.75,
                newPcHeight = $('.pc-chart').innerHeight() / 1.2;

            pcXScale.range([0, newPcWidth]);
            pcYScale.range([(newPcHeight-  10), 0]);

            pcSvg.attr({
                   width: newPcWidth,
                   height: newPcHeight
                 });

            d3.selectAll('.rank-line')
              .attr({ 'd': function(e) { return pcPath(e); } });
          }
        }

        /* ========== UPDATE GRAPH LINES TO NEW TIMESCALE ========== */
        function updateTimescale() {
          var lineDataByBrand = captureLineData();

          d3.selectAll('.line')
            .transition()
            .duration(1000)
            .attr({ 'd': function(d) { return path(d); } });
        }

        /* ========== UPDATE LEGEND ITEMS ========== */
        function updateLegend() {
          d3.selectAll('.legend div, .legend h6')
            .remove();
        }
      }

      /* ========== BUILD DATA OBJECT FROM ALL VISIBLE GRAPH LINES ========== */
      function captureLineData() {
        // Get all lines

        lines = document.getElementsByClassName('line');

        var lineData = [];

        // Get each line's data
        for (i = 0; i < lines.length; i++) {
          lineData.push(lines[i].__data__);
        }

        // Combine into a single object
        lineData = [].concat.apply([], lineData);

        // Group data by brand
        lineDataByBrand = d3.nest()
                            .key( ƒ('brand') )
                            .entries(lineData);

        return lineDataByBrand;
      }
    }

    $('body').on(myEvent, '.l2-close', function(e) {
      var brand = $(this).parent().parent().attr('data-brand');

      d3.select('.line[data-brand="' + brand + '"]')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();

      d3.select('.legend__item[data-brand="' + brand + '"]')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();


      d3.select('.mouse-per-line[data-brand="' + brand + '"]')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();

      if ( $('.brand__item').length <= 1 ) {
        d3.selectAll('.line:not([data-brand="' + brand + '"])')
          .transition()
          .duration(300)
          .style('opacity', 1);

        d3.select('.brand-legend')
          .classed('hide', true);
      }
    });

    $('body').on(myEvent, '.clear-all', function(e) {
      d3.selectAll('.line[data-klass="brand"]')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();

      d3.selectAll('.legend__item[data-klass="brand"]')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();

      d3.selectAll('.line:not([data-klass="brand"])')
            .transition()
            .duration(300)
            .style('opacity', 1);

      d3.select('.brand-legend')
        .classed('hide', true); 

      var brands = [];

      $('.brand__item').each(function(e, f) {
        brands.push( $(f).data('brand') );
      });

      brands.forEach(function(d) {
        d3.select('.mouse-per-line[data-brand="' + d + '"]')
          .transition()
          .duration(500)
          .style('opacity', 0)
          .remove();
      });
    });

    /* ========== UPDATE TOOLTIP ========== */
    function updateTooltip() {
      d3.selectAll('.mouse-per-line')
        .remove();
    }
  }
    
  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});