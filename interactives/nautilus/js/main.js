//*~*~*~~**~*~*~*
// L2 Inc. Utils
//*~*~*~*~*~*~*~*
var l2Utils = (function () {

  function init(options) { 
    var defaults = {};
    options = $.extend(defaults, options);

    window.isMobile = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    window.myEvent = isMobile ? 'touchstart' : 'click';

    var $container = $('.chart'),
        m = 5,
        width = $container.innerWidth() - m,
        height = $container.innerHeight() - m,
        r = Math.min(width, height) / 2;

    var study = null;

    var arc = d3.svg.arc();

    d3.csv('allBrands.csv', ready);

    function key_func(d, i) { return d.study_id + ':' + d.brand_id; }

    function ready(err, data) {
      if (err) console.warn('Error', err);

      d3.select('.chart svg')
        .remove();

      data.forEach( function(item, i) {
        var num = $('body').innerWidth() < 768 ? 4 : 5;

        var startRadius = (r / num),
            endRadius = startRadius,
            groupName;

        item.paths = [];

        for (var g = 0; g < 4; g++) {
          item.paths[g] = {};

          item.paths[g].startRadius = startRadius;

          if (g == 0) {
            groupName = 'raw_mobile_score';
          } else if (g == 1) {
            groupName = 'raw_social_score';
          } else if (g == 2) {
            groupName = 'raw_digital_mkting_score';
          } else {
            groupName = 'raw_site_score';
          }

          var num2 = $('body').innerWidth() < 768 ? 100 : 225;

          endRadius += Number( item[groupName] ) * (r / num2);

          item.paths[g].endRadius = endRadius;

          startRadius = endRadius + 0.5;
        }
      });

      var svg = d3.select('.chart')
                  .append('svg')
                  .attr({
                    'width' : width,
                    'height' : height,
                    'class' : 'chart__container'
                  })
                  .append('g')
                  .attr('transform', 'translate(' + (width / 2) + ', ' + (height / 2) + ' )'); 

      var slices = svg.selectAll('.slice'),
          labels = svg.selectAll('.label');

      function updateChart(study) {
        var theData = data;

        var labelData = d3.nest()
                          .key(function(d) { 
                            return d.study_name; 
                          })
                          .entries(theData);

        if (study) {
          theData = data.filter(function(d) { 
            return d.study_name === study; 
          });

          labelData = theData;
        }

        var angleSize = (2 * Math.PI) / theData.length;

        slices = slices.data(theData, key_func);

        slices.enter()
              .append('g')
              .attr('class', 'slice');

        slices.exit()
              .remove();

        slices.transition()
              .duration(750)
              .each(function (dSlice, iSlice) {
                var slice = d3.select(this);

                var paths = slice.selectAll('path');

                paths = paths.data(dSlice.paths);

                paths.exit()
                     .remove();

                paths.enter()
                     .append('path')
                     .attr({
                       'class' : function (d, i) {
                          if (i == 0) {
                            return 'path ' + dSlice['mobile_class'];
                          } else if (i == 1) {
                            return 'path ' + dSlice['social_class'];
                          } else if (i == 2) {
                            return 'path ' + dSlice['digital_mkting_class'];
                          } else {
                            return 'path ' + dSlice['site_class'];
                          }
                       },
                       'company' : dSlice.brand_name,
                       'study' : function (d, i) {
                         return dSlice.study_name;
                       },
                       'diq' : function (d, i) {
                         return dSlice.diq;
                       },
                       'startradius' : function (d, i) {
                         return d.startRadius;
                       },
                       'endradius' : function (d, i) {
                         return d.endRadius;
                       },
                       'startangle' : function (d, i) {
                         return angleSize * iSlice;
                       },
                       'endangle' : function (d, i) {
                         return angleSize * (iSlice + 1);
                       },
                       'd' : function(d) {
                         return arc({
                           innerRadius: +d.startRadius, 
                           outerRadius: +d.endRadius, 
                           startAngle: +angleSize * iSlice, 
                           endAngle: +angleSize * (iSlice + 1) 
                         });
                       }
                     })
                     .each(function (d) {
                       this._current = {
                         innerRadius: +d.startRadius, 
                         outerRadius: +d.endRadius, 
                         startAngle: +angleSize * iSlice, 
                         endAngle: +angleSize * (iSlice + 1)
                       };
                     });

                paths.transition()
                     .duration(750)
                     .attrTween('d', function(d) {
                       var end = {
                         innerRadius: +d.startRadius, 
                         outerRadius: +d.endRadius,
                         startAngle: +angleSize * iSlice, 
                         endAngle: +angleSize * (iSlice + 1)
                       };

                       var interpolate = d3.interpolate(this._current, end);

                       return function (t) {
                         return arc(interpolate(t));
                       };
                     });

                paths.on('click', selectStudy)
                     .on('mouseover', mouseover)
                     .on('mouseout', mouseout);
              });

        labels = labels.data(labelData);

        labels.enter()
              .append('text')
              .attr('class', 'label only-med-lg');

        labels.exit()
              .remove();

        var accessor;

        labels.attr({
                'dy' : '0.37em',
                'transform' : function(d, i) {
                  var labelAngle = (2 * Math.PI) / 25,
                      inRadNum = 1.8,
                      endAngNum = 1.4; 

                  if (!study) { 
                    accessor = d.values[i];
                  } else {
                    labelAngle = angleSize;
                    accessor = d;
                    endAngNum = 1;
                  }

                  accessor.innerRadius = (r / inRadNum);
                  accessor.outerRadius = accessor.innerRadius;
                  accessor.startAngle = labelAngle * i;
                  accessor.endAngle = labelAngle * (i + endAngNum);
                  accessor.textAnchor = '';
                 
                  return 'translate(' + arc.centroid(accessor) + ')rotate(' + angle(accessor, -90, 90) + ')';
                },
                'text-anchor' : function(d, i) {
                  accessor = !study ? d.values[i] : d;
                  return accessor.textAnchor;
                },
                'label' : function(d, i) {
                  accessor = !study ? d.values[i] : d;
                  return !study ? accessor.study_name : accessor.brand_name; 
                }
              })
              .text( function(d) {
                return !study ? d.key : d.brand_name;
              })
              .style('opacity', '0');

        labels.transition()
              .duration(750)
              .style('opacity', 0.3);

        function angle(d, offset, threshold) {
          var a = (d.startAngle + d.endAngle) * 90 / Math.PI + offset;

          d.textAnchor = a > threshold ? 'end' : 'start';

          return a > threshold ? a - 180 : a;
        }

        function selectStudy(d) {
          if (!study) { 
            study = $(this).attr('study');

            $('.back').addClass('visible');

            if ( $('body').innerWidth() < 768 ) {
              $('.mobile.is-all').fadeOut();
              $('.mobile.is-single').fadeIn();

              $('#study h4').text(study);

              d3.select('#study')
                .style('visibility', '');
            } else {
              $('.desktop.is-all').fadeOut();
              $('.desktop.is-single').fadeIn();
            }

            updateChart(study) 
          };
        }

        function mouseover(d) {
          var companyName = $( this ).attr('company') + '',
              report = $( this ).attr('study') + '',
              diq = $( this ).attr('diq') + '';

          d3.selectAll('path')
            .style('opacity', 0.3);

          if (study) { 
            $('.back').removeClass('visible'); 

            $('#details .brand-name').text(companyName);
            $('#details .diq').text('DIQ Score: ' + diq);

            d3.select('#details')
              .style('visibility', '');
          }

          if (!study) {
            d3.selectAll('path[study="' + report + '"]')
              .style('opacity', 1);

            d3.selectAll('text[label="' + report + '"]')
              .style('opacity', 1);
          } else {
            d3.selectAll('path[company="' + companyName + '"]')
              .style('opacity', 1);

            d3.selectAll('text[label="' + companyName + '"]')
              .style('opacity', 1);
          }
        }

        function mouseout(d) {
          d3.selectAll('path')
             .style('opacity', 1);

          d3.selectAll('text')
            .style('opacity', 0.3);

          if (study) { 
            $('.back').addClass('visible'); 

            d3.select('#details')
              .style('visibility', 'hidden');
          }
        } 
      }

      updateChart();

      $('body').on('click', '.back, .back-img', function() {
        updateChart();

        $('.visible').removeClass('visible');

        if ( $('body').innerWidth() < 768 ) {
          $('.mobile.is-all').fadeIn();
          $('.mobile.is-single').fadeOut();

          d3.select('#study')
            .style('visibility', 'hidden');

        } else {
          $('.desktop.is-all').fadeIn();
          $('.desktop.is-single').fadeOut();
        }
      });
    }
  }
  
  return {
    init: init
  }
})();

$(document).ready(function(){
  l2Utils.init();
});