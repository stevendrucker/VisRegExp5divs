var app = angular.module('MyAngularApp', ['ui.bootstrap', 'nvd3']);


app.directive('node', function () {

    return {
        restrict: 'AEC',
        replace: true,
        scope: {
            obj: '=',
        },
        template: '<div class="NodeClass">{{obj.text}} <div onclick="expand()" class="expander"> o </div> </div>'
//       > {{obj.name}} </div>'
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
            
            var theLineObjects = [{ x:theObject.start.x, y: theObject.start.y },
                { x: theObject.start.x + 100, y: theObject.start.y },
                { x: theObject.end.x - 100, y: theObject.end.y },
                { x: theObject.end.x, y: theObject.end.y } ];
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
            	}]
            	, function () {
				var theObject = scope.theconn;
				var theLineObjects = [{ x:theObject.start.x, y: theObject.start.y },
                	{ x: theObject.start.x + 100, y: theObject.start.y },
                	{ x: theObject.end.x - 100, y: theObject.end.y },
                	{ x: theObject.end.x, y: theObject.end.y } ];
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


