  //-------------
  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
  var pieChart = new Chart(pieChartCanvas);
  var PieData = [

    {
      value: 500,
      color: "#00a65a",
      highlight: "#00a65a",
      label: "正常"
    },
    {
      value: 400,
      color: "#f39c12",
      highlight: "#f39c12",
      label: "等待"
    },

    {
      value: 300,
      color: "#3c8dbc",
      highlight: "#3c8dbc",
      label: "换模"
    },
    {
      value: 100,
      color: "#d2d6de",
      highlight: "#d2d6de",
      label: "离线"
    }
  ];
  var pieOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 1,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
    //String - A tooltip template
    tooltipTemplate: "<%=value %> <%=label%>"
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);
  //-----------------
  //- END PIE CHART -
  //-----------------


  $(function(){
      queryEquipmentAddress();
  })
  var data_info;
  var tempdata;
 function queryEquipmentAddress(){
        $.ajax({
            type:"post",
            url:"../../../../"+ln_project+"/workCenter?method=queryAllEquipmentList&flag=1",
            dataType:"json",
            success:function(data){

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

	                data_info = data;
	                console.info(data);
	                queryAllEquipmentList();
	                createMap();

    			}


            }
        })
    }

 function queryAllEquipmentList(){
     $.ajax({
         type:"post",
         url:"../../../../"+ln_project+"/workCenter?method=queryAllEquipmentList",
         dataType:"json",
         success:function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	             tempdata = data.length;
	             $("#total").html("&nbsp;"+data.length);
	             queryAllEquipmonitor();

			}
         }
     })
 }
 var onlinecount=0;
 var offlinecount=0;
 function queryAllEquipmonitor(){

     $.ajax({
         type : "post",
         url : "../../../../"+ln_project+"/equipmentMonitor?method=queryEquipmentMonitor",
         dataType : "text",
         async : false,
         success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	             var tempData = $.parseJSON(data);
	             if(tempData.length==0){
	                 offlinecount = data_info.length;
	             }
	             for(var i=0;i<tempData.length;i++){
	                 switch (tempData[i].equipStatus) {
	                 case "running":{

	                     onlinecount++;
	                     break;
	                 }
	                 case "start":{

	                     onlinecount++;
	                     break;
	                 }
	                 case "pause":{

	                     onlinecount++;
	                     break;
	                 }
	                 case "error":{

	                     onlinecount++;
	                     break;
	                 }
	                 case "stop":{

	                     onlinecount++;
	                     break;
	                 }
	                 default:{

	                     break;
	                 }
	                 }
	             }

			}
         }
     });

     $("#onlinecount").html("&nbsp;"+onlinecount);
     $("#offlinecount").html("&nbsp;"+(parseInt(tempdata)-parseInt(onlinecount)));
     onlinecount=0;
     offlinecount=0;
 }
  function createMap(){
      map = new BMap.Map("allmap",{minZoom:4,maxZoom:17});
      map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
      map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
      map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
      map.enableScrollWheelZoom();                            //启用滚轮放大缩小
      map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
      map.disable3DBuilding();

      var styleJson = [
                       {
                         "featureType": "all",
                         "elementType": "geometry",
                         "stylers": {
                                   "hue": "#3C8DBC",
                                   "saturation": 89
                         }
                       },
                       {
                         "featureType": "water",
                         "elementType": "all",
                         "stylers": {
                                   "color": "#ffffff"
                         }
                       }
                   ]
                  map.setMapStyle({styleJson:styleJson});


      map.centerAndZoom(new BMap.Point(116.417854,39.921988), 5);
      //var data_info = [[116.417854,39.921988,"<a href='../equipmentmonitor/equipmentmonitor.html'>点击查看设备详情</a>"],
                      // [116.406605,39.921585,"<a href='../equipmentmonitor/equipmentmonitor.html'>点击查看设备详情</a>"],
                      // [116.412222,39.912345,"<a href='../equipmentmonitor/equipmentmonitor.html'>点击查看设备详情</a>"],
                      // [121.35671,31.141269,"<a href='../equipmentmonitor/equipmentmonitor.html'>点击查看设备详情</a>"]

      //];

      for(var i=0;i<data_info.length;i++){


          var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {

              offset: new BMap.Size(10, 25),                  // 指定定位位置
              imageOffset: new BMap.Size(0, 0 - i * 25)   // 设置图片偏移

          });
          if(data_info[i].addressid!=""&&data_info[i].addressid!=null){
              var marker = new BMap.Marker(new BMap.Point(data_info[i].addressid.split(",")[0],data_info[i].addressid.split(",")[1]),{icon: myIcon});  // 创建标注
          }else{
              var marker = new BMap.Marker(new BMap.Point(null,null),{icon: myIcon});  // 创建标注

          }
          var content = "<a href='../equipmentmonitor/equipmentmonitor.html'>点击查看设备详情</a>";

          map.addOverlay(marker);               // 将标注添加到地图中
          addClickHandler(content,marker);
      }
  }

  function addClickHandler(content,marker){
      marker.addEventListener("click",function(e){
          openInfo(content,e)}
      );
  }
  function openInfo(content,e){
      var opts = {
              width : 50,     // 信息窗口宽度
              height: 50,
              title : "离线" ,
              enableMessage:true//设置允许信息窗发送短息
             };
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
      map.openInfoWindow(infoWindow,point); //开启信息窗口
  }