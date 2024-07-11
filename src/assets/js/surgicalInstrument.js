import * as d3 from "d3"
import tool from "@/assets/data/tool.json"

export function autoToolImage(chartClassName, data, width, height) {
    let svg = d3.select(`.${chartClassName}`)
        .append("svg")
        .attr("class", `${chartClassName}-svg`)
        .attr("width", width)
        .attr("height", height)
    let imageWidth = 150
    let len = data.children.length
    let intervalX = width / (len)
    let tooltip = d3.select(".tool-tooltip")
    data.children.forEach((item, index) => {
        let num = item.children.length
        let imageHeight = (height - 50) / (num + 1)
        svg.append("g")
            .selectAll("image")
            .data(item.children)
            .enter()
            .append("image")
            .attr("width", imageWidth)
            .attr("height", imageHeight)
            .attr("x", intervalX * (index) + (intervalX - imageWidth) / 2)
            .attr("y", (d, i) => (i + 0.5) * imageHeight)
            .attr("xlink:href", (d) => `image/tool/${d.image}.png`)
            .on("mouseover", function (d, i) {
                let left = document.querySelector(`.${chartClassName}`).offsetLeft,
                    top = document.querySelector(`.${chartClassName}`).offsetTop
                tooltip
                    .style("left", left + intervalX * (index) + (intervalX - imageWidth) / 2 - (250 - imageWidth) / 2 + "px")
                    .style("top", top + (i + 1) * imageHeight + 30 + "px")
                    .style("opacity", 1)
                tooltip.select(".name").text(d.name)
                tooltip.select(".text").text(d.function)
            })
            .on("mouseleave", function (d, i) {
                tooltip
                    .style("left", 0)
                    .style("top", 0)
                    .style("opacity", 0)
                tooltip.select(".name").text(d.name)
                tooltip.select(".text").text(d.function)
            })
    });
    svg.append("text")
        .attr("font-size", 32)
        .attr("y", height - 50 + 32)
        .attr("x", width / 2 - (data.name.length + 1) * 32 / 2)
        .attr("fill", "#efe2dc")
        .text(`·${data.name}`)
}

