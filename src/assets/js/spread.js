import * as d3 from 'd3';
import spreadData from "@/assets/data/spread.json";
import typeSvg from "@/assets/data/typeSvg.json"

export function spread(that) {
    let LhasaPoint = [90.02714, 31.10435]
    let width = document.querySelector(".spread .right .spread-container").offsetWidth;
    let height = document.querySelector(".spread .right .spread-container").offsetHeight;
    let svg = d3.select(".spread .right .spread-container")
        .append("svg")
        .attr('class', 'spread-svg')
        // .attr("transform", "translate(-300,0),scale(1.2)")
        .attr("width", width)
        .attr("height", height)
    let mapScale = 270, mapCenter = [0, 0]
    let map = svg.append("g")
    let china = svg.append("g")

    //添加时间轴、传播类别
    let time = ["启蒙时期", "奠基时期", "形成时期", "发展时期", "兴盛时期", "停滞时期", "复兴时期", "全新发展阶段", "现阶段"]
    d3.json("data/world.json").then((world) => {
        //生成地图path
        //地图投影
        let projection = d3.geoEquirectangular()
            .fitSize([width, height], world)
            .scale(mapScale)
            .translate([width / 2, height / 2])
            .center(mapCenter)

        let mapPathData = d3.geoPath()
            .projection(projection)
        let mapInitWidth = 0.5, matActiveWidth = 1.5

        map.selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", mapPathData)
            .attr('fill', (d) => '#BDA79E')
            .attr('stroke', 'grey')
            .attr('stroke-width', mapInitWidth)
            .on("mouseover", function (d, i) {
                const change = d3.select(this)
                    .transition()
                    .delay(100)
                    .duration(300)
                    .attr("stroke-width", matActiveWidth)
                    .attr('stroke', 'chocolate')
            })
            .on("mouseleave", function (d, i) {
                const change = d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("stroke-width", mapInitWidth)
                    .attr('stroke', 'grey')
            })
    })
    d3.json("data/china.json").then((data) => {
        let projection = d3.geoEquirectangular()
            .fitSize([width, height], data)
            .scale(mapScale)
            .translate([width / 2, height / 2])
            .center(mapCenter)
        //地图投影
        let mapPathData = d3.geoPath()
            .projection(projection)
        //地图线条粗细
        let mapInitWidth = 0.5
        //需要渲染的数组
        let pathArr = []
        let dropPath = mapPathData(data.features[0]).split("Z")[1]
        //去除地图最外侧边框
        data.features.forEach((item, index) => {
            let d = mapPathData(item)
            let arr = d.split("Z")
            let temp = ""
            arr.forEach((item1, index1) => {
                if (item1 == dropPath) {
                    return
                }
                temp += (item1 + "Z")
            })
            pathArr.push({
                d: temp,
                ...item
            })
        });
        //绘制地图
        china.selectAll("path")
            .data(pathArr)
            .enter()
            .append("path")
            .attr("class", "map-path")
            .attr("d", (d) => d.d)
            .attr('fill', (d) => 'rgb(189,167,158)')
            .attr('stroke', '#fff')
            .attr('stroke-width', mapInitWidth)
            .on("mouseover", function (d) {
                d3.select(this)
                    .classed("active", true)
            })
            .on("mouseleave", function (d) {
                d3.select(this)
                    .classed("active", false)
            })
    })
}

export function spreadBarChart() {
    let width = document.querySelector(".spread .left-top").offsetWidth,
        height = document.querySelector(".spread .left-top").offsetHeight
    //标题
    let barTitle = d3.select(".spread .left-top")
        .append("div").attr("class", "spread-bar-title")
        .append('text')
        .text('传播影响统计')
        .attr("class", "spread-bar-text")
    let svg = d3.select(".spread .left-top")
        .append("svg")
        .attr("class", "spread-bar-chart")
        .attr("width", width)
        .attr("height", height)
    //赛选每类数据
    let typeIndex = ["religion", "interact", "book", "medicine"],
        realType = ["宗教", "交流", "书籍", "医疗"]
    let data = [
        { name: "religion", children: [] },
        { name: "interact", children: [] },
        { name: "book", children: [] },
        { name: "medicine", children: [] }
    ]
    spreadData.forEach((item, index) => {
        data[typeIndex.indexOf(item.spreadType)].children.push(item)
    });
    //添加每类节点
    let intervalX = width / (data.length + 1)
    let basicY = height - height / 9
    let mainCircleR = 30
    let childrenColor = d3.scaleSequential(d3.interpolateRdYlGn);
    svg.append("path")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 3")
        .attr("d", `M${width / 10},${basicY - mainCircleR * 1.75} H${width - width / 10}`)
    data.forEach((item, index) => {
        let mianG = svg.append("g")
            .attr("class", `${item.name}-g`)
        mianG.append("circle")
            .datum(item)
            .attr("cx", intervalX * (index + 1))
            .attr("cy", basicY)
            .attr("class", (d) => `${d.name}-cirlce class-circle`)
            .attr("fill", "rgb(252,172,99)")
            .attr("r", (d) => mainCircleR / 25 * d.children.length * 2)
            .on("click", function (d) {
                //改变地图上路径和文字样式
                d3.selectAll(".spread-mark")
                    .transition()
                    .attr("opacity", 0.1)
                    .attr("fill", "rgb(255,112,1)")
                d3.selectAll(".spread-path")
                    .transition()
                    .attr("opacity", 0.1)
                    .attr("stroke", "rgb(222,225,230)")
                d3.selectAll(`.${d.name}`)
                    .transition()
                    .attr("stroke", "rgb(254,152,134)")
                    .attr("opacity", 0.8)
                d3.selectAll(`.${d.name}-circle`)
                    .transition()
                    .attr("opacity", 1)
                d3.selectAll(".spread-text")
                    .transition()
                    .attr("opacity", 0.1)
                d3.selectAll(`.${d.name}-text`)
                    .transition()
                    .attr("opacity", 1)
                //改变当前选择圆的样式
                d3.selectAll(".class-circle")
                    .transition()
                    .attr("fill", "rgb(252,172,99)")
                d3.select(this)
                    .transition()
                    .attr("fill", "rgb(254,152,134)")
            })
        mianG.append("text")
            .datum(item)
            .attr("font-size", 24)
            .attr("x", intervalX * (index + 1) - 24)
            .attr("y", basicY + mainCircleR * 2.5)
            .text((d) => realType[typeIndex.indexOf(d.name)])
            .attr("fill", "#f0f8ff")
        let childrenG = mianG.append("g")
            .attr("class", `${item.name}-item`)
        let scale = 0.025
        //添加每类的小节点和svg图
        childrenG.selectAll("circle")
            .data(item.children)
            .enter()
            .append("circle")
            .attr("fill", (d, i) => childrenColor(0.4 - i * 0.01))
            .attr("cx", intervalX * (index + 1))
            .attr("cy", (d, i) => basicY - mainCircleR * 2 - (mainCircleR * 1.2) * (i + 1) + scale * 512)
            .attr("r", scale * 512 * 1.3)
        childrenG.selectAll("path")
            .data(item.children)
            .enter()
            .append("path")
            .attr("fill", (d, i) => "white")
            .attr("d", (d) => typeSvg[d.spreadType])
            .attr("transform", (d, i) => {
                return `translate(${intervalX * (index + 1) - scale * 512},${basicY - mainCircleR * 2 - (mainCircleR * 1.2) * (i + 1)}),scale(${scale})`
            })
    })
}