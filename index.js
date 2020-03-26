var map = new BMap.Map("container");          // 创建地图实例

var point = new BMap.Point(113.003595, 28.224157);
map.centerAndZoom(point, 18);             // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放


var data = {7: {'综合楼': 7, '实验楼': 2, '老图书馆': 1, '电磁楼': 0}, 8: {'综合楼': 26, '实验楼': 26, '老图书馆': 5, '电磁楼': 1}, 9: {'综合楼': 35, '实验楼': 30, '老图书馆': 10, '电磁楼': 3}, 10: {'综合楼': 36, '实验楼': 32, '老图书馆': 10, '电磁楼': 4}, 11: {'综合楼': 27, '实验楼': 22, '老图书馆': 9, '电磁楼': 6}, 12: {'综合楼': 7, '实验楼': 13, '老图书馆': 7, '电磁楼': 2}, 13: {'综合楼': 8, '实验楼': 14, '老图书馆': 8, '电磁楼': 3}, 14: {'综合楼': 17, '实验楼': 23, '老图书馆': 8, '电磁楼': 4}, 15: {'综合楼': 22, '实验楼': 28, '老图书馆': 5, '电磁楼': 4}, 16: {'综合楼': 17, '实验楼': 27, '老图书馆': 7, '电磁楼': 4}, 17: {'综合楼': 6, '实验楼': 10, '老图书馆': 1, '电磁楼': 2}, 18: {'综合楼': 3, '实验楼': 3, '老图书馆': 1, '电磁楼': 1}, 19: {'综合楼': 3, '实验楼': 1, '老图书馆': 0, '电磁楼': 1}, 20: {'综合楼': 3, '实验楼': 1, '老图书馆': 0, '电磁楼': 1}, 21: {'综合楼': 1, '实验楼': 0, '老图书馆': 0, '电磁楼': 0}, 22: {'综合楼': 0, '实验楼': 0, '老图书馆': 0, '电磁楼': 0}}

var points = [
    {name: "实验楼", lng: 113.002547, lat: 28.223079, count: 32},
    {name: "综合楼", lng: 113.002601, lat: 28.223533, count: 36},
    {name: "老图书馆", lng: 113.004011, lat: 28.225418, count: 10},
    {name: "电磁楼", lng: 113.002169, lat: 28.224631, count: 4},
    {name: "北斗", lng: 113.003562, lat: 28.224527, count: 0}
];

var count = 0;

//判断浏览区是否支持canvas
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

if (!isSupportCanvas()) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
}
//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
/* visible 热力图是否显示,默认为true
 * opacity 热力的透明度,1-100
 * radius 势力图的每个点的半径大小
 * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
 *	{
        .2:'rgb(0, 255, 255)',
        .5:'rgb(0, 110, 255)',
        .8:'rgb(100, 0, 255)'
    }
    其中 key 表示插值的位置, 0~1.
        value 为颜色值.
 */
heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 50});   // 设置圈大小
map.addOverlay(heatmapOverlay);
heatmapOverlay.setDataSet({data: points, max: 20});
//是否显示热力图
//    function openHeatmap(){
//        heatmapOverlay.show();
//    }
//	function closeHeatmap(){
//        heatmapOverlay.hide();
//    }
//	closeHeatmap();
function setGradient() {
    /*格式如下所示:
    {
        0:'rgb(102, 255, 0)',
        .5:'rgb(255, 170, 0)',
        1:'rgb(255, 0, 0)'
    }*/
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors, 0);
    colors.forEach(function (ele) {
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay.setOptions({"gradient": gradient});
}


function ComplexCustomOverlay(point, text, mouseoverText) {
    this._point = point;
    this._text = text;
    this._overText = mouseoverText;
}

ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.height = "18px";
    div.style.padding = "2px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px"
    var span = this._span = document.createElement("span");
    div.appendChild(span);
    span.appendChild(document.createTextNode(this._text));
    var that = this;

    var arrow = this._arrow = document.createElement("div");
    arrow.style.background = "url(//map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
    arrow.style.position = "absolute";
    arrow.style.width = "11px";
    arrow.style.height = "10px";
    arrow.style.top = "22px";
    arrow.style.left = "10px";
    arrow.style.overflow = "hidden";
    div.appendChild(arrow);

    div.onmouseover = function () {
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#0000ff";
        this.getElementsByTagName("span")[0].innerHTML = that._overText;
        arrow.style.backgroundPosition = "0px -20px";
    }

    div.onmouseout = function () {
        this.style.backgroundColor = "#EE5D5B";
        this.style.borderColor = "#BC3B3A";
        this.getElementsByTagName("span")[0].innerHTML = that._text;
        arrow.style.backgroundPosition = "0px 0px";
    }

    map.getPanes().labelPane.appendChild(div);

    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
}


var mouseoverTxt, myCompOverlay;
function addLay(points){
    for (i = 0; i < points.length; i++) {

        mouseoverTxt = points[i].name + "  " + parseInt(points[i].count) + "人";

        myCompOverlay = new ComplexCustomOverlay(new BMap.Point(points[i].lng, points[i].lat), mouseoverTxt, mouseoverTxt);
        
        heatmapOverlay.setDataSet({data: points, max: 20});
        map.addOverlay(heatmapOverlay);
        map.addOverlay(myCompOverlay);
        
    }
}

addLay(points); // 将最新的数据添加到底图

//  滑块数据调取  JS

var slider = document.getElementById("myRange");
var date = document.getElementById('date');
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
var undefinedPoint = {'综合楼': 0, '实验楼': 0, '老图书馆': 0, '电磁楼': 0};

slider.oninput = function () {
    count = 0;
    map.clearOverlays();  // 清空底图上的所有覆盖物
    let point = data[this.value];

    // 更新时间
    if(this.value < 10){
        let hour = "0"+this.value+":00";
        date.value = date.value.replace(/(\d+):(\d+)/,hour);
    }else{
        let hour = this.value+":00";
        date.value = date.value.replace(/(\d+):(\d+)/,hour);
    }

    if(point === undefined){
        for(let key in undefinedPoint){
            points.forEach(item => {
                if(item.name == key){
                    item.count = undefinedPoint[key];
                    count = 0;
                }
            })

            var countE = document.getElementById('count');
            countE.value = count;

            addLay(points);
        }
    }else{
        for(let key in point){
            points.forEach(item => {
                if(item.name == key){
                    item.count = point[key];
                    count += item.count;
                }
            })
            
            var countE = document.getElementById('count');
            countE.value = count;
            // console.log(countE.value)

            addLay(points);
        }
    }
   
}

date.oninput = function(){
    let hour = this.value.substr(11,2);
    slider.value = hour;
    slider.oninput();
}


