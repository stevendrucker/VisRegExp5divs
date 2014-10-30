var app = angular.module('MyAngularApp', ['ui.bootstrap', 'nvd3']);


app.directive('node', function () {

    return {
        restrict: 'AEC',
        replace: true,
        template: '<div ng-class="obj.stype">{{obj.text}}' +
                '<div ng-mousedown="startLink($event)" class="linker"></div>' + 
                '<div ng-show=\"obj.stype==\'expanded\'\"> <nvd3 options="options" data="obj.data"></nvd3></div>' +
                '<div ng-click="expand()" class="expander"> o </div>' +
                '</div>',
    }

} ) ;


//
//

var lineFunction = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; })
    .interpolate("basis");

app.directive('nodeconnection', function ($timeout) {

    return {
        restrict: 'AEC',        
        scope: {
            theconn: '=',         
        },
        link: function (scope, lElement, lAttr) {
            
            var theObject = scope.theconn;
            startNodeWidth = (theObject.start.stype == "compact" ? 150 : 500);
            startNodeHeight = (theObject.start.stype == "compact" ? 100 : 500);
            
            endNodeWidth = (theObject.end.stype == "compact" ? 150 : 500);
            endNodeHeight = (theObject.end.stype == "compact" ? 100 : 500);

            
            var theLineObjects = [{ x: theObject.start.x - scope.$parent.canvasLeft + startNodeWidth/2.0, y: theObject.start.y + startNodeHeight/2.0 - scope.$parent.canvasTop },
                        { x: theObject.start.x + startNodeWidth/2.0 - scope.$parent.canvasLeft + 100, y: theObject.start.y + startNodeHeight/2.0 - scope.$parent.canvasTop },
                        { x: theObject.end.x + endNodeWidth/2.0 - scope.$parent.canvasLeft - 100, y: theObject.end.y +endNodeHeight/2.0  - scope.$parent.canvasTop },
                        { x: theObject.end.x + endNodeWidth/2.0 - scope.$parent.canvasLeft, y: theObject.end.y  + endNodeHeight/2.0 - scope.$parent.canvasTop }];
            var path = makeNode('path', lElement, lAttr);
            var d3path = d3.select(path);
            d3path.attr("d", lineFunction(theLineObjects))
                .attr("stroke", "blue")
                .attr("stroke-width", 15)
                .attr("fill", "none");
            var newGuy = path.cloneNode(true);
            scope.thePath = newGuy;
            $timeout(function () {
                lElement.replaceWith(newGuy);                
            })
            scope.$watchGroup(
            	[function() {
            		return(theObject.end.x)
            	},
            	function() {
            		return(theObject.end.y)
            	},
            	function() {
            		return(theObject.start.x)
            	},
				function() {
            		return(theObject.start.y)
				},
            	function () {
            	    return (theObject.start.stype)
            	},
                function () {
                    return (theObject.end.stype)
                }
            	]
            	, function () {
            	    startNodeWidth = (theObject.start.stype == "compact" ? 150 : 500);
            	    startNodeHeight = (theObject.start.stype == "compact" ? 100 : 500);

            	    endNodeWidth = (theObject.end.stype == "compact" ? 150 : 500);
            	    endNodeHeight = (theObject.end.stype == "compact" ? 100 : 500);


            	    var theLineObjects = [{ x: theObject.start.x - scope.$parent.canvasLeft + startNodeWidth / 2.0, y: theObject.start.y + startNodeHeight / 2.0 - scope.$parent.canvasTop },
                                { x: theObject.start.x + startNodeWidth / 2.0 - scope.$parent.canvasLeft + 100, y: theObject.start.y + startNodeHeight / 2.0 - scope.$parent.canvasTop },
                                { x: theObject.end.x + endNodeWidth / 2.0 - scope.$parent.canvasLeft - 100, y: theObject.end.y + endNodeHeight / 2.0 - scope.$parent.canvasTop },
                                { x: theObject.end.x + endNodeWidth / 2.0 - scope.$parent.canvasLeft, y: theObject.end.y + endNodeHeight / 2.0 - scope.$parent.canvasTop }];

            	var path = makeNode('path', lElement, lAttr);
            	var d3path = d3.select(scope.thePath);
	            d3path.attr("d", lineFunction(theLineObjects))
	                .attr("stroke", "blue")
	                .attr("stroke-width", 15)
	                .attr("fill", "none");			
        	})
        }
    }
});


  app.directive('myDraggable', function ($document) {
      return {
          restrict: 'EA',
          replace: true,
          transclude: true,
          scope: {
              obj: '=',
          },
          template: '<div class="my-div" ng-transclude> </div>',
          link: function (scope, element, attr) {
              var startX = 0, startY = 0, x = 0 , y = 0;

              element.css({
                  position: 'absolute',
                  cursor: 'pointer'
              });

              element.on('mousedown', function (event) {
                  // Prevent default dragging of selected content
                  event.preventDefault();
                  //startX = event.pageX - x;
                  //startY = event.pageY - y;
                  startX = event.pageX - this.offsetLeft;
                  startY = event.pageY - this.offsetTop;
                  $document.on('mousemove', mousemove);
                  $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                  y = event.pageY - startY;
                  x = event.pageX - startX;
                  element.css({
                      top: y + 'px',
                      left: x + 'px'
                  });
                  element.scope().obj.x = x;
                  element.scope().obj.y = y;
              }

              function mouseup() {
                  $document.unbind('mousemove', mousemove);
                  $document.unbind('mouseup', mouseup);
              }
          }

      }
  });

/* Create a shape node with the given settings. */
function makeNode(name, element, settings) {
  var ns = 'http://www.w3.org/2000/svg';
  var node = document.createElementNS(ns, name);
  for (var attribute in settings) {
    var value = settings[attribute];
    if (value !== null && value !== null && !attribute.match(/\$/) &&
      (typeof value !== 'string' || value !== '')) {
      node.setAttribute(attribute, value);
    }
  }
  return node;
}


