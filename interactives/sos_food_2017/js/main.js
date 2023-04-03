/* FOOD 2017 SHARE OF SHELF */

var l2Utils = (function () {
  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    // Set globals
    var $selectedBrand,
        $selectedEtailer = 'all',
        index = 0;

    // Load all files
    d3.queue()
      .defer(d3.csv, 'js/amazon-fresh.csv')
      .defer(d3.csv, 'js/amazon-prime.csv')
      .defer(d3.csv, 'js/freshdirect.csv')
      .defer(d3.csv, 'js/kroger.csv')
      .defer(d3.csv, 'js/peapod.csv')
      .defer(d3.csv, 'js/prime-pantry.csv')
      .defer(d3.csv, 'js/walmart.csv')
      .defer(d3.csv, 'js/whole-foods.csv')
      .await(combine);

    // Merge into single dataset
    function combine(err, data1, data2, data3, data4, data5, data6, data7, data8) {
      if (err) console.warn('Error', err);

      var data = d3.merge([ data1, data2, data3, data4, data5, data6, data7, data8 ]);
      
      ready(data);
    }

    function uniq(a) {
      var seen = {};

      return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    }

    function ready(data) {
      // Get list of all brands
      var allBrands = d3.set( data.map( function(d) { return d.brand; } ) ).values(),
          dataByEtailer;

      allBrands = uniq(allBrands);

      // Build brand dropdown
      var brandSelect = d3.select('#brand-select');

      brandSelect.selectAll('option')
                 .data(allBrands)
                 .enter()
                 .append('option')
                 .text( function(d) { return d; } )
                 .attr('value', function(d) { return d; });

      $('#brand-select').chosen()
                        .on('change', function(d) {
                           var brand = d3.select(this).property('value');
                           update(brand); 
                        });

      function getEtailerData(etailer) {
        var etailerData = d3.nest()
                            .key(function(d) { return d.etailer; })
                            .entries(data);

        if ($selectedEtailer != 'all') {
          etailerData = etailerData.filter(function(d) { return d.key == etailer; });
        } 

        return etailerData;
      }

      function update(brand, etailer) {
        if (!brand)
          brand = allBrands[0];

        if (!etailer)
          etailer = 'all';

        // Set selected brand and etailer globals
        $selectedBrand = brand;
        $selectedEtailer = etailer;

        // Remove charts
        d3.selectAll('.chart')
          .remove();
          
        // Reset loop index
        index = 0;

        var allEtailers = [];
        
        dataByEtailer = getEtailerData(etailer);

        dataByEtailer.forEach(function(d, i) {

          var brandData = d.values.filter(function(e) { return e.brand == brand; });

          if (brandData.length > 0) {
            var theData = structureData(brandData);

            var dataByCategory = d3.nest()
                                   .key(function(d) { return d.category; })
                                   .entries(theData);

            dataByCategory.forEach(function(e, j) {

              var total = d3.sum(e.values, function(f) { return f.val; }),
                  other = (100 - total);

              // Add in "other" value   
              dataByCategory[j].values.push({
                brand: 'Other',
                category: e.values[0].category,
                etailer: e.values[0].etailer,
                val: other
              });

              // Build waffle chart
              var waffle = new WaffleChart().selector('.chart-container')
                                            .data(e)();
            });

            allEtailers.push(brandData[0].etailer);
          }
        });

        generateTags(allEtailers);
      }

      function brandColor(etailer) {
        switch (etailer) {
          case 'Amazon Fresh':
            return '#FFA600'; 
            break;
          case 'Amazon Prime':
            return '#2251C3';
            break;
          case 'FreshDirect':
            return '#E62A02';
            break;
          case 'Kroger':
            return '#229ED8';
            break;
          case 'Peapod':
            return '#17D455';
            break;
          case 'Amazon Prime Pantry':
            return '#8648CD';
            break;
          case 'Walmart':
            return '#E6D101';
            break;
          case 'Whole Foods':
            return '#D471C0';
            break;
          default:
            return '#1A1A1A';
        }
      }

      function hoverColor(etailer) {
        switch (etailer) {
          case 'Amazon Fresh':
            return '#FFD280'; 
            break;
          case 'Amazon Prime':
            return '#BDCBED';
            break;
          case 'FreshDirect':
            return '#FACFC6';
            break;
          case 'Kroger':
            return '#BDE2F3';
            break;
          case 'Peapod':
            return '#B9F2CC';
            break;
          case 'Amazon Prime Pantry':
            return '#DBC8F0';
            break;
          case 'Walmart':
            return '#F8F1B3';
            break;
          case 'Whole Foods':
            return '#F2D4EC';
            break;
          default:
            return '#1A1A1A';
        }
      }

      function structureData(brandData) {        
        brandData = brandData[0];

        var allCategories = [],
            brandCategories = [];

        if (brandData)
          thisEtailer = brandData.etailer;

        var etailerData = dataByEtailer.filter(function(d) { return d.key === thisEtailer })[0],
            competitorData = [];

        // Get all categories
        allCategories = d3.keys(brandData);

        allCategories.forEach(function(d) {
          if ( !isNaN(brandData[d]) && brandData[d] != 0 ) {
            brandCategories.push(d);
          }
        });

        // Find competitors with non-zero values in categories the selected brand is also in
        brandCategories.forEach(function(d) {
          etailerData.values.forEach(function(e) {

            if ( !isNaN(e[d]) && e[d] != 0 ) {
              competitorData.push({
                'brand': e.brand,
                'category': d, 
                'etailer': thisEtailer, 
                'val': +e[d]
              });
            }
          });
        });

        return competitorData;
      }

      function generateTags(allEtailers) {
        d3.select('.brand-title').text($selectedBrand);
        
        d3.select('#etailer-select')
          .selectAll('div')
          .remove();

        d3.select('#etailer-select')
          .append('div')
          .attr({
            'class': 'inline-block mr1 mt2 pointer',
            'data-etailer': 'all'
          })
          .on('click', function(d) { update($selectedBrand, 'all'); })
          .html('<h6 class="pv1 ph2 / grey90 bg-transparent / ba b-grey90 br-pill ani">All E-Tailers</h6>');

        d3.select('#etailer-select')
          .selectAll('.etailer')
          .data(allEtailers)
          .enter()
          .append('div')
          .attr({
            'class': 'etailer inline-block mr1 mt2 pointer inactive',
            'data-etailer': function(d) { return d; }
          })
          .on('click', function(d) {
            var etailer = d3.select(this).attr('data-etailer');
            update($selectedBrand, etailer);
          })
          .html(function(d) {
            return '<h6 class="pv1 ph2 / bg-transparent / ba br-pill / ani">' + d + '</h6>'
          })
          .select('h6')
          .style({
            'color': function(d) { return brandColor(d); },
            'border-color': function(d) { return brandColor(d); }
          });

        d3.select('.etailer[data-etailer="' + $selectedEtailer + '"]')
          .classed('inactive', false);
      }

      // Waffle chart constructor
      function WaffleChart() {
        var $_selector,
            $_data,
            $_label,
            $_cellSize,
            $_cellGap,
            $_rows,
            $_columns,
            $_keys,
            $_useWidth;

        var defaults = {
              useWidth: true,
              rows: 10,
              columns: 10,
              gap: 1
            };

        function generatedWaffleChart() {
          var obj = {
                selector: $_selector,
                data: $_data,
                label: $_label,
                size: $_cellSize,
                gap: $_cellGap,
                rows: $_rows,
                columns: $_columns,
                useWidth: $_useWidth
              };

          drawWaffleChart(obj);
        }

        function drawWaffleChart(_obj) {
          if (!_obj.rows) { _obj.rows = defaults.rows; }
          if (!_obj.columns) { _obj.columns = defaults.columns; }
          if (_obj.gap === undefined) { _obj.gap = defaults.gap; }
          if (_obj.useWidth === undefined) { _obj.useWidth = defaults.useWidth; }

          var formattedData = [],
              domain = [];

          var squareVal = 100 / (_obj.rows * _obj.columns);

          _obj.data.values.sort(function(a, b) {
            if (a.brand != 'Other' && b.brand != 'Other') {
              return d3.descending(a.val, b.val);
            }
          });

          _obj.data.values.forEach(function(d, i) { 
            d.units = Math.floor(d.val / squareVal);

            formattedData = formattedData.concat(
              Array(d.units + 1).join(1).split('').map(function() {
                return { brand: d.brand,
                         category: d.category,
                         etailer: d.etailer,
                         squareVal: squareVal,
                         units: d.units,
                         val: d.val,
                         groupIndex: i
                       };
              })
            );

            domain.push( d.brand );
          });

          // Add labels
          if (_obj.label) {
            d3.select(_obj.selector)
              .append('div')
              .attr('class', 'label')
              .text(_obj.label);
          }

          var grey60 = '#666666',
              grey30 = '#B3B3B3',
              grey10 = '#E5E6E6';

          var chart = d3.select(_obj.selector)
                      .append('div')
                      .attr({
                        'class': 'chart',
                        'id': 'chart-' + index
                      })
                      .style('opacity', 0);

          chart.transition()
               .duration(500)
               .style('opacity', 1);

          // Set up dimensions
          var width = $('.chart').width(),
              height = width;

          _obj.size = (width - (_obj.gap * _obj.rows)) / _obj.rows;

          // Append tag
          var tag = chart.append('div')
                         .attr('class', 'inline-block mv2')
                         .append('h6')
                         .attr('class', 'pv1 ph2 bg-transparent ba br-pill')
                         .text( _obj.data.values[0].etailer )
                         .style({
                           'color': brandColor(_obj.data.values[0].etailer),
                           'border-color': brandColor(_obj.data.values[0].etailer)
                         });

          // Append title
          var title = chart.append('h5')
                           .attr('class', 'title mb4 grey90')
                           .html('<span class="grey40 mr2">Category</span>' + _obj.data.values[0].category);

          var svg = chart.append('svg')
                         .attr({
                           'class': 'waffle',
                           'width': width,
                           'height': height
                         });

          var g = svg.append('g')
                     .attr('transform', 'translate(0, 0)');

          // Insert 
          var item = g.selectAll('.unit')
                      .data(formattedData);

          item.enter()
              .append('rect')
              .attr({
                'class': 'unit',
                'width': _obj.size,
                'height': _obj.size,
                'fill': function(d) {
                  if (d.brand === $selectedBrand) {
                    return brandColor(_obj.data.values[0].etailer);
                  } else if (d.brand === 'Other') {
                    return grey10;
                  } else {
                    return grey30;
                  }
                },
                'y': function(d, i) {
                  var col = Math.floor(i / _obj.rows);

                  return (col * (_obj.size)) + (col * _obj.gap);
                },
                'x': function(d, i) {
                  var row = i % _obj.rows;

                  return (row * _obj.size) + (row * _obj.gap);
                },
                'data-brand': function(d) { return d.brand; }
              })
              .append('title')
              .text(function (d, i) {
                return _obj.data.values[d.groupIndex].brand + ': ' + Math.round((d.units / formattedData.length) * 100) + '%';
              });

          var brand, 
              squares, 
              title;

          var hoverOn = function(d) {
            brand = d.brand;
            squares = d3.selectAll('.unit[data-brand="' + brand + '"]');
            title = d3.selectAll('.legend_item_text[data-brand="' + brand + '"]');

            if ( brand != $selectedBrand ) {
              squares.transition()
                     .duration(300)
                     .attr('fill', hoverColor(d.etailer));

              title.transition()
                   .duration(300)
                   .style('color', hoverColor(d.etailer));
            }
          }

          var hoverOff = function(d) {
            var color = brand === 'Other' ? grey10 : grey30;

            if ( brand != $selectedBrand ) {
              squares.transition()
                     .duration(200)
                     .attr('fill', color);

              title.transition()
                   .duration(300)
                   .style('color', grey30);
            }
          }

          item.on('mouseover', function(d) { hoverOn(d); });
          item.on('mouseout', function(d) { hoverOff(d); });

          // Generate outlines
          var thisChartsBrands = d3.set( formattedData.map( function(d) { return d.brand; })).values(),
              outlineData = [],
              units = [],
              seed = function(i) { 
                if (units[i])
                  return units[i]; 
              };

          thisChartsBrands.forEach(function(d) {
            if (d != 'Other') {
              var squares = d3.select('#chart-' + index)
                            .selectAll('.unit[data-brand="' + d + '"]')

              units.push(squares[0].length);
            }
          });

          outlineData = d3.merge(thisChartsBrands.map(function(e, i) {
                            return d3.range( seed(i) ).map(function() {
                              return e;
                            });
                          }))
                          .map(function(d, i) {
                            return {
                              index: i,
                              value: d,
                              x: i % _obj.columns,
                              y: Math.floor(i / _obj.columns)
                            }
                          });

          var pathData = thisChartsBrands.map(function(t) {
            return outline(outlineData.filter(function(r) {
              return r.value === t;
            }))
          });

          g.selectAll('path')
           .data(pathData)
           .enter()
           .append('path')
           .attr({
             'd': function(d) { return d; },
             'stroke': grey60,
             'stroke-width': 1,
             'stroke-linecap': 'square',
             'fill': 'none'
           });

          // Build legend
          var legend = chart.append('div')
                            .attr('class', 'legend');

          var legendItem = legend.selectAll('div')
                                 .data(_obj.data.values);

          legendItem.enter()
            .append('div')
            .attr({
              'class': 'legend_item_text',
              'data-brand': function(d) { return d.brand; }
            })
            .html(function(d) { return '<h5 class="w100"><span>' + d.brand + '</span> <span class="absolute right0">' + d.val + '%' + '</span></h5>'; })
            .style({
              'color': function(d) {
                if (d.brand === $selectedBrand) {
                  return brandColor(d.etailer);
                } else {
                  return grey30;
                }
              },
              'cursor': 'default'
            });

          legendItem.on('mouseover', function(d) { hoverOn(d); });
          legendItem.on('mouseout', function(d) { hoverOff(d); });

          // Iterate index for every chart drawn
          index++;

          function outline(t) {
            // t = data, broken up by color
            // [{ index: 0, value: 'red', x: 0, y: 0 }]
            var r = function(t) {
                  return t.x * (_obj.size + _obj.gap) + ','+ t.y * (_obj.size + _obj.gap);
                },
                e = (d3.extent(t, function(t) {
                  return t.x;
                }), d3.extent(t, function(t) {
                  return t.y;
                })),
                n = e[0],
                a = e[1],
                i = _obj.size,
                o = function(t, r, e) {
                  return !r.find(function(r) {
                    return r.x === t.x && r.y === t.y + e;
                  });
                },
                c = d3.range(n, a + 1).map(function(e) {
                  var n = t.filter(function(t) {
                          return t.y === e
                      }),
                      a = n.map(function(e) {
                          var n = o(e, t, -1),
                              a = o(e, t, 1),
                              c = n ? 'M' + r(e) + 'h' + i : '',
                              u = a ? 'M' + r(e) + ' m0,' + i + ' h' + i : '';
                          return "" + c + u
                      }).join(''),
                      c = 'M' + r(n[0]) + ' v' + i,
                      u = 'M' + r(n.slice(-1)[0]) + ' m' + i + ',0 v' + i;
                  return c + " " + a + " " + u
                });

            return c.join(' ')
          }
        }

        generatedWaffleChart.selector = function(value){
          if (!arguments.length) { return $_selector; }
          $_selector = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.data = function(value){
          if (!arguments.length) { return $_data; }
          $_data = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.useWidth = function(value){
          if (!arguments.length) { return $_useWidth; }
          $_useWidth = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.label = function(value){
          if (!arguments.length) { return $_label; }
          $_label = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.size = function(value){
          if (!arguments.length) { return $_cellSize; }
          $_cellSize = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.gap = function(value){
          if (!arguments.length) { return $_cellGap; }
          $_cellGap = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.rows = function(value){
          if (!arguments.length) { return $_rows; }
          $_rows = value;
          return generatedWaffleChart;
        }

        generatedWaffleChart.columns = function(value){
          if (!arguments.length) { return $_columns; }
          $_columns = value;
          return generatedWaffleChart;
        }

        return generatedWaffleChart;
      }

      update();
    }
  }
    
  return {
    init:init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});