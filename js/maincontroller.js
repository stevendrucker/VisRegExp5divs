app.controller("MainController", function ($scope) {
    globalScope = $scope; 
    $scope.dataList = [];
    $scope.connectionList = [];
    for (var i=0;i<5;i++) {
        $scope.dataList.push(new VR_node("node" + i, "compact", Math.random() * 500, Math.random() * 500, []));        
    }

    $scope.lineDraw = false;
    $scope.curPath = {x1:0,y1:0,x2:0,y2:0};
   
    $scope.click = function($event)
    {
        if ($event.toElement.attributes["class"].value == "expander"){
            a = 0;
            if (this.obj.stype == "compact") {
                this.obj.stype = "expanded";
            } else {
                this.obj.stype = "compact";
            }
        }
    }

    $scope.expand = function()
    {
        alert("expand here");
    }
    $scope.dblclick = function(evt) {
        //        newx = evt.pageX - evt.currentTarget.offsetLeft;
        //        newy = evt.pageY - evt.currentTarget.offsetTop;
        newx = evt.offsetX;
        newy = evt.offsetY;
        newnode = new VR_node("newnode","compact",newx,newy,[]);
        $scope.dataList.push(newnode);

    }

    $scope.mouseDown = function (evt) {
        //newx = evt.pageX - evt.currentTarget.offsetLeft;
        //newy = evt.pageY - evt.currentTarget.offsetTop;
        newx = evt.offsetX;
        newy = evt.offsetY;

        if ($scope.dragObject != null) {
            deltax = newx - $scope.dragObject.x;
            deltay = newy - $scope.dragObject.y;
        } else {
            deltax = 0;
            deltay = 0;
        }

        $scope.dragStart = [deltax, deltay];
        if ($scope.lineDraw == false) {
            $scope.dragging = true;
        } else {
            $scope.dragging = false;
        }
    }

    $scope.mouseUp = function ($event) {
        $scope.dragging = false;
        $scope.dragObject = null;
        if ($scope.lineDraw) {
            $scope.lineDraw = false;
            //newx = $event.pageX - $event.currentTarget.offsetLeft;
            //newy = $event.pageY - $event.currentTarget.offsetTop;
            newx = $event.offsetX;
            newy = $event.offsetY;
            aNode = $scope.findNode(newx,newy);
            if (aNode != null) {
                //console.log('Linking node', $scope.mouseDownObject, ' with ', aNode);
                aLink = new VR_connection($scope.mouseDownObject, aNode);
                $scope.connectionList.push(aLink);
                aNode.connections.push(aLink);
                $scope.mouseDownObject.connections.push(aLink);
            }
        }
    }

    $scope.findNode = function (x,y) {
        nodeWidth = $scope.nodeWidth;
        nodeHeight = $scope.nodeHeight;
        retval = null;
        $scope.dataList.some (function (node, i ) {
            if (((node.x - nodeWidth/2) < x) && (x<(node.x + nodeWidth/2)) 
                && ((node.y - nodeHeight/2) < y) && (y <(node.y + nodeHeight/2))) {
                retval=node;
                return(true);
            }
            else return(false);  
        });

        return(retval);
    }

    $scope.mouseMove = function ($event) {
        //        alert("mouseMove");
        var a = 0;
        

        if ($scope.dragging && $scope.dragObject != null) {
          

            // newx = $event.pageX - $event.currentTarget.offsetLeft;
          //  newy = $event.pageY - $event.currentTarget.offsetTop;

            newx = $event.offsetX;
            newy = $event.offsetY;
            $scope.dragObject.x = newx - $scope.dragStart[0];
            $scope.dragObject.y = newy - $scope.dragStart[1];            
            
            //console.log("diff x position " + $event.pageX  - $event.currentTarget.offsetLeft + " " + $event.offsetX + " object " + $event.target.nodeName);
        }

        if ($scope.lineDraw) {
            if ($event.target.nodeName == "svg") {
                newx = $event.offsetX;
                newy = $event.offsetY;
            } else if ($event.target.nodeName == "rect") {
                newx = $event.offsetX;
                newy = $event.offsety;
            }            
            //            newx = $event.pageX - $event.currentTarget.offsetLeft;
            //            newy = $event.pageY - $event.currentTarget.offsetTop;
            $scope.curPath.x2 = newx;
            $scope.curPath.y2 = newy;
        }

    }



    $scope.objmousedown = function($event, theObjIndex, theObject)
    {
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

    $scope.deleteNode = function(node) {
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
            height: 300,
            width: 500,
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            showControls: false,
            showValues: true,
            showLegend: false,
            showYAxis: false,
            tooltips: false,
            transitionDuration: 500,
            xAxis: {
                showMaxMin: false
            }
        }
    };
    $scope.data = [
        {
           "key": "Series2",
           "color": "#1f77b4",
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

VR_node = function(name, stype, x,y,conns)
{
    this.text = name;
    this.stype = stype;
    this.x = x;
    this.y = y;
    this.connections = conns;
}

VR_connection = function(startObject, endObject)
{
    this.start = startObject;
    this.end = endObject; 
}


