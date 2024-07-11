import * as d3 from "d3"
import threeFactorData from "@/assets/data/threeFactorData.json"

export function cure(cur) {
    let key = Object.keys(threeFactorData)
    let data = threeFactorData[key[cur]]
    let width = document.querySelector(".cure-chart").offsetWidth,
        height = document.querySelector(".cure-chart").offsetHeight

    let svg = d3.select(".cure-chart")
        .append("svg")
        .attr("class", "cure-svg")
        .attr("width", width)
        .attr("height", height)
    //设置数据
    let angle = Math.PI / 2.5 //这个控制整体的倾斜度
    let radius1 = height / 5.7, radius2 = height / 5.7
    let cxCenter = width / 2 - 45, cyCenter = height / 2
    //只有五个圈的时候可以这样设置
    let circleData = [{ name: "身体的不适" }, { name: "诊断" }, { name: "病因" }, { name: "治疗第一步 饮食和起居" }, { name: "治疗第二步 药物和外治法" }]
    circleData.forEach((item, index) => {
        if (index % 2 == 0) {
            item.cx = cxCenter + (index - (circleData.length - 1) / 2) / 2 * ((radius1 + radius2) * (Math.sin(angle) + 1))
            item.cy = cyCenter + (index - (circleData.length - 1) / 2) / 2 * ((radius1 + radius2) * Math.cos(angle))
            item.radius = radius1
            if (index == 0) {
                item.startAngle = -(angle)
                item.endAngle = Math.PI - angle
            } else {
                item.startAngle = -Math.PI / 2
                item.endAngle = Math.PI - angle
            }
        } else {
            item.cx = circleData[index - 1].cx + (radius1 + radius2) * Math.sin(angle)
            item.cy = circleData[index - 1].cy + (radius1 + radius2) * Math.cos(angle)
            item.radius = radius2
            item.startAngle = Math.PI / 2
            item.endAngle = Math.PI * 2 - angle
        }
        let childrenLen = 0
        let itemData = data[Object.keys(data)[index + 1]]
        itemData.children.forEach((item1, index1) => {
            childrenLen += item1.children.length
        })
        item.childrenLen = childrenLen
    })
    circleData.forEach((item, index) => {
        let itemData = data[Object.keys(data)[index + 1]] //第index个圈的数据
        let totalAngle = item.endAngle - item.startAngle
        let intervalAngle = totalAngle / (item.childrenLen + 1)
        let tempSt = item.startAngle
        //给item添加数据 
        itemData.children.forEach((item1, index1) => {
            //设置起始角度和终止角度
            item1.startAngle = tempSt + intervalAngle / itemData.children.length + Math.PI / 30
            item1.endAngle = item1.startAngle + (item1.children.length) * intervalAngle - Math.PI / 30
            item1.angle = item1.startAngle + (item1.endAngle - item1.startAngle) / 2
            tempSt += (item1.children.length) * intervalAngle
            //设置外侧和内侧弧线的半径
            item1.radius = item.radius * 1.35
            item1.textRadius = item.radius * 0.95
            //计算文字的位置
            item1.tx = item.cx + item1.textRadius * Math.sin(item1.angle)
            item1.ty = item.cy - item1.textRadius * Math.cos(item1.angle)
            item1.children.forEach((item2, index2) => {
                let tempAngle = (item1.endAngle - item1.startAngle) / (item1.children.length)
                item2.angle = item1.startAngle + tempAngle * (index2 + 0.5)
                //每个圆的坐标
                item2.x = item.cx + item1.radius * 0.85 * Math.sin(item2.angle)
                item2.y = item.cy - item1.radius * 0.85 * Math.cos(item2.angle)
                //外侧文字的坐标
                item2.tx = item.cx + item1.radius * 1.10 * Math.sin(item2.angle)
                item2.ty = item.cy - item1.radius * 1.10 * Math.cos(item2.angle)
            })
        })
        item.data = itemData
    })
    //外侧的弧生成器
    let arc = d3.arc()
        .innerRadius((d) => d.radius)
        .outerRadius((d) => d.radius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
    //内侧的弧生成器
    let textArc = d3.arc()
        .innerRadius((d) => d.textRadius)
        .outerRadius((d) => d.textRadius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
    //画主要的路径
    let mainCircle = svg.append("g")
        .selectAll("path")
        .data(circleData)
        .enter()
        .append("path")
        .attr("stroke", "#DDF8D7")
        .attr("stroke-width", 3)
        .attr("d", arc)
        .attr("transform", (d) => `translate(${d.cx},${d.cy})`)
    //添加一个图片框查看大图
    let imageDetail = svg.append("image")
        .attr("width", 300)
        .attr("height", 300)
        .attr("x", 50)
        .attr("y", height / 2)
    let mainG = svg.append("g")
    let outerArc = mainG.append("g")
    let innerArc = mainG.append("g")
    let node = mainG.append("g").attr("class", "image-cure")
    let nodeText = mainG.append("g")
    let text = mainG.append("g")
    let centerCircle = mainG.append("g")
    let color = d3.scaleSequential(d3.interpolateYlOrBr)//颜色比例尺
    let cnt = 0
    circleData.forEach((item, index) => {
        item.data.children.forEach((item1, index1) => {
            //添加外侧长的弧线
            outerArc.append("path")
                .datum(item1)
                // .attr("stroke", color(0.3 + 0.005 * cnt))
                .attr("stroke", "#D6F4FF")
                .attr("stroke-width", 0)
                .attr("stroke-linecap", "round")
                .attr("d", arc)
                .attr("transform", (d) => `translate(${item.cx},${item.cy})`)
                .transition()
                .duration(500)
                .attr("stroke-width", 8)
            //添加内侧短的弧线
            innerArc.append("path")
                .datum(item1)
                .attr("id", `textPath-${index1}`)
                .attr("stroke", "#D6F4FF")
                .attr("stroke-width", 3)
                .attr("stroke-linecap", "round")
                .attr("d", textArc)
                .attr("transform", (d) => `translate(${item.cx},${item.cy})`)
            //添加每个小圆
            node.append("g")
                .selectAll("circle")
                .data(item1.children)
                .enter()
                .append("circle")
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
                .attr("r", 20)
                // .attr("fill", "rgba(238,121,24,0.7)")
                .attr("fill", "#ea9a5b")
            //添加每个小圆里的图片
            node.append("g")
                .selectAll("image")
                .data(item1.children)
                .enter()
                .append("image")
                .attr("x", (d) => d.x - 20)
                .attr("y", (d) => d.y - 20)
                .attr("opacity", 0)
                .attr("height", 40)
                .attr("width", 40)
                .attr("xlink:href", (d) => `image/diseaseImg/${d.image}.png`)
                .on("mouseover", function (d) {
                    imageDetail.attr("xlink:href", `image/diseaseImg/${d.image}.png`)
                })
                .transition()
                .duration(500)
                .attr("opacity", 1)
            //添加外侧每个节点文字
            nodeText.append("g")
                .selectAll("text")
                .data(item1.children)
                .enter()
                .append("text")
                .attr("font-size", 20)
                .attr("x", (d) => d.tx - d.text.length * 18)
                .attr("y", (d) => d.ty + 9)
                .text((d) => d.text)
                .attr("fill","#fff")
                .attr("transform", function (d) {
                    let rotateAngle = ((d.angle + Math.PI / 2) / Math.PI * 180) % 360
                    let translate = [0, 0]
                    if (rotateAngle > 90 && rotateAngle < 270) {
                        rotateAngle = (180 + rotateAngle) % 360
                        translate = [d.text.length * 18, 0]
                        return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.tx - d.text.length * 18},${d.ty})`
                    }
                    return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.tx},${d.ty})`
                })
                .attr("opacity", 0)
                .transition()
                .duration(500)
                .delay(cnt * 30)
                .attr("opacity", 1)
            //添加内侧文字
            text.append("text")
                .datum(item1)
                .attr("x", (d) => {
                    let rotateAngle = ((d.angle + Math.PI / 2) / Math.PI * 180) % 360
                    return d.tx + (rotateAngle > 90 && rotateAngle < 270 ? 10 : -10)
                })
                .attr("y", (d) => d.ty)
                .attr("font-size", 20)
                .text((d) => d.name)
                // .attr("opacity", 0)
                .attr("transform", function (d) {
                    let rotateAngle = ((d.angle + Math.PI / 2) / Math.PI * 180) % 360
                    let translate = [0, 0]
                    if (rotateAngle > 90 && rotateAngle < 270) {
                        rotateAngle = (180 + rotateAngle) % 360
                        translate = [-d.name.length * 20, 0]
                        return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.tx + d.name.length * 20},${d.ty})`
                    }
                    return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.tx},${d.ty})`
                })
                // .attr("fill", "rgb(169,60,3)")
                .attr("fill","#D6F4FF")
                .transition()
                .duration(500)
                .delay(cnt * 30)
                .attr("x", (d) => {
                    let rotateAngle = ((d.angle + Math.PI / 2) / Math.PI * 180) % 360
                    return d.tx + (rotateAngle > 90 && rotateAngle < 270 ? -10 : 10)
                })
                .attr("y", (d) => d.ty)
                .attr("opacity", 1)
            cnt++
        })

        centerCircle.append("circle")
            .datum(item)
            .attr("cx", (d) => d.cx)
            .attr("cy", (d) => d.cy)
            .attr("r", radius1 * 0.4)
            .attr("fill", "#fddcd3")

        let textArr = item.name.split(" ")
        console.log(textArr);
        textArr.forEach((item1, index1) => {
            centerCircle.append("text")
                .datum(item)
                .attr("font-size", 24)
                .attr("fill"," #516d92")
                .attr("x", (d) => d.cx - item1.length / 2 * 24)
                .attr("y", (d) => d.cy + index1 * 24)
                .text(item1)
        })
    })
}