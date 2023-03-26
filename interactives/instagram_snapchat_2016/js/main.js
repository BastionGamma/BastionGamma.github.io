//*~*~*~~**~*~*~*
// L2 Inc. Utils
//*~*~*~*~*~*~*~*
var l2Utils = (function () {
  window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
  window.myEvent = isMobile ? 'touchstart' : 'click';

  function init(options){
    var defaults = {};
    options = $.extend(defaults, options);

    function wrap(text, width) {
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
            dy = 0,
            tspan = text.text(null)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', y)
                        .attr('dy', dy + 'em');

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));

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

    function drawDemoGraph() {
      d3.select('.demographics__graph svg')
        .remove();

      var margin = {top: 0, right: 275, bottom: 40, left: 275};

      var containerWidth = $('.demographics__graph').width(),
          containerHeight = $('.demographics__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', ages : '13–17', val : 21 },
        {platform : 'instagram', ages : '18–24', val : 20 },
        {platform : 'instagram', ages : '25–34', val : 26 },
        {platform : 'instagram', ages : '35–54', val : 24 },
        {platform : 'instagram', ages : '55+', val : 9 },
        {platform : 'snapchat', ages : '13–17', val : 23 },
        {platform : 'snapchat', ages : '18–24', val : 37 },
        {platform : 'snapchat', ages : '25–34', val : 26 },
        {platform : 'snapchat', ages : '35–54', val : 12 },
        {platform : 'snapchat', ages : '55+', val : 2 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allAges = d3.set( data.map( function(d) { return d.ages; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allAges )
                     .rangeBands( [0, height], 0.2 ),
          xScale = d3.scale
                     .linear()
                     .domain( [-d3.max(data, function(d) { return d.val; } ), d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.demographics__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + ( (width / 2) + yScale.rangeBand() / 200 ) + ' , 0)'
                          })
                          .call(yAxis)
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'x' : function(d) {
                            if ( d.platform == 'instagram' ) {
                              return xScale(0) - yScale.rangeBand();
                            } else {
                              return xScale(0) + yScale.rangeBand();
                            }
                          },
                          'y' : function(d) {
                            return yScale(d.ages);
                          },
                          'height' : yScale.rangeBand(),
                          'width' : function(d) {
                             return 0;          
                          }
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            if ( d.platform == 'instagram' ) {
              return Math.abs( xScale(-d.val) - xScale(0) ); 
            } else {
              return Math.abs( xScale(d.val) - xScale(0) ); 
            }
          },
          'x' : function(d) {
            if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - yScale.rangeBand();
            } else {
              return xScale(0) + yScale.rangeBand();
            }
          }
         });

      var label = barGroup.append('text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : function(d) {
                              return xScale(0); 
                            },
                            'y' : function(d) {
                              return yScale(d.ages) + yScale.rangeBand() / 2;
                            },
                            'dx' : function(d) {
                              if (d.platform === 'instagram') {
                                return -yScale.rangeBand() - (this.getBBox().width * 2);
                              } else {
                                return yScale.rangeBand() + (this.getBBox().width * 2);
                              }
                            },
                            'dy' : function() {
                              return (this.getBBox().height / 2);
                            },
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr('x', function(d) { 
             if ( d.platform == 'instagram' ) {
              return xScale(-d.val);
            } else {
              return xScale(d.val);
            }
           })
           .style('opacity', 1);
    } 

    function drawDemoMobile() {
      d3.select('.demographics__graph svg')
        .remove();

      if ( $('body').innerWidth() < 768 ) {
        var margin = {top: 0, right: 80, bottom: 0, left: 50};
      } else {
        var margin = {top: 0, right: 140, bottom: 0, left: 60};
      }

      var containerWidth = $('.demographics__graph').width(),
          containerHeight = $('.demographics__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', ages : '13-17', val : 21 },
        {platform : 'instagram', ages : '18-24', val : 20 },
        {platform : 'instagram', ages : '25-34', val : 26 },
        {platform : 'instagram', ages : '35-54', val : 24 },
        {platform : 'instagram', ages : '55+', val : 9 },
        {platform : 'snapchat', ages : '13-17', val : 23 },
        {platform : 'snapchat', ages : '18-24', val : 37 },
        {platform : 'snapchat', ages : '25-34', val : 26 },
        {platform : 'snapchat', ages : '35-54', val : 12 },
        {platform : 'snapchat', ages : '55+', val : 2 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allAges = d3.set( data.map( function(d) { return d.ages; } ) ).values();
      
      var yScale = d3.scale
                     .ordinal()
                     .domain( allAges )
                     .rangeBands( [0, height], 0.6 ),
          xScale = d3.scale
                     .linear()
                     .domain( [0, d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.demographics__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + xScale(0) + ' , 0)'
                          })
                          .call(yAxis)
                          .style('opacity', 0);

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr({
                          'class' : 'bar-group',
                          'transform' : function(d) {
                            var x = $('body').innerWidth() < 768 ? 30 : 50;

                            if (d.platform == 'instagram') {
                              return 'translate(' + x + ', ' + ( yScale(d.ages) - yScale.rangeBand() / 2 ) + ')';
                            } else {
                              return 'translate(' + x + ', ' + ( yScale(d.ages) + yScale.rangeBand() / 2 ) + ')';
                            }
                          }
                        });

      var bar = barGroup.append('rect')
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'height' : yScale.rangeBand(),
                          'width' : 0          
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            return xScale(d.val) - xScale(0); 
          }
         });

      var x = $('body').innerWidth() < 768 ? 20 : 30,
          f = $('body').innerWidth() <= 320 ? 1.2 : 1.4;

      var label = barGroup.append('svg:text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : xScale(0),
                            'y' : function(d) {
                              return yScale(d.val) + yScale.rangeBand() / 2;
                            },
                            'dx' : x,
                            'dy' : f + 'em',
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr({
            'x' : function(d) {
              return xScale(d.val);
            }
           })
           .style('opacity', 1); 
    }

    function drawAdoptionGraph() {
      d3.select('.adoption__graph svg')
        .remove();

      var margin = {top: 0, right: 450, bottom: 40, left: 450};

      var containerWidth = $('.adoption__graph').width(),
          containerHeight = $('.adoption__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 92 },
        {platform : 'instagram', sector : 'Auto', val : 100 },
        {platform : 'instagram', sector : 'Beauty', val : 96 },
        {platform : 'instagram', sector : 'Beverages', val : 89 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 78 },
        {platform : 'instagram', sector : 'Fashion', val : 98 },
        {platform : 'instagram', sector : 'Hospitality', val : 95 },
        {platform : 'instagram', sector : 'Retail', val : 92 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 96 },
        {platform : 'snapchat', sector : 'Activewear', val : 71 },
        {platform : 'snapchat', sector : 'Auto', val : 25 },
        {platform : 'snapchat', sector : 'Beauty', val : 57 },
        {platform : 'snapchat', sector : 'Beverages', val : 33 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 38 },
        {platform : 'snapchat', sector : 'Fashion', val : 54 },
        {platform : 'snapchat', sector : 'Hospitality', val : 13 },
        {platform : 'snapchat', sector : 'Retail', val : 47 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 25 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.25 ),
          xScale = d3.scale
                     .linear()
                     .domain( [-d3.max(data, function(d) { return d.val; } ), d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.adoption__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + ( (width / 2) + yScale.rangeBand() / 200 ) + ' , 0)'
                          })
                          .call(yAxis)
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'x' : function(d) {
                            if ( d.platform == 'instagram' ) {
                              return xScale(0) - (yScale.rangeBand() * 3);
                            } else {
                              return xScale(0) + (yScale.rangeBand() * 3);
                            }
                          },
                          'y' : function(d) {
                            return yScale(d.sector);
                          },
                          'height' : yScale.rangeBand(),
                          'width' : function(d) {
                             return 0;          
                          }
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            if ( d.platform === 'instagram' ) {
              return Math.abs( xScale(-d.val) - xScale(0) ); 
            } else {
              return Math.abs( xScale(d.val) - xScale(0) ); 
            }
          },
          'x' : function(d) {
            if ( d.platform === 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(0) + (yScale.rangeBand() * 3);
            }
          }
         });

      var label = barGroup.append('text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : function(d) {
                              if ( d.platform == 'instagram' ) {
                                return xScale(0) - (yScale.rangeBand() * 3);
                              } else {
                                return xScale(0) + (yScale.rangeBand() * 3);
                              }
                            },
                            'y' : function(d) {
                              return yScale(d.sector) + yScale.rangeBand() / 2;
                            },
                            'dx' : function(d) {
                              if (d.platform === 'instagram') {
                                return -yScale.rangeBand();
                              } else {
                                return yScale.rangeBand();
                              }
                            },
                            'dy' : function() {
                              return (this.getBBox().height / 2);
                            },
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr('x', function(d) { 
             if ( d.platform == 'instagram' ) {
                return xScale(-d.val) - (yScale.rangeBand() * 3);
              } else {
                return xScale(d.val) + (yScale.rangeBand() * 3);
              }
           })
           .style('opacity', 1);
    }

    function drawAdoptionMobile() {
      d3.select('.adoption__graph svg')
        .remove();

      if ( $('body').innerWidth() < 768 && 
           $('body').innerWidth() > 320) {
        var margin = {top: 0, right: 140, bottom: 0, left: 30};
      } else if ( $('body').innerWidth() <= 320 ) {
        var margin = {top: 0, right: 180, bottom: 0, left: 30};
      } else {
        var margin = {top: 0, right: 275, bottom: 0, left: 50}; 
      }

      var containerWidth = $('.adoption__graph').width(),
          containerHeight = $('.adoption__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 92 },
        {platform : 'instagram', sector : 'Auto', val : 100 },
        {platform : 'instagram', sector : 'Beauty', val : 96 },
        {platform : 'instagram', sector : 'Beverages', val : 89 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 78 },
        {platform : 'instagram', sector : 'Fashion', val : 98 },
        {platform : 'instagram', sector : 'Hospitality', val : 95 },
        {platform : 'instagram', sector : 'Retail', val : 92 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 96 },
        {platform : 'snapchat', sector : 'Activewear', val : 71 },
        {platform : 'snapchat', sector : 'Auto', val : 25 },
        {platform : 'snapchat', sector : 'Beauty', val : 57 },
        {platform : 'snapchat', sector : 'Beverages', val : 33 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 38 },
        {platform : 'snapchat', sector : 'Fashion', val : 54 },
        {platform : 'snapchat', sector : 'Hospitality', val : 13 },
        {platform : 'snapchat', sector : 'Retail', val : 47 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 25 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.6 ),
          xScale = d3.scale
                     .linear()
                     .domain( [0, d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.adoption__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + xScale(0) + ' , 0)'
                          })
                          .call(yAxis)
                          .style('opacity', 0);

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'start')

      if ( $('body').innerWidth() < 600 && 
           $('body').innerWidth() > 320) {
        var d = 3;  
      } else if ( $('body').innerWidth() <= 320 ) {
        var d = 0.1;
      } else {
        var d = 5;
      }
        
      yAxisGroup.selectAll('text')
                .call(wrap, (width / d) );

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr({
                          'class' : 'bar-group',
                          'transform' : function(d) {
                            if ( $('body').innerWidth() < 600 && 
                                 $('body').innerWidth() > 320) {
                              var x = 85;  
                            } else if ( $('body').innerWidth() <= 320 ) {
                              var x = 130;
                            } else {
                              var x = 175;
                            }

                            if (d.platform == 'instagram') {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) - yScale.rangeBand() / 2 ) + ')';
                            } else {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) + yScale.rangeBand() / 2 ) + ')';
                            }
                          }
                        });

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'height' : yScale.rangeBand(),
                          'width' : 0          
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            return xScale(d.val); 
          }
         });

      var x = $('body').innerWidth() < 768 ? 20 : 30,
          f = $('body').innerWidth() <= 320 ? 0.9 : 1;

      var label = barGroup.append('svg:text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : xScale(0),
                            'y' : function(d) {
                              return yScale(d.val) + yScale.rangeBand() / 2;
                            },
                            'dx' : x,
                            'dy' : f + 'em',
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr({
            'x' : function(d) {
              return xScale(d.val);
            }
           })
           .style('opacity', 1); 
    }

    function drawFrequencyGraph() {
      d3.select('.frequency__graph svg')
        .remove();

      var margin = {top: 0, right: 450, bottom: 40, left: 450};

      var containerWidth = $('.frequency__graph').width(),
          containerHeight = $('.frequency__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 9 },
        {platform : 'instagram', sector : 'Auto', val : 9 },
        {platform : 'instagram', sector : 'Beauty', val : 9 },
        {platform : 'instagram', sector : 'Beverages', val : 5 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 6 },
        {platform : 'instagram', sector : 'Fashion', val : 11 },
        {platform : 'instagram', sector : 'Hospitality', val : 4 },
        {platform : 'instagram', sector : 'Retail', val : 15 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 10 },
        {platform : 'snapchat', sector : 'Activewear', val : 22 },
        {platform : 'snapchat', sector : 'Auto', val : 21 },
        {platform : 'snapchat', sector : 'Beauty', val : 34 },
        {platform : 'snapchat', sector : 'Beverages', val : 30 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 39 },
        {platform : 'snapchat', sector : 'Hospitality', val : 9 },
        {platform : 'snapchat', sector : 'Fashion', val : 20 },
        {platform : 'snapchat', sector : 'Retail', val : 22 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 35 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.25 ),
          xScale = d3.scale
                     .linear()
                     .domain( [-d3.max(data, function(d) { return d.val; } ), d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.frequency__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + ( (width / 2) + yScale.rangeBand() / 200 ) + ' , 0)'
                          })
                          .call(yAxis)
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'x' : function(d) {
                            if ( d.platform == 'instagram' ) {
                              return xScale(0) - (yScale.rangeBand() * 3);
                            } else {
                              return xScale(0) + (yScale.rangeBand() * 3);
                            }
                          },
                          'y' : function(d) {
                            return yScale(d.sector);
                          },
                          'height' : yScale.rangeBand(),
                          'width' : function(d) {
                             return 0;          
                          }
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            if ( d.platform == 'instagram' ) {
              return Math.abs( xScale(-d.val) - xScale(0) ); 
            } else {
              return Math.abs( xScale(d.val) - xScale(0) ); 
            }
          },
          'x' : function(d) {
            if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(0) + (yScale.rangeBand() * 3);
            }
          }
         });

      var label = barGroup.append('text')
                          .text(function(d) { return d.val; })
                          .attr({
                            'x' : function(d) {
                              if ( d.platform == 'instagram' ) {
                                return xScale(0) - (yScale.rangeBand() * 3);
                              } else {
                                return xScale(0) + (yScale.rangeBand() * 3);
                              }
                            },
                            'y' : function(d) {
                              return yScale(d.sector) + yScale.rangeBand() / 2;
                            },
                            'dx' : function(d) {
                              if (d.platform === 'instagram') {
                                return -yScale.rangeBand();
                              } else {
                                return yScale.rangeBand();
                              }
                            },
                            'dy' : function() {
                              return (this.getBBox().height / 2);
                            },
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr('x', function(d) { 
             if ( d.platform == 'instagram' ) {
                return xScale(-d.val) - (yScale.rangeBand() * 3);
              } else {
                return xScale(d.val) + (yScale.rangeBand() * 3);
              }
           })
           .style('opacity', 1);
    }

    function drawFrequencyMobile() {
      d3.select('.frequency__graph svg')
        .remove();

      if ( $('body').innerWidth() < 768 && 
           $('body').innerWidth() > 320) {
        var margin = {top: 0, right: 140, bottom: 0, left: 30};
      } else if ( $('body').innerWidth() <= 320 ) {
        var margin = {top: 0, right: 180, bottom: 0, left: 30};
      } else {
        var margin = {top: 0, right: 275, bottom: 0, left: 50}; 
      }

      var containerWidth = $('.frequency__graph').width(),
          containerHeight = $('.frequency__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 9 },
        {platform : 'instagram', sector : 'Auto', val : 9 },
        {platform : 'instagram', sector : 'Beauty', val : 9 },
        {platform : 'instagram', sector : 'Beverages', val : 5 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 6 },
        {platform : 'instagram', sector : 'Fashion', val : 11 },
        {platform : 'instagram', sector : 'Hospitality', val : 4 },
        {platform : 'instagram', sector : 'Retail', val : 15 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 10 },
        {platform : 'snapchat', sector : 'Activewear', val : 22 },
        {platform : 'snapchat', sector : 'Auto', val : 21 },
        {platform : 'snapchat', sector : 'Beauty', val : 34 },
        {platform : 'snapchat', sector : 'Beverages', val : 30 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 39 },
        {platform : 'snapchat', sector : 'Hospitality', val : 9 },
        {platform : 'snapchat', sector : 'Fashion', val : 20 },
        {platform : 'snapchat', sector : 'Retail', val : 22 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 35 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.6 ),
          xScale = d3.scale
                     .linear()
                     .domain( [0, d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.frequency__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + xScale(0) + ' , 0)'
                          })
                          .call(yAxis)
                          .style('opacity', 0);

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'start')

      if ( $('body').innerWidth() < 600 && 
           $('body').innerWidth() > 320) {
        var d = 3;  
      } else if ( $('body').innerWidth() <= 320 ) {
        var d = 0.1;
      } else {
        var d = 5;
      }
        
      yAxisGroup.selectAll('text')
                .call(wrap, (width / d) );

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr({
                          'class' : 'bar-group',
                          'transform' : function(d) {
                            if ( $('body').innerWidth() < 600 && 
                                 $('body').innerWidth() > 320) {
                              var x = 85;  
                            } else if ( $('body').innerWidth() <= 320 ) {
                              var x = 130;
                            } else {
                              var x = 175;
                            }

                            if (d.platform == 'instagram') {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) - yScale.rangeBand() / 2 ) + ')';
                            } else {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) + yScale.rangeBand() / 2 ) + ')';
                            }
                          }
                        });

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'height' : yScale.rangeBand(),
                          'width' : 0
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            return xScale(d.val) - xScale(0); 
          }
         });

      var x = $('body').innerWidth() < 768 ? 20 : 30,
          f = $('body').innerWidth() <= 320 ? 0.9 : 1;

      var label = barGroup.append('svg:text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : xScale(0),
                            'y' : function(d) {
                              return yScale(d.val) + yScale.rangeBand() / 2;
                            },
                            'dx' : x,
                            'dy' : f + 'em',
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr({
            'x' : function(d) {
              return xScale(d.val);
            }
           })
           .style('opacity', 1); 
    }

    function drawActivityGraph() {
      d3.select('.activity__graph svg')
        .remove();

      var margin = {top: 0, right: 450, bottom: 40, left: 450};

      var containerWidth = $('.activity__graph').width(),
          containerHeight = $('.activity__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 5.2 },
        {platform : 'instagram', sector : 'Auto', val : 5.0 },
        {platform : 'instagram', sector : 'Beauty', val : 5.6 },
        {platform : 'instagram', sector : 'Beverages', val : 3.4 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 3.5 },
        {platform : 'instagram', sector : 'Fashion', val : 5.6 },
        {platform : 'instagram', sector : 'Retail', val : 6.0 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 5.0 },
        {platform : 'snapchat', sector : 'Activewear', val : 2.2 },
        {platform : 'snapchat', sector : 'Auto', val : 2.3 },
        {platform : 'snapchat', sector : 'Beauty', val : 2.8 },
        {platform : 'snapchat', sector : 'Beverages', val : 2.6 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 2.3 },
        {platform : 'snapchat', sector : 'Fashion', val : 2.0 },
        {platform : 'snapchat', sector : 'Retail', val : 2.0 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 2.3 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.25 ),
          xScale = d3.scale
                     .linear()
                     .domain( [-d3.max(data, function(d) { return d.val; } ), d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.activity__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + ( (width / 2) + yScale.rangeBand() / 200 ) + ' , 0)'
                          })
                          .call(yAxis)
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'x' : function(d) {
                            if ( d.platform == 'instagram' ) {
                              return xScale(0) - (yScale.rangeBand() * 3);
                            } else {
                              return xScale(0) + (yScale.rangeBand() * 3);
                            }
                          },
                          'y' : function(d) {
                            return yScale(d.sector);
                          },
                          'height' : yScale.rangeBand(),
                          'width' : function(d) {
                             return 0;          
                          }
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            if ( d.platform == 'instagram' ) {
              return Math.abs( xScale(-d.val) - xScale(0) ); 
            } else {
              return Math.abs( xScale(d.val) - xScale(0) ); 
            }
          },
          'x' : function(d) {
            if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(0) + (yScale.rangeBand() * 3);
            }
          }
         });

      var label = barGroup.append('text')
                          .text(function(d) { return d.val; })
                          .attr({
                            'x' : function(d) {
                              if ( d.platform == 'instagram' ) {
                                return xScale(0) - (yScale.rangeBand() * 3);
                              } else {
                                return xScale(0) + (yScale.rangeBand() * 3);
                              }
                            },
                            'y' : function(d) {
                              return yScale(d.sector) + yScale.rangeBand() / 2;
                            },
                            'dx' : function(d) {
                              if (d.platform === 'instagram') {
                                return -yScale.rangeBand();
                              } else {
                                return yScale.rangeBand();
                              }
                            },
                            'dy' : function() {
                              return (this.getBBox().height / 2);
                            },
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr('x', function(d) { 
             if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(d.val) + (yScale.rangeBand() * 3);
            }
           })
           .style('opacity', 1);
    }

    function drawActivityMobile() {
      d3.select('.activity__graph svg')
        .remove();

      if ( $('body').innerWidth() < 768 && 
           $('body').innerWidth() > 320) {
        var margin = {top: 0, right: 140, bottom: 0, left: 30};
      } else if ( $('body').innerWidth() <= 320 ) {
        var margin = {top: 0, right: 180, bottom: 0, left: 30};
      } else {
        var margin = {top: 0, right: 275, bottom: 0, left: 50}; 
      }

      var containerWidth = $('.activity__graph').width(),
          containerHeight = $('.activity__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 5.2 },
        {platform : 'instagram', sector : 'Auto', val : 5.0 },
        {platform : 'instagram', sector : 'Beauty', val : 5.6 },
        {platform : 'instagram', sector : 'Beverages', val : 3.4 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 3.5 },
        {platform : 'instagram', sector : 'Fashion', val : 5.6 },
        {platform : 'instagram', sector : 'Retail', val : 6.0 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 5.0 },
        {platform : 'snapchat', sector : 'Activewear', val : 2.2 },
        {platform : 'snapchat', sector : 'Auto', val : 2.3 },
        {platform : 'snapchat', sector : 'Beauty', val : 2.8 },
        {platform : 'snapchat', sector : 'Beverages', val : 2.6 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 2.3 },
        {platform : 'snapchat', sector : 'Fashion', val : 2.0 },
        {platform : 'snapchat', sector : 'Retail', val : 2.0 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 2.3 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.6 ),
          xScale = d3.scale
                     .linear()
                     .domain( [0, d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.activity__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + xScale(0) + ' , 0)'
                          })
                          .call(yAxis)
                          .style('opacity', 0);

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'start')

      if ( $('body').innerWidth() < 600 && 
           $('body').innerWidth() > 320) {
        var d = 3;  
      } else if ( $('body').innerWidth() <= 320 ) {
        var d = 0.1;
      } else {
        var d = 5;
      }
        
      yAxisGroup.selectAll('text')
                .call(wrap, (width / d) );

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr({
                          'class' : 'bar-group',
                          'transform' : function(d) {
                            if ( $('body').innerWidth() < 600 && 
                                 $('body').innerWidth() > 320) {
                              var x = 85;  
                            } else if ( $('body').innerWidth() <= 320 ) {
                              var x = 130;
                            } else {
                              var x = 175;
                            }

                            if (d.platform == 'instagram') {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) - yScale.rangeBand() / 2 ) + ')';
                            } else {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) + yScale.rangeBand() / 2 ) + ')';
                            }
                          }
                        });

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'height' : yScale.rangeBand(),
                          'width' : 0
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            return xScale(d.val) - xScale(0); 
          }
         });

      var x = $('body').innerWidth() < 768 ? 20 : 30,
          f = $('body').innerWidth() <= 320 ? 0.9 : 1.2;

      var label = barGroup.append('svg:text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : xScale(0),
                            'y' : function(d) {
                              return yScale(d.val) + yScale.rangeBand() / 2;
                            },
                            'dx' : x,
                            'dy' : f + 'em',
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr({
            'x' : function(d) {
              return xScale(d.val);
            }
           })
           .style('opacity', 1); 
    }

    function drawVideoGraph() {
      d3.select('.video__graph svg')
        .remove();

      var margin = {top: 0, right: 450, bottom: 40, left: 450};

      var containerWidth = $('.video__graph').width(),
          containerHeight = $('.video__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 12 },
        {platform : 'instagram', sector : 'Auto', val : 8 },
        {platform : 'instagram', sector : 'Beauty', val : 7 },
        {platform : 'instagram', sector : 'Beverages', val : 14 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 14 },
        {platform : 'instagram', sector : 'Fashion', val : 9 },
        {platform : 'instagram', sector : 'Retail', val : 6 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 8 },
        {platform : 'snapchat', sector : 'Activewear', val : 60 },
        {platform : 'snapchat', sector : 'Auto', val : 55 },
        {platform : 'snapchat', sector : 'Beauty', val : 52 },
        {platform : 'snapchat', sector : 'Beverages', val : 65 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 73 },
        {platform : 'snapchat', sector : 'Fashion', val : 52 },
        {platform : 'snapchat', sector : 'Retail', val : 35 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 36 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.25 ),
          xScale = d3.scale
                     .linear()
                     .domain( [-d3.max(data, function(d) { return d.val; } ), d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.video__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + ( (width / 2) + yScale.rangeBand() / 200 ) + ' , 0)'
                          })
                          .call(yAxis)
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'middle');

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'x' : function(d) {
                            if ( d.platform == 'instagram' ) {
                              return xScale(0) - (yScale.rangeBand() * 3);
                            } else {
                              return xScale(0) + (yScale.rangeBand() * 3);
                            }
                          },
                          'y' : function(d) {
                            return yScale(d.sector);
                          },
                          'height' : yScale.rangeBand(),
                          'width' : function(d) {
                             return 0;          
                          }
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
          'width' : function(d) {
            if ( d.platform == 'instagram' ) {
              return Math.abs( xScale(-d.val) - xScale(0) ); 
            } else {
              return Math.abs( xScale(d.val) - xScale(0) ); 
            }
          },
          'x' : function(d) {
            if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(0) + (yScale.rangeBand() * 3);
            }
          }
         });

      var label = barGroup.append('text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : function(d) {
                              if ( d.platform == 'instagram' ) {
                                return xScale(0) - (yScale.rangeBand() * 3);
                              } else {
                                return xScale(0) + (yScale.rangeBand() * 3);
                              }
                            },
                            'y' : function(d) {
                              return yScale(d.sector) + yScale.rangeBand() / 2;
                            },
                            'dx' : function(d) {
                              if (d.platform === 'instagram') {
                                return -yScale.rangeBand();
                              } else {
                                return yScale.rangeBand();
                              }
                            },
                            'dy' : function() {
                              return (this.getBBox().height / 2);
                            },
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr('x', function(d) { 
             if ( d.platform == 'instagram' ) {
              return xScale(-d.val) - (yScale.rangeBand() * 3);
            } else {
              return xScale(d.val) + (yScale.rangeBand() * 3);
            }
           })
           .style('opacity', 1);
    }

    function drawVideoMobile() {
      d3.select('.video__graph svg')
        .remove();

      if ( $('body').innerWidth() < 768 && 
           $('body').innerWidth() > 320) {
        var margin = {top: 0, right: 140, bottom: 0, left: 30};
      } else if ( $('body').innerWidth() <= 320 ) {
        var margin = {top: 0, right: 180, bottom: 0, left: 30};
      } else {
        var margin = {top: 0, right: 275, bottom: 0, left: 50}; 
      }

      var containerWidth = $('.video__graph').width(),
          containerHeight = $('.video__graph').height(),
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;

      var data = [
        {platform : 'instagram', sector : 'Activewear', val : 12 },
        {platform : 'instagram', sector : 'Auto', val : 8 },
        {platform : 'instagram', sector : 'Beauty', val : 7 },
        {platform : 'instagram', sector : 'Beverages', val : 14 },
        {platform : 'instagram', sector : 'Consumer Electronics', val : 14 },
        {platform : 'instagram', sector : 'Fashion', val : 9 },
        {platform : 'instagram', sector : 'Retail', val : 6 },
        {platform : 'instagram', sector : 'Watches & Jewelry', val : 8 },
        {platform : 'snapchat', sector : 'Activewear', val : 60 },
        {platform : 'snapchat', sector : 'Auto', val : 55 },
        {platform : 'snapchat', sector : 'Beauty', val : 52 },
        {platform : 'snapchat', sector : 'Beverages', val : 65 },
        {platform : 'snapchat', sector : 'Consumer Electronics', val : 73 },
        {platform : 'snapchat', sector : 'Fashion', val : 52 },
        {platform : 'snapchat', sector : 'Retail', val : 35 },
        {platform : 'snapchat', sector : 'Watches & Jewelry', val : 36 }
      ];

      data.forEach( function(d) { d.val = +d.val; } );

      var allSectors = d3.set( data.map( function(d) { return d.sector; } ) ).values();

      var yScale = d3.scale
                     .ordinal()
                     .domain( allSectors )
                     .rangeBands( [0, height], 0.6 ),
          xScale = d3.scale
                     .linear()
                     .domain( [0, d3.max(data, function(d) { return d.val; } )] )
                     .range( [0, width] );

      var yAxis = d3.svg
                    .axis()
                    .scale(yScale)
                    .tickSize(-width)
                    .orient('left');

      var svg = d3.select('.video__graph')
                  .append('svg')
                  .attr({
                    'width' : width + margin.left + margin.right,
                    'height' : height + margin.top + margin.bottom
                  })
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var yAxisGroup = svg.append('g')
                          .attr({
                            'class' : 'y axis',
                            'transform' : 'translate(' + xScale(0) + ' , 0)'
                          })
                          .call(yAxis)
                          .style('opacity', 0);

      yAxisGroup.transition()
                .duration(1000)
                .style('opacity', 1);

      yAxisGroup.selectAll('text')
                .style('text-anchor', 'start')

      if ( $('body').innerWidth() < 600 && 
           $('body').innerWidth() > 320) {
        var d = 3;  
      } else if ( $('body').innerWidth() <= 320 ) {
        var d = 0.1;
      } else {
        var d = 5;
      }
        
      yAxisGroup.selectAll('text')
                .call(wrap, (width / d) );

      var barGroup = svg.selectAll('.bar-group')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr({
                          'class' : 'bar-group',
                          'transform' : function(d) {
                            if ( $('body').innerWidth() < 600 && 
                                 $('body').innerWidth() > 320) {
                              var x = 85;  
                            } else if ( $('body').innerWidth() <= 320 ) {
                              var x = 130;
                            } else {
                              var x = 175;
                            }

                            if (d.platform == 'instagram') {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) - yScale.rangeBand() / 2 ) + ')';
                            } else {
                              return 'translate(' + x + ', ' + ( yScale(d.sector) + yScale.rangeBand() / 2 ) + ')';
                            }
                          }
                        });

      var bar = barGroup.append('rect') 
                        .attr({
                          'class' : function(d) {
                            return 'bar ' + d.platform;
                          },
                          'height' : yScale.rangeBand(),
                          'width' : 0
                        });

      bar.transition()
         .delay(function(d, i) { return i * 100; })
         .duration(1000)
         .attr({
           'width' : function(d) {
             return xScale(d.val) - xScale(0); 
           }
         });

      var x = $('body').innerWidth() < 768 ? 20 : 30,
          f = $('body').innerWidth() <= 320 ? 0.9 : 1.2;

      var label = barGroup.append('svg:text')
                          .text(function(d) { return d.val + '%'; })
                          .attr({
                            'x' : xScale(0),
                            'y' : function(d) {
                              return yScale(d.val) + yScale.rangeBand() / 2;
                            },
                            'dx' : x,
                            'dy' : f + 'em',
                            'class' : 'label'
                          })
                          .style({
                            'text-anchor' : 'middle',
                            'opacity' : 0
                          });

      label.transition()
           .delay(function(d, i) { return i * 100; })
           .duration(1000)
           .attr({
            'x' : function(d) {
              return xScale(d.val);
            }
           })
           .style('opacity', 1); 
    }

    var delta = 0,
        currentSlideIndex = 0,
        scrollThreshold = 16,
        slides = $('.slide'),
        numSlides = slides.length;

    function elementScroll (e) {
      if ( e.originalEvent.detail < 0 || 
           e.originalEvent.wheelDelta > 0 ) {
        delta--;

        if ( Math.abs(delta) >= scrollThreshold ) {
          prevSlide();
        }
      } else {
        delta++;

        if ( currentSlideIndex != 7 ) {
          if ( delta >= scrollThreshold ) {
            nextSlide();
          }
        }
      }

      return false;
    }

    function showSlide() {
      slides.each( function( i, slide ) {
        $(slide).toggleClass( 'active', ( i >= currentSlideIndex ) );
      });

      $('.bottom-nav__list__item__text').removeClass('active');

      var slide = $('#slide-' + currentSlideIndex).data('carousel');

      if ( $('body').innerWidth() >= 1030 ) {
        if ( slide ) eval('draw' + slide + 'Graph()');
      } else if ( $('body').innerWidth() < 1030 || isMobile ) {
        if ( slide ) eval('draw' + slide + 'Mobile()');
      }

      $('#trigger-' + currentSlideIndex).addClass('active');

      $(window).off({
        'DOMMouseScroll mousewheel' : elementScroll
      });

      var timeout = window.setTimeout( function() {
        initMode();
      }, 1200 );

      if (currentSlideIndex == 6) {
        appendContent( 'athletic-apparel' );
      }
    }

    function prevSlide() {
      delta = 0;

      currentSlideIndex--;

      if ( currentSlideIndex < 0 ) {
        currentSlideIndex = 0;
      }

      showSlide();
    }

    function nextSlide() {
      delta = 0;

      currentSlideIndex++;

      if ( currentSlideIndex > numSlides ) { 
        currentSlideIndex = numSlides;
      }

      showSlide();
    }

    function goToSlide(id) {
      delta = 0;

      currentSlideIndex = id;

      showSlide();
    }

    var dragThreshold = 0.15,
        dragStart = null,
        percentage = 0,
        target,
        previousTarget;

    function touchStart(event) {
      if (dragStart !== null) { return; }

      if (event.originalEvent.touches) { 
        event = event.originalEvent.touches[0];
      }

      dragStart = event.clientY;

      target = slides.eq(currentSlideIndex)[0]; 

      target.classList.add('no-animation');

      previousTarget = slides.eq(currentSlideIndex - 1)[0];
      previousTarget.classList.add('no-animation');
    }

    function touchMove(event) {
      if ( currentSlideIndex != 7 ) {
        var windowHeight = $(window).innerHeight();

        if (dragStart === null) { return; }

        if (event.originalEvent.touches) { 
          event = event.originalEvent.touches[0];
        }

        delta = dragStart - event.clientY;

        percentage = delta / windowHeight;

        if (percentage > 0) {
          target.style.height = ( 100 - ( percentage * 100 ) ) + '%';

          if (previousTarget) { 
            previousTarget.style.height = '';
          }
        } else if (previousTarget) {
          previousTarget.style.height = ( -percentage * 100 ) + '%';
          target.style.height = '';
        }
      }

      return false;
    }

    function touchEnd () {
      dragStart = null;

      target.classList.remove('no-animation');

      if (previousTarget) { 
        previousTarget.classList.remove('no-animation'); 
      }

      if (percentage >= dragThreshold) {
        nextSlide();
      } else if ( Math.abs(percentage) >= dragThreshold ) {
        prevSlide();
      }

      percentage = 0;
    }

    function appendContent(content) {
      $('#comparison__left').empty();
      $('#comparison__right').empty();

      // Append left
      var templateHTML = $('#' + content + '_left_template').html(),
          template = Handlebars.compile(templateHTML);

      $('#comparison__left').append( template() );

      // Append right
      templateHTML = $('#' + content + '_right_template').html();
      template = Handlebars.compile(templateHTML);

      $('#comparison__right').append( template() );
    }

    function initMode() {
      if ( $('body').innerWidth() >= 1030 ) {
        // Desktop

        $(window).on({
          'DOMMouseScroll mousewheel' : elementScroll
        }); 
      } else if ( $('body').innerWidth() < 768 || isMobile ) {
        //  Modile

        $(window).on({
          'touchstart': touchStart,
          'touchmove': touchMove,
          'touchend': touchEnd
        }); 
      }
    }

    $('.hamburger').on(myEvent, function() {
      if ( $('.hamburger').hasClass('opened') ) {
        $('.hamburger').removeClass('opened');
      } else {
        $('.hamburger').addClass('opened');
      }
    });

    $('.scroll-button').on(myEvent, function() {
      nextSlide();
    });

    $('.bottom-nav__list__item').on(myEvent, function(e) {
      var trigger = e.target.id,
          id = trigger.split('-').pop();

      goToSlide(id);
    });

    $('.comparison__button').on(myEvent, function(e) {
      var content = $(this).data('sector');

      $('.comparison__button.active').removeClass('active');
      $(this).addClass('active');

      appendContent( content );
    });   

    $('.mobile-nav__button').on(myEvent, function(e) {
      var platform = $(this).data('platform');

      if ( platform == 'instagram' ) {
        $('.comparison__list').animate({'left' : '0'}, 750);
      } else if ( platform == 'center' ) {
        $('.comparison__list').animate({'left' : '-50%'}, 750);
      } else {
        $('.comparison__list').animate({'left' : '-100%'}, 750);
      }

      $('.mobile-nav__button.active').removeClass('active');
      $(this).addClass('active');
    });

    $('.hamburger').on('click', function() {
      if ( $('.hamburger').hasClass('is-active') ) {
        $('.hamburger').removeClass('is-active');
        $('.offside-nav').animate({ 'left' : '-100%' }, 500);
      } else {
        $('.hamburger').addClass('is-active');
        $('.offside-nav').animate({ 'left' : '0' }, 500);
      }
    });

    $(window).resize( function() { initMode(); });

    initMode();
  }
  
  return {
    init : init
  }
})();

$(document).ready(function(){
  l2Utils.init(); 
}); 