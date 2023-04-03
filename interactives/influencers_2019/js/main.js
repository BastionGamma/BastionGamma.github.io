var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent))
    window.myEvent = isMobile ? 'touchstart' : 'click';

    if (!window.isMobile) {
      $('.mobile').remove();
      $('.desktop').show();
    } else {
      $('.mobile').show();
      $('.desktop').remove();
    }

    var xVal = 50;

    var margin = {top: 50, right: 0, bottom: 50, left: 0},
        width = $('.graph__container').width(),
        height = $('.graph__container').height(),
        containerSize = width > height ? height : width,
        modifier = !window.isMobile ? (width / 3.5) : (containerSize / 6),
        size = (containerSize - margin.top - margin.bottom) - modifier;

    // var margin = {top: 50, right: 0, bottom: 50, left: 0},
    //     containerSize = $('.graph__container').height(),
    //     width = $('.graph__container').width(),
    //     modifier = !window.isMobile ? (width / 2) : (containerSize / 3),
    //     size = (containerSize - margin.top - margin.bottom) - modifier;

    var xScale = d3.scaleLog()
                   .range( [0, size] ),
        yScale = d3.scaleLinear()
                   .range( [size, 0] ),
        rScale = d3.scaleOrdinal()
                   .domain(['Advocate', 'Micro', 'Small', 'Medium', 'Large', 'Mega', 'Celebrity']),
        cScale = d3.scaleOrdinal()
                   .range( ['#009AD7', '#FF540A', '#FEC10D', '#E81159', 
                            '#AF0D43', '#006480', '#29A385', '#002856'] );

    if (!window.isMobile) {
      rScale.range( [8, 12, 16, 20, 24, 28, 32] );
    } else {
      rScale.range( [6, 8, 10, 12, 14, 16, 18] );
    }

    var xAxis = d3.axisBottom(xScale)
                  .tickSize( -size ),
        x2Axis = d3.axisBottom(xScale)
                   .tickSize( -size )
                   .tickValues( [100, 1000, 10000, 100000] )
                   .tickFormat(d3.format(',')),
        yAxis = d3.axisLeft(yScale)
                  .tickSize( -size );

    if (window.isMobile) { yAxis.ticks(5); }

    var svg = d3.select('.graph__container')
                .append('svg')
                .attrs({
                  'width': width,
                  'height': containerSize
                });

    d3.queue()
      .defer(d3.csv, 'js/data.csv')
      .defer(d3.csv, 'js/cohorts.csv')
      .await(ready);

    function ready(err, data, coData) {
      if (err) throw 'error loading data';

      data.forEach(function(d) {
        d.absolute_engagement = +d.absolute_engagement;
        d.relative_engagement = +d.relative_engagement;
        d.log10_interactions = +d.log10_interactions;
        d.log10_engagement = +d.log10_engagement;
        d.sector_rank_interaction = +d.sector_rank_interaction;
        d.sector_rank_engagement = +d.sector_rank_engagement;
        d.overall_rank_interaction = +d.overall_rank_interaction;
        d.overall_rank_engagement = +d.overall_rank_engagement;
      });

      coData.forEach(function(d) {
        d.overall_interaction_rate = +d.overall_interaction_rate;
        d.overall_engagement_rate = +d.overall_engagement_rate;
      });

      // Draw Sector Dropdown

      let allSectors = d3.set( data.map( d => d.sector ) ).values();

      allSectors = allSectors.sort( (a, b) => d3.ascending(a, b));

      let sectorSelect = d3.select('#sector-select');

      sectorSelect.selectAll('option')
                  .data(allSectors)
                  .enter()
                  .append('option')
                  .text( d3.f() )
                  .attr( 'value', d3.f() );

      sectorSelect.insert('option', ':first-child')
                  .attr('value', 'all')
                  .text('All Sectors'); 

      sectorSelect.insert('option', ':first-child')
                  .attr('disabled', true)
                  .attr('selected', true)
                  .text('Sectors'); 

      sectorSelect.on('change', function(d) {
                    let sector = d3.select(this).property('value');

                    update(sector, 'sector'); 

                    $('#cohort-select').val( $('#cohort-select option:first-child').val() )
                                       .trigger('chosen:updated');
                  });

      // Draw Chart

      svg.append('g.target')
         .translate([(width / 2), 20])
         .append('text')
         .text('More Successful')
         .styles({
           'text-anchor': 'middle',
           'fill': '#666666',
           'font-size': !window.isMobile ? '16px' : '12px'
         });

      var graphic = svg.append('g.graphic');

      xScale.domain( [100, d3.max(data, d => d.absolute_engagement)] );
      yScale.domain( [0, d3.max(data, d => d.relative_engagement)] );

      var allColors = d3.set( data.map( d3.f('sector') ) ).values(); 
      cScale.domain(allColors);

      graphic.append('g.x.axis')
             .translate( [0, size] )
             .call(xAxis);

      graphic.select('.x.axis')
             .selectAll('.tick text')
             .style('display', 'none');

      graphic.append('g.x2.axis')
             .translate( [0, size] )
             .call(x2Axis);

      graphic.select('.x2.axis')
             .selectAll('.tick text')
             .attr('transform', 'translate(6, 5) rotate(45)')
             .style('text-anchor', 'start');

      graphic.append('text.x.label')             
             .translate( function(d) {
               return !window.isMobile ? [(size / 2), (size + 75)] : [(size / 2), (size + 60)];
             })
             .style('text-anchor', 'middle')
             .text('Absolute Engagement');

      graphic.append('g.y.axis')
             .call(yAxis);

      graphic.select('.y.axis')
             .selectAll('.tick text')
             .attr('transform', 'translate(-6, 4) rotate(45)')
             .style('text-anchor', 'end');

      graphic.append('text.y.label')
             .attrs({
               'transform': 'rotate(90)',
               'y': function(d) {
                 return !window.isMobile ? 60 : 45;
               },
               'x': (size / 2),
               'dy': '1em'
             })
             .style('text-anchor', 'middle')
             .text('Relative Engagement*');

      var circles = graphic.appendMany('circle.circle', data)
                           .attrs({
                             'cx': d => xScale( d.absolute_engagement ),
                             'cy': d => yScale( d.relative_engagement ),
                             'r': 0,
                             'fill' : d => cScale( d.sector ),
                             'data-circle': d => d.influencer_category
                           })
                           .styles({
                             'stroke': 'white',
                             'stroke-width': 0,
                             'opacity': 0
                           });

      circles.transition()
             .duration(1000)
             .delay(function(d, i) { return i * 10; })
             .attr('r', d => rScale( d.influencer_category ))
             .styles({
               'stroke-width': 2,
               'opacity': 0.8
             });

      circles.call( d3.attachTooltip )
             .on('mouseover', function(d) {
               var cat = d.influencer_category,
                   catCap = cat.charAt(0).toUpperCase() + cat.slice(1);

               d3.select('.tooltip')
                 .html(`<h5>${ catCap } Influencer</h5>
                        <h6 class="mb3" style="color: ${ cScale( d.sector ) }">${ d.sector } Average</h6>
                        <h6>Engagement: ${ d.log10_engagement.toFixed(2) }</h6>
                        <h6>Interactions: ${ d.log10_interactions.toFixed(2) }</h6>`);
             });

      if (!window.isMobile) {
        graphic.attr('transform', `translate(${ (width / 2) }, ${ modifier }) rotate(-45, 0, ${ size })`);
      } else {
        graphic.attr('transform', `translate(${ (width / 2) }, ${ (height / 4) }) rotate(-45, 0, ${ size })`);
      }

      // Draw Legend

      var dataBySec = d3.nest()
                        .key(d => d.sector)
                        .map(data);

      var legendData = [{ 'name': 'Advocate', 'range': '0-5K' },
                        { 'name': 'Micro', 'range': '5-25K '},
                        { 'name': 'Large', 'range': '250K-1M' },
                        { 'name': 'Mega', 'range': '1-7M' },
                        { 'name': 'Celebrity', 'range': '7M+' },
                        { 'name': 'Small', 'range': '25-100K' },
                        { 'name': 'Medium', 'range': '100-250K' }];

      legendData.forEach(function(d) {
        d.avg_interaction = coData.filter( e => e.cohort === d.name )[0].overall_interaction_rate;
        d.avg_engagement = coData.filter( e => e.cohort === d.name )[0].overall_engagement_rate;
        d.avg = (d.avg_interaction + d.avg_engagement) / 2;
      });

      var ldSorted = legendData.sort(function(a, b) {
                       return d3.descending(a.avg, b.avg);
                     });

      var legend = d3.select('.legend');

      legend.appendMany('div.legend-item.pv3.bb.b-grey40.h4', ldSorted)
            .attr('data-circle', d => d.name)
            .html(function(d, i) {
              return `<div class="flex / h100">
                        <h5 class="center-v--abs left0 / ml1">${ i + 1 }</h5> 
                        
                        <div class="ml5 w3 h100">
                          <img src="img/${ d.name }.svg" class="center-a--abs / tac">
                        </div>

                        <div class="center-v--abs right0 / w4 mr2-l">
                          <h5>${ d.name }</h5> 
                          <h6>${ d.range }</h6>
                        </div>
                      </div>`;
            })
            .style('max-width', function(d) {
              return !window.isMobile ? '200px' : '100%'; 
            })
            .on('mouseover', function(d) {
              var value = d3.select(this).attr('data-circle');

              d3.select(this)
                .transition()
                .duration(250)
                .style('background-color', '#F1F1F1');

              d3.selectAll(`.circle:not([data-circle=${ value }])`)
                .transition()
                .duration(150)
                .style('opacity', 0.1);
            })
            .on('mouseout', function(d) {
              d3.select(this)
                .transition()
                .duration(250)
                .style('background-color', '#FFFFFF');

              d3.selectAll('.circle')
                .transition()
                .duration(250)
                .style('opacity', 0.8);
            });

      // Draw Cohort Dropdown

      let cohortSelect = d3.select('#cohort-select');

      cohortSelect.selectAll('option')
                  .data(ldSorted)
                  .enter()
                  .append('option')
                  .text( d => d.name )
                  .attr( 'value', d => d.name );

      cohortSelect.insert('option', ':first-child')
                  .attr('value', 'all')
                  .text('All Cohorts'); 

      cohortSelect.insert('option', ':first-child')
                  .attr('disabled', true)
                  .attr('selected', true)
                  .text('Cohorts'); 

      cohortSelect.on('change', function(d) {
                    let cohort = d3.select(this).property('value');

                    update(cohort, 'cohort'); 

                    $('#sector-select').val( $('#sector-select option:first-child').val() )
                                       .trigger('chosen:updated');
                  });

      function update(value, type) {
        if (type === 'sector') {
          var valData = value === 'all' ? data : dataBySec[`$${ value }`];

          legendData.forEach(function(d, i) {
            let subset = valData.filter( e => e.influencer_category === d.name )[0];

            if (subset) {
              d.avg_interaction = subset.sector_rank_interaction;
              d.avg_engagement = subset.sector_rank_engagement;
              d.avg = (d.avg_interaction + d.avg_engagement) / 2;
            } else {
              d.avg_interaction = null;
              d.avg_engagement = null;
              d.avg = null;
            }
          });
        } else {
          var valData = value === 'all' ? data : data.filter( d => d.influencer_category === value );

          legendData.forEach(function(d) {
            d.avg_interaction = coData.filter( e => e.cohort === d.name )[0].overall_interaction_rate;
            d.avg_engagement = coData.filter( e => e.cohort === d.name )[0].overall_engagement_rate;
            d.avg = (d.avg_interaction + d.avg_engagement) / 2;
          });
        }

        var circles = graphic.selectAll('circle.circle')
                             .data(valData);

        circles.enter()
               .append('circle.circle')
               .merge(circles)
               .transition()
               .duration(1000)
               .delay(function(d, i) { return i * 10; })
               .attrs({
                 'cx': d => xScale( d.absolute_engagement ),
                 'cy': d => yScale( d.relative_engagement ),
                 'r': d => rScale( d.influencer_category ),
                 'fill' : d => cScale( d.sector ),
                 'data-circle': d => d.influencer_category
               })
               .styles({
                 'stroke': 'white',
                 'stroke-width': 2,
                 'opacity': 0.8
               })

        circles.exit()
               .transition()
               .duration(1000)
               .delay(function(d, i) { return i * 10; })
               .style('opacity', 0)
               .remove();


        graphic.selectAll('circle.circle')
               .call( d3.attachTooltip )
               .on('mouseover', function(d) {
                 var cat = d.influencer_category,
                     catCap = cat.charAt(0).toUpperCase() + cat.slice(1);

                 d3.select('.tooltip')
                   .html(`<h5>${ catCap } Influencer</h5>
                          <h6 class="mb3" style="color: ${ cScale( d.sector ) }">${ d.sector } Average</h6>
                          <h6>Engagement: ${ d.log10_engagement.toFixed(2) }</h6>
                          <h6>Interactions: ${ d.log10_interactions.toFixed(2) }</h6>`);
               });

        updateLegend(xVal);        
      }

      function updateChart(xVal) {
        var trScale = d3.scaleLinear()
                        .domain( [0, 100] )
                        .range( [-90, 0] );

        var graphic = d3.select('.graphic');

        if (xVal > 50) {
          let tsScale = d3.scaleLinear()
                          .domain( [51, 100] )
                          .range( [size, 0] ),
              tkScale = d3.scaleLinear()
                          .domain( [51, 100] )
                          .range( [4, 1] )
                          .nice();

          newSize = tsScale(xVal);

          xScale.range( [0, newSize] );

          switch ( Math.ceil( tkScale(xVal) ) ) {
            case 1:
              x2Axis.tickValues( [100] );
              break;
            case 2:
              x2Axis.tickValues( [100, 100000] );
              break;
            case 3:
              x2Axis.tickValues( [100, 5000, 100000] );
              break;
            default:
              x2Axis.tickValues( [100, 1000, 10000, 100000] );
          }

          yAxis.tickSize( -newSize );

          d3.select('g.x.axis')
            .call(xAxis);

          d3.select('g.x2.axis')
            .call(x2Axis);

          d3.select('g.y.axis')
            .call(yAxis);

          graphic.select('text.x.label')             
                 .translate( function(d) {
                   return !window.isMobile ? [(newSize / 2), (size + 75)] : [(newSize / 2), (size + 60)];
                 });

          d3.selectAll('circle.circle')
            .attrs({
              'cx': d => xScale( d.absolute_engagement ),
              'cy': d => yScale( d.relative_engagement )
            });
        } else {
          let tsScale = d3.scaleLinear()
                          .domain( [0, 50] )
                          .range( [0, size] ),
              tkScale = d3.scaleLinear()
                          .domain( [0, 50] )
              tlScale = d3.scaleLinear()
                          .domain( [0, 50] )
                          .range( [size, (size / 2)] );

          if ( !window.isMobile) { 
            tkScale.range( [1, 11] );
          } else {
            tkScale.range( [1, 5] );
          }

          newSize = tsScale(xVal);

          yScale.range( [0, -newSize] );

          xAxis.tickSize( -newSize );
          x2Axis.tickSize( -newSize );
          yAxis.ticks( tkScale(xVal) );

          d3.select('g.x.axis')
            .call(xAxis);

          d3.select('g.x2.axis')
            .call(x2Axis);

          d3.select('g.y.axis')
            .translate([0, size])
            .call(yAxis); 

          graphic.select('text.y.label')
                 .attrs({ 'x': tlScale(xVal) });

          d3.selectAll('circle.circle')
            .attrs({
              'cx': d => xScale( d.absolute_engagement ),
              'cy': d => yScale( d.relative_engagement )
            })
            .translate([0, size]);
        }

        if (!window.isMobile) {
          graphic.attr('transform', `translate(${ (width / 2) }, ${ modifier }) rotate(${ trScale(xVal) }, 0, ${ size })`);
        } else {
          graphic.attr('transform', `translate(${ (width / 2) }, ${ (height / 6) }) rotate(${ trScale(xVal) }, 0, ${ size })`);
        }

        graphic.select('.x.axis')
               .selectAll('.tick text')
               .style('display', 'none');

        graphic.select('.x2.axis')
               .selectAll('.tick text')
               .attr('transform', `translate(6, 5) rotate(45)`)
               .style('text-anchor', 'start');
        
        graphic.select('.y.axis')
               .selectAll('.tick text')
               .attr('transform', `translate(-6, 4) rotate(45)`)
               .style('text-anchor', 'end');

        updateLegend(xVal);
      }

      function updateLegend(xVal) {
        var legend = d3.select('.legend');

        if (xVal > 50) {
          var ldSorted = legendData.sort(function(a, b){
                           return d3.descending(a.avg_engagement, b.avg_engagement);
                         });
        } else if (xVal < 50) {
          var ldSorted = legendData.sort(function(a, b){
                           return d3.descending(a.avg_interaction, b.avg_interaction);
                         });
        } else {
          var ldSorted = legendData.sort(function(a, b){
                           return d3.descending(a.avg, b.avg);
                         }); 
        }

        var legendItems = legend.selectAll('div.legend-item')
                                .data(ldSorted);

        legendItems.enter()
                   .append('div.legend-item.pv3.bb.b-grey40.h4')
                   .merge(legendItems)
                   .transition()
                   .style('opacity', 0)
                   .each(function(d, i) {
                     d3.select(this)
                       .attr('data-circle', d => d.name)
                       .html(function(e) {
                         return `<div class="flex / h100">
                                   <h5 class="center-v--abs left0 / ml1">${ i + 1 }</h5> 
                                  
                                   <div class="ml5 w3 h100">
                                     <img src="img/${ e.name }.svg" class="center-a--abs / tac">
                                   </div>

                                   <div class="center-v--abs right0 / w4 mr2">
                                     <h5>${ e.name }</h5> 
                                     <h6>${ e.range }</h6>
                                   </div>
                                 </div>`;
                       })
                       .transition()
                       .duration(1000)
                       .delay(function(d, i) { return i * 10; })
                       .style('opacity', 1);
                   });

        legendItems.exit()
                   .transition()
                   .duration(1000)
                   .delay(function(d, i) { return i * 10; })
                   .style('opacity', 0)
                   .remove();

         // Draw Cohort Dropdown

        let cohortSelect = d3.select('#cohort-select');

        cohortSelect.selectAll('option')
                    .remove();

        cohortSelect.selectAll('option')
                    .data(ldSorted)
                    .enter()
                    .append('option')
                    .text( d => d.name )
                    .attr( 'value', d => d.name );

        cohortSelect.insert('option', ':first-child')
                    .attr('value', 'all')
                    .text('All Cohorts'); 

        cohortSelect.insert('option', ':first-child')
                    .attr('disabled', true)
                    .attr('selected', true)
                    .text('Cohorts'); 

        cohortSelect.on('change', function(d) {
                      let cohort = d3.select(this).property('value');

                      update(cohort, 'cohort'); 

                      $('#sector-select').val( $('#sector-select option:first-child').val() )
                                         .trigger('chosen:updated');
                    });
      }

      function drawSlider() {
        d3.select('#slider-container svg').remove(); 

        xVal = 50;

        var width = $('#slider-container').width(),
            height = 62,
            radius = 16,
            margin = 16;

        var x1 = margin,
            x2 = width - margin,
            y = height / 2;

        var color = '#D8D8D8';

        var xScale = d3.scaleLinear()
                       .domain([0, width]);

        if (window.innerWidth > 1440 ) {
          xScale.range( [-3, 103] );
        } else {
          xScale.range( [-5, 105] );
        }

        var drag = d3.drag()
                     .on('drag', dragmove);

        var svg = d3.select('#slider-container')
                    .append('svg')
                    .attrs({
                      'class': 'slider',
                      'width': width,
                      'height': height
                    })
                    .datum({
                      x: width / 2,
                      y: height / 2
                    });

        var line = svg.append('line')
                      .attrs({
                        'x1': x1,
                        'x2': x2,
                        'y1': y,
                        'y2': y,
                        'class': 'slider-line'
                      })
                      .styles({
                        'stroke': '#D8D8D8',
                        'stroke-linecap': 'round',
                        'stroke-width': 12
                      });

        var circle = svg.append('circle.slider-circle')
                        .attrs({
                          'r': radius,
                          'cy': d => d.y,
                          'cx': d => d.x,
                          'fill': '#E81159'
                        })
                        .style('cursor', 'pointer')
                        .call(drag);

        var arrow = svg.append('svg:image')
                       .attrs({
                         'x': d => d.x - 7,
                         'y': d => d.y - 6,
                         'xlink:href': () => {
                           return 'https://www.l2inc.com/wp-content/uploads/2019/06/slide-arrow.png';
                         },
                         'width': 15,
                         'height': 11,
                         'class': 'slider-img'
                       })
                       .style('cursor', 'pointer')
                       .call(drag);

        function dragmove(d) {
          // Get the updated X location computed by the drag behavior.
          let x = d3.event.x;

          // Constrain x to be between x1 and x2 (the ends of the line).
          x = x < x1 ? x1 : x > x2 ? x2 : x;

          // This assignment is necessary for multiple drag gestures.
          // It makes the drag.origin function yield the correct value.
          d.x = x;

          // Update the circle location.
          circle.attr('cx', x);
          arrow.attr('x', x - 7);

          let val = Math.round(xScale(x));

          xVal = val;

          updateChart(xVal);
        }
      }

      drawSlider();
    }

    // d3.select(window).on('resize', resize);

    // function resize() {
    //   var margin = {top: 50, right: 0, bottom: 50, left: 0},
    //       newWidth = $('.graph__container').width(),
    //       newHeight = $('.graph__container').height(),
    //       newContainerSize = newWidth > newHeight ? newHeight : newWidth,
    //       modifier = !window.isMobile ? (newWidth / 4) : (newContainerSize / 6),
    //       newSize = (newContainerSize - margin.top - margin.bottom) - modifier;

    //   xScale.range( [0, newSize] );
    //   yScale.range( [newSize, 0] );

    //   xAxis.tickSize( -newSize );
    //   x2Axis.tickSize( -newSize );
    //   yAxis.tickSize( -newSize );

    //   d3.select('svg')
    //     .attrs({
    //       'width': newWidth,
    //       'height': newContainerSize
    //     });

    //   d3.select('g.target')
    //      .translate( [(newWidth / 2), 20] );

    //   d3.select('g.x.axis')
    //     .translate( [0, newSize] )
    //     .call(xAxis);

    //   d3.select('g.x2.axis')
    //     .translate( [0, newSize] )
    //     .call(x2Axis);

    //   d3.select('text.x.label')             
    //     .translate( function(d) {
    //       return !window.isMobile ? [(newSize / 2), (newSize + 75)] : [(newSize / 2), (newSize + 60)];
    //     });

    //   d3.select('g.y.axis')
    //     .call(yAxis);

    //   d3.select('text.y.label')
    //     .attrs({ 'x': (newSize / 2) });

    //   d3.selectAll('circle.circle')
    //     .attrs({
    //       'cx': d => xScale( d.absolute_engagement ),
    //       'cy': d => yScale( d.relative_engagement )
    //     });

    //   d3.select('.graphic')
    //     .attr('transform', `translate(${ (newWidth / 2) }, ${ (newHeight / 4) }) rotate(-45, 0, ${ newSize })`);

    //   var sliderWidth = $('#slider-container').width(),
    //       margin = 16,
    //       height = 62;

    //   var newX1 = margin,
    //       newX2 = sliderWidth - margin;

    //   d3.select('#slider-container svg')
    //     .attr('width', sliderWidth)
    //     .datum({
    //       x: sliderWidth / 2,
    //       y: height / 2
    //     });

    //   d3.select('.slider-line')
    //     .attr('x2', newX2);

    //   d3.select('circle.slider-circle')
    //     .attrs({
    //       'cy': d => d.y,
    //       'cx': d => d.x
    //     });

    //   d3.select('.slider-img')
    //     .attrs({
    //       'x': d => d.x - 7,
    //       'y': d => d.y - 6
    //     });
    // }
  }
  
  return { init : init }
})();

$(document).ready(function() { 
  l2Utils.init(); 
});