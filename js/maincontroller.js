app.controller("MainController", function ($scope) {
    globalScope = $scope;
    $scope.dataList = [];
    $scope.connectionList = [];
    /*
    for (var i=0;i<5;i++) {
        $scope.dataList.push(new VR_node("node" + i, "compact", Math.random() * 500, Math.random() * 500, []));        
    }
    */
    $scope.lineDraw = false;
    $scope.curPath = { x1: 0, y1: 0, x2: 0, y2: 0 };

    $scope.click = function ($event) {
    }

    $scope.startLink = function ($event) {
        $scope.lineDraw = true;
        $scope.mouseDownObject = this.obj;


        $scope.curPath.x1 = $event.x - $scope.canvasLeft;
        $scope.curPath.y1 = $event.y - $scope.canvasTop;
        $scope.curPath.x2 = $event.x - $scope.canvasLeft;
        $scope.curPath.y2 = $event.y - $scope.canvasTop;
        $event.preventDefault();
        $event.stopPropagation();

    }

    $scope.expand = function () {
        if (this.obj.stype == "compact") {
            this.obj.stype = "expanded";
        } else {
            this.obj.stype = "compact";
        }
    }
    $scope.dblclick = function (evt) {
        newx = evt.pageX;
        newy = evt.pageY;
        emptyData = [
            {
                "key": "Series2",
                "color": "#24AFB2",
                "values": [
                    {
                        label: "HELLO",
                        value: "10"
                    },
                    {
                        label: "WORLD",
                        value: "9"
                    }
                ]
            }
        ];
    
        newnode = new VR_node("newnode", "compact", newx, newy, /* connections*/ [], emptyData);
        $scope.dataList.push(newnode);

    }

    $scope.mouseDown = function (evt) {

    }

    $scope.mouseUp = function ($event) {
        if ($scope.lineDraw) {
            $scope.lineDraw = false;
            newx = $event.pageX;
            newy = $event.pageY;


            aNode = $scope.findNode(newx, newy);

            if (aNode != null) {
                //console.log('Linking node', $scope.mouseDownObject, ' with ', aNode);
                aLink = new VR_connection($scope.mouseDownObject, aNode);
                $scope.connectionList.push(aLink);
                aNode.connections.push(aLink);
                $scope.mouseDownObject.connections.push(aLink);
            }
        }
    }

    $scope.findNode = function (x, y) {
        // gross: should base this on actual node not hardcoded!!!!
        retval = null;
        $scope.dataList.some(function (node, i) {
            if (node.stype == "compact") {
                nodeWidth = 150;
                nodeHeight = 100;
            } else {
                nodeWidth = 500;
                nodeHeight = 500;
            }
            if (((node.x) < x) && (x < (node.x + nodeWidth))
                && ((node.y - nodeHeight) < y) && (y < (node.y + nodeHeight))) {
                retval = node;
                return (true);
            }
            else return (false);
        });

        return (retval);
    }

    $scope.mouseMove = function ($event) {
        if ($scope.lineDraw) {
            newx = $event.pageX - $scope.canvasLeft;
            newy = $event.pageY - $scope.canvasTop;
            $scope.curPath.x2 = newx;
            $scope.curPath.y2 = newy;
        }
    }

    $scope.doQuery = function () {
        var service = new QueryWebApi("http://localhost:60064");

        service.postLog(
            new DatasetConfiguration("Sanddance", "d", "", 200, 10000, "", "MM/dd/yyyy HH:mm:ss"),
                function (logid) {
                    var e = new EventExpression(0, true, Quantifier.One, false, []);
                    service.postQuery(new LogQuery(logid, e),
                        function (queryId) {
                            service.getPropertyValueHistogram(logid, e.ID, "action", function (histo) {
                                $scope.setDataFromHisto(histo);
                            });

                        });
                });
    }
    $scope.setDataFromHisto = function (histo) {
        newdata = _.map(histo, function (val, lab) { return { "label": lab, "value": val }; });

        // right now just set the first element's data
        $scope.dataList[0].data = 
       [
       {
           "key": "Series2",
           "color": "#24AFB2",
           "values": _.first(_.sortBy(newdata, "value").reverse(), 10)
       }];
       $scope.$apply();
        
    }
    $scope.objmousedown = function ($event, theObjIndex, theObject) {
        $scope.dragObject = theObject;
        // toggle off other selected objects        

        allRects = d3.selectAll("rect")
        allRects.attr("class", "");

        /* 
         if ($event.toElement.nodeName == "rect") {
             theNode = d3.select($event.toElement);
             theNode.attr("class", "selected");
         }
         */
        if ($event.shiftKey) {
            $scope.deleteNode(theObject);
            // delete the node - but now all the connects will point wrong, so need to fix!
            $scope.dataList.splice(theObjIndex, 1);
        }
    }

    $scope.deleteNode = function (node) {
        // first delete connections
        var connlist = node.connections;
        // sort descending

        connlist.forEach(function (alink) {
            var which = $scope.connectionList.indexOf(alink);
            $scope.connectionList.splice(which, 1);
        });
    }

    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 400,
            width: 450,
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            margin:{top:5, left:150, bottom:5, right:10},
            showControls: false,
            showValues: true,
            showLegend: false,
            showYAxis: false,
            tooltips: false,
            transitionDuration: 200,
            xAxis: {
                showMaxMin: false
            },
            multibar: {
                dispatch: {
                    elementClick: function(t,u)  {alert("here;")}
                }
            }
        }
    };
    $scope.data = [
        {
            "key": "Series2",
            "color": "#24AFB2",
            "values": [
                {
                    "label": "Group A",
                    "value": 25.307646510375
                },
                {
                    "label": "Group B",
                    "value": 16.756779544553
                },
                {
                    "label": "Group C",
                    "value": 18.451534877007
                },
                {
                    "label": "Group D",
                    "value": 8.6142352811805
                },
                {
                    "label": "Group E",
                    "value": 7.8082472075876
                },
                {
                    "label": "Group F",
                    "value": 5.259101026956
                },
                {
                    "label": "Group G",
                    "value": 0.30947953487127
                },
                {
                    "label": "Group H",
                    "value": 0
                },
                {
                    "label": "Group I",
                    "value": 0
                }
            ]
        }
    ]


});



app.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var mysvg = document.getElementById("mysvg");
        scope.getMainCanvas = function () {
            return {
                'x': mysvg.offsetLeft,
                'y': mysvg.offsetTop
            };
        };
        scope.$watch(scope.getMainCanvas, function (newValue, oldValue) {
            scope.canvasTop = newValue.y;
            scope.canvasLeft = newValue.x;

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})
VR_node = function (name, stype, x, y, conns, data) {
    this.text = name;
    this.stype = stype;
    this.x = x;
    this.y = y;
    this.connections = conns;
    this.data = data;
}

VR_connection = function (startObject, endObject) {
    this.start = startObject;
    this.end = endObject;
}