export function toolChart(data) {
    console.log(data);
    let width = document.querySelector(".tool-chart").offsetWidth,
        height = document.querySelector(".tool-chart").offsetHeight,
        marginX = 85,
        marginY = 150
    let svg = d3.select(".tool-chart")
        .append("svg")
        .attr("class", "tool-total-chart")
        .attr("width", width)
        .attr("height", height)
    let totalBar = svg.append("g")
    let childrenBar = svg.append("g")

    //设置序数比例尺
    let xMark = [], xAxisNum = []
    let max = 0
    let intervalX = ((width - marginX * 2) / data.length)
    let barColor = ["#6877ae", "#689e90", "#bae0af", "#e3ad7f", "#dd754e", "#aa3a2c"]
    data.forEach((item, index) => {
        //设置序数比例尺
        xMark.push(item.name)
        xAxisNum.push(marginX + (index + 0.5) * intervalX)
        //找出数量最多是多少
        let cnt = 0
        item.children.forEach((item) => {
            cnt += item.children.length
        })
        if (cnt > max) {
            max = cnt
        }
        item.cnt = cnt
        item.color = barColor[index]
    })
    let xScale = d3.scaleOrdinal()
        .domain(xMark)
        .range(xAxisNum)
    let xTicks = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("stroke", "grey")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("d", (d) => `M${xScale(d.name)},${height - marginY + 10} V${height - marginY - 10}`)
    let xAxisPath = svg.append("path")
        .attr("stroke", "rgb(255,255,255)")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("d", `M${marginX},${height - marginY} H${width - marginX}`)
    let xText = svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("font-size", 20)
        .attr("fill", "rgb(241,243,244)")
        .attr("x", (d) => xScale(d.name) - d.name.length * 20 / 2)
        .attr("y", height - marginY + 30)
        .text((d) => d.name)

    //设置y轴比例尺
    let yAxisNum = [], temp = 0
    for (let i = 0; i < (max + 10) / 5; i++) {
        yAxisNum.push(temp)
        temp += 5
    }
    let yScale = d3.scaleLinear()
        .domain([0, yAxisNum[yAxisNum.length - 1]])
        .range([0, height - marginY * 2])
    let yTicks = svg.append("g")
        .selectAll("path")
        .data(yAxisNum)
        .enter()
        .append("path")
        .attr("stroke", "grey")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("d", (d, i) => `M${marginX},${height - marginY - (height - marginY * 2) / (yAxisNum.length - 1) * i} H${marginX - 10}`)
    let yAxisPath = svg.append("path")
        .attr("stroke", "rgb(255,255,255)")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("d", `M${marginX},${height - marginY} v${-(height - 2 * marginY)}`)
    let yText = svg.append("g")
        .selectAll("text")
        .data(yAxisNum)
        .enter()
        .append("text")
        .attr("font-size", 20)
        .attr("fill", "rgb(241,243,244)")
        .attr("x", marginX - 40)
        .attr("y", (d, i) => height - marginY - (height - marginY * 2) / (yAxisNum.length - 1) * i + 8)
        .text((d) => d)
    //添加总数的柱状图
    totalBar.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", (d, i) => `tool-rect tool-main-${i}`)
        .attr("x", (d) => xScale(d.name) - intervalX / 4)
        .attr("y", (d) => (height - marginY))
        .attr("fill", (d) => d.color)
        .attr("width", intervalX / 2)
        .attr("height", (d) => 0)
        .attr("opacity", 1)
        .on("mouseover", function (d, i) {
            let tooltip = d3.select(".tool-chart-tooltip")
            tooltip.style("left", xScale(d.name) - intervalX / 4 - (150 - intervalX / 2) / 2 + "px")
                .style("top", (height - marginY) - yScale(d.cnt) + 50 + "px")
                .style("opacity", 1)
            tooltip.select(".name").text(d.name)
            tooltip.select(".cnt").text("数量：" + d.cnt)
            //改变选中样式
            d3.selectAll(".tool-rect")
                .transition()
                .attr("opacity", 0.3)
            d3.selectAll(".tool-bar-text")
                .transition()
                .attr("opacity", 0.3)
            d3.select(`.tool-bar-text-${i}`)
                .transition()
                .attr("opacity", 1)
            d3.select(this)
                .transition()
                .attr("opacity", 1)
        })
        .on("mouseleave", function (d, i) {
            let tooltip = d3.select(".tool-chart-tooltip")
            tooltip.style("left", 0).style("top", 0).style("opacity", 0)
            tooltip.select(".name").text("")
            tooltip.select(".cnt").text("")
            d3.selectAll(".tool-rect")
                .transition()
                .attr("opacity", 1)
            d3.selectAll(".tool-bar-text")
                .transition()
                .attr("opacity", 1)
        })
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr("height", (d) => yScale(d.cnt))
        .attr("y", (d) => (height - marginY) - yScale(d.cnt))

    totalBar.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("font-size", 32)
        .attr("class", (d, i) => `tool-bar-text tool-bar-text-${i}`)
        .attr("x", (d) => xScale(d.name) - intervalX / 4 + (intervalX / 2 - (d.cnt >= 10 ? 32 : 16)) / 2)
        .attr("y", (d) => (height - marginY) - yScale(d.cnt) - 10)
        .text((d) => d.cnt)
        .attr("fill", (d) => d.color)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr("opacity", 1)
    //添加旁边每小类的矩形
    data.forEach((item, index) => {
        let curLen = 0
        let curG = childrenBar.append("g")
        item.children.forEach((item1, index1) => {
            let len = item1.children.length
            let curHeight = yScale(len)
            let curY = yScale(curLen)
            let color = [item.color, "#efe2dc"]
            let colorScale = d3.scaleLinear().range(color).domain([1, 10])
            let tooltip = d3.select(".tool-chart-tooltip")
            curG.append("rect")
                .attr("width", intervalX / 5)
                .attr("height", 0)
                .attr("class", "tool-rect")
                .attr("x", xScale(item.name) + intervalX / 3)
                .attr("y", (height - marginY))
                .attr("fill", colorScale(1 + index1 * 3))
                .attr("stroke", "rgba(255,255,255,0.1)")
                .attr("stroke-width", 3)
                .attr("opacity", 1)
                .on("mouseover", function (d, i) {
                    d3.selectAll(".tool-rect")
                        .transition()
                        .attr("opacity", 0.3)
                    d3.selectAll(".tool-bar-text")
                        .transition()
                        .attr("opacity", 0.3)
                    d3.select(`.tool-bar-text-${index}`)
                        .transition()
                        .attr("opacity", 1)
                    d3.select(this)
                        .transition()
                        .attr("opacity", 1)
                    tooltip.select(".name").text(item1.name)
                    tooltip.select(".cnt").text("数量：" + item1.children.length)
                    tooltip.style("left", xScale(item.name) + intervalX / 3 - (150 - intervalX / 5) / 2 + "px")
                        .style("top", (height - marginY) - yScale(item.cnt) + curY + 50 + "px")
                        .style("opacity", 1)
                })
                .on("mouseleave", function (d, i) {
                    d3.selectAll(".tool-rect")
                        .transition()
                        .attr("opacity", 1)
                    d3.selectAll(".tool-bar-text")
                        .transition()
                        .attr("opacity", 1)
                    tooltip.select(".name").text("")
                    tooltip.select(".cnt").text("")
                    tooltip.style("left", 0)
                        .style("top", 0)
                        .style("opacity", 0)
                })
                .transition()
                .duration(800)
                .ease(d3.easeCubicInOut)
                .attr("y", (height - marginY) - yScale(item.cnt) + curY)
                .attr("height", curHeight)

            curLen += len
        })
    })
}