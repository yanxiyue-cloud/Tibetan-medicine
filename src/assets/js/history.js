import * as d3 from "d3"
import historyData from "@/assets/data/historyData.json"
import person from "@/assets/data/person.json"
import bookData from "@/assets/data/bookData.json"

export function draw() {
    let width = document.querySelector(".test").offsetWidth,
        height = document.querySelector(".test").offsetHeight
    let margin = 100
    let axisRadius = (height - margin * 2) / 16
    let baseHeight = height - margin
    let timeDuration = 800
    let svg = d3.select(".history-chart").append("svg")
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'tSvg')
    let book = svg.append("g")

    //时间轴数据，从0开始计数，奇数向左，偶数向右
    let st = width / 4 - 170
    historyData.forEach((item, index) => {
        //添加书籍
        item.book = []
        for (let i = 0; i < bookData.length; i++) {
            if (bookData[i].stage == item.stage) {
                item.book.push(bookData[i])
            }
        }
        //添加人物
        item.people = []
        for (let i = 0; i < person.length; i++) {
            if (person[i].stage == item.stage) {
                item.people.push(person[i])
            }
        }
    })
    //计算相关节点坐标
    historyData.forEach((item, index) => {
        //每段时间轴所在的高度
        item.height = axisRadius * (index + 1) * 2
        //设置方向，1为向右
        let dir = index % 2 == 0 ? 1 : -1
        //过短的部分加长,len是时间轴长度
        let len = item.end - item.start
        let widthScale = dir == 1 ? width / 1250 : width / 900
        //第一根线太长，单独设置
        if (len > width * 0.8) {
            widthScale = width / 5000
        }

        if (len < 20) {
            len = 80
        } else if (len < 40) {
            len = 100
        }
        //设置起始和结束的x
        item.x1 = st
        item.x2 = st + dir * widthScale * len
        item.len = widthScale * len
        //st记录结束的位置，方便计算下一段时间轴
        st = item.x2
        //计算当前时间轴上每个事件的位置
        let eventInterval = item.len / (item.event.length + 1)
        item.event.forEach((item1, index1) => {
            item1.x = item.x1 + eventInterval * dir * (index1 + 1)
            // // 根据时间设置位置
            // item1.x = item.x1 + (item1.time - item.start) * widthScale * dir 
            item1.y = item.height
        })
        //添加藏族朝代
        if (item.dynasty) {
            item.dynasty.forEach((item2) => {
                item2.x = item.x1 + (item2.start - item.start) * widthScale * dir
                item2.y = item.height
            })
        }
        //添加汉族朝代
        if (item.hDynasty) {
            item.hDynasty.forEach((item3) => {
                item3.x = item.x1 + (item3.start - item.start) * widthScale * dir
                item3.y = item.height
            })
        }
        //计算书籍坐标
        let bookInterval = item.len / (item.book.length + 1)
        item.book.forEach((itemB, indexB) => {
            itemB.x = item.x1 + bookInterval * dir * (indexB + 1)
            // // 根据时间设置位置
            // itemB.x = item.x1 + (itemB.time - item.start) * widthScale * dir
            itemB.y = item.height
        })
        //计算人物坐标
        item.people.forEach((itemP, indexP) => {
            itemP.x = margin * 1.5 + (margin / 3 + 2) * (indexP + 1)
            itemP.y = item.height
        })
    });


    let timeAxis = svg.append("g")
        .selectAll(".timeAxis")
        .data(historyData)
        .enter()
        .append("path")
        .attr('class', "timeAxis")
        .attr('d', function (d, i) {
            return `M${d.x1},${d.height} H${d.x1}`
        })
        .attr("opacity", 0)
        .transition()
        .duration(timeDuration)
        .delay((d, i) => i * timeDuration)
        .attr('d', function (d, i) {
            return `M${d.x1},${d.height} H${d.x2}`
        })
        .attr("opacity", 1)
    //添加旁边的弧
    let desCir = svg.append("g")
        .selectAll(".desCir")
        .data(historyData)
        .enter()
        .append("path")
        .attr("class", "desCir")
        .attr("opacity", 0)
        .attr('d', function (d, i) {
            if (i == 8) {
                return
            }
            if (i % 2 == 0) {
                return `M${d.x2},${d.height} Q${d.x2 + axisRadius},${d.height} ${d.x2 + axisRadius},${d.height + axisRadius} 
                Q${d.x2 + axisRadius},${d.height + axisRadius * 2} ${d.x2},${d.height + axisRadius * 2}`
            } else {
                return `M${d.x2},${d.height} Q${d.x2 - axisRadius},${d.height} ${d.x2 - axisRadius},${d.height + axisRadius} 
                Q${d.x2 - axisRadius},${d.height + axisRadius * 2} ${d.x2},${d.height + axisRadius * 2} `
            }
        })
        .transition()
        .duration(300)
        .delay((d, i) => (i + 1) * timeDuration)
        .attr("opacity", 1)

    //添加时间刻度
    let mark = svg.append("g")
    mark.append("g")
        .selectAll(".mark")
        .data(historyData)
        .enter()
        .append("path")
        .attr("class", "mark")
        .attr("d", function (d) {
            return `M${d.x1},${d.height - 10} V${d.height - 10} M${d.x2},${d.height - 10} V${d.height - 10}`
        })
        .attr('stroke', "grey")
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr("opacity", 0)
        .transition()
        .duration(timeDuration)
        .delay((d, i) => i * timeDuration)
        .attr("d", function (d) {
            return `M${d.x1},${d.height - 10} V${d.height + 5} M${d.x2},${d.height - 10} V${d.height + 5}`
        })
        .attr("opacity", 1)

    mark.append("g")
        .selectAll(".dashPath")
        .data(historyData)
        .enter()
        .append("path")
        .attr("class", "dashPath")
        .attr("d", function (d) {
            return `M${d.x1},${d.height - 10} H${d.x1}`
        })
        .attr('stroke-width', 3)
        .attr("opacity", 0)
        .transition()
        .duration(timeDuration)
        .delay((d, i) => i * timeDuration)
        .attr("d", function (d) {
            return `M${d.x1},${d.height - 10} H${d.x2}`
        })
        .attr("opacity", 1)
    //添加时间文字
    mark.append("g")
        .selectAll(".sText")
        .data(historyData)
        .enter()
        .append("text")
        .attr("class", "sText")
        .attr("x", (d) => d.x1 - String(d.start).length * 8 / 2)
        .attr("y", (d) => d.height + 25)
        .text((d) => d.start < 0 ? `公元前${0 - d.start}年` : d.start)
        .attr("fill", "#fff")
        .attr("font-size", 18)
        .attr("font-weight", "bold")
        .attr("opacity", 0)
        .transition()
        .duration(timeDuration)
        .delay((d, i) => i * timeDuration)
        .attr("opacity", 1)
    mark.append("g")
        .selectAll(".eText")
        .data(historyData)
        .enter()
        .append("text")
        .attr("class", "eText")
        .attr("x", (d) => d.x2 - String(d.end).length * 8 / 2)
        .attr("y", (d) => d.height + 25)
        .text((d) => d.end)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .attr("fill", "#fff")
        .transition()
        .duration(timeDuration)
        .delay((d, i) => i * timeDuration)
        .attr("opacity", 1)

    //主线上悬浮框
    let lineTip = d3.select('.test')
        .append('div')
        .attr("class", "line-tooltip")
    lineTip.append("div")
        .attr("class", "text-describe")
    //添加事件节点
    let tooltip = d3.select(".tooltip")
    let event = svg.append("g")
    historyData.forEach((item, index) => {
        event.selectAll(".event")
            .data(item.event)
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 11)
            .attr("fill", "#fff")
            .attr('stroke', "grey")
            .attr('stroke-width', 3)
            .attr("opacity", 0)
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 15)
                    .attr("fill", "#5B7F55")
                let node = d3.select(this).node()
                let left = node.cx.baseVal.value,
                    top = node.cy.baseVal.value
                tooltip
                    .style("left", left - d.name.length * 24 / 2 + "px")
                    .style("top", top - 80 + "px")
                    .style("opacity", 1)
                tooltip.select(".content").text(d.name)
            })
            .on("mouseleave", function (d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 11)
                    .attr("fill", "white")
                d3.select('.node-text')
                    .remove()
                tooltip
                    .style("left", 0)
                    .style("top", 0)
                    .style("opacity", 0)
                tooltip.select(".content").text("")
            })
            .on('click', (d) => {
                d3.select(".eventDetailsWord")
                    .text(() => d.detail)

            })
            .transition()
            .duration(500)
            .delay((d, i) => index * timeDuration + 50 * i)
            .attr("opacity", 1)
    })
    //添加藏族朝代
    let dynasty = svg.append("g")
    let dynastyLength = 20  //朝代的线长 
    historyData.forEach((item, index) => {
        if (item.dynasty) {
            //画竖线
            // let dynastyLine = dynasty.append("g")
            // dynastyLine.selectAll(".line")
            //     .data(item.dynasty)
            //     .enter()
            //     .append("path")
            //     .attr("d", d => `M ${d.x} ${d.y} L ${d.x} ${d.y + dynastyLength}`)
            //     .attr('stroke', "grey")
            //     .attr('stroke-width', 1)
            // .attr('stroke-dasharray', '10 5')   虚线

            //添加图片
            let dynastyImg = dynasty.append("g")
            dynastyImg.selectAll(".dynasty-img")
                .data(item.dynasty)
                .enter()
                .append("image")
                .attr("class", "dynasty-img")
                .attr("xlink:href", 'image/history/dynasty.png')
                .attr("transform", (d) => {
                    let scale = 0.8
                    return `translate(${d.x - 26 * scale},${d.y + dynastyLength}),scale(${scale})`
                })
                .style("opacity", 0)
                .on("mouseover", function (d) {
                    tooltip.select(".content").text(d.lord)
                    let node = d3.select(this).node()
                    let left = node.transform.baseVal[0].matrix.e
                    let top = node.transform.baseVal[0].matrix.f
                    tooltip
                        .style("left", left - d.lord.length * 20 / 2 + "px")
                        .style("top", top - 80 + "px")
                        .style("opacity", 1)
                })
                .on("mouseleave", function (d) {
                    d3.select('.node-text').remove()
                    lineTip.style("display", "none");
                    lineTip.style('opacity', 0);
                    tooltip.select(".content").text("")
                    let node = d3.select(this).node()
                    let left = node.transform.baseVal[0].matrix.e
                    let top = node.transform.baseVal[0].matrix.f
                    tooltip
                        .style("left", 0 + "px")
                        .style("top", 0 + "px")
                        .style("opacity", 0)
                })
                .transition()
                .duration(500)
                .delay((d, i) => index * timeDuration + i * 50)
                .style("opacity", 1)

            //添加文字
            let dynastyText = dynasty.append("g")
            dynastyText.selectAll(".dynasty-text")
                .data(item.dynasty)
                .enter()
                .append("text")
                .attr('class', 'dynasty-text')
                .text((d) => d.lord.charAt(0))
                .attr('x', (d) => d.x - 14)
                .attr("y", (d) => d.y + dynastyLength + 27)
                .attr("opacity", 0)
                .style("pointer-events", "none")
                .transition()
                .duration(500)
                .delay((d, i) => index * timeDuration + 50 * i)
                .attr("opacity", 1)
        }

    })
    //添加汉族朝代
    let hDynasty = svg.append("g")
    let hDynastyLength = 25 //朝代向上的线长 

    historyData.forEach((item, index) => {
        if (item.hDynasty) {
            //添加朝代icon
            let hDynastySvg = hDynasty.append("g")
            hDynastySvg.selectAll(".image")
                .data(item.hDynasty)
                .enter()
                .append("image")
                .attr("class", "hDynasty-svg")
                .attr("xlink:href", 'image/history/hdynasty.png')
                .attr("transform", (d) => {
                    let scale = 0.8
                    return `translate(${d.x - 25 * scale},${d.y - hDynastyLength * 2}),scale(${scale})`
                })
                .style("opacity", 0)
                .on("mouseover", function (d) {
                    let node = d3.select(this).node()
                    let left = node.transform.baseVal[0].matrix.e
                    let top = node.transform.baseVal[0].matrix.f
                    lineTip.select(".text-describe").text(d.lord)
                    lineTip.style('display', 'block');
                    lineTip.style('opacity', 2);
                    lineTip.style('left', (left - 10) + 'px')
                        .style('top', (top - 40) + 'px');
                })
                .on("mouseleave", function (d) {
                    d3.select('.node-text')
                        .remove()
                    // d3.select('.detailRect')
                    //     .remove()
                    lineTip.style("display", "none");
                    lineTip.style('opacity', 0);
                })
                .transition()
                .duration(500)
                .delay((d, i) => index * timeDuration + i * 50)
                .style("opacity", 1)
            //添加文字
            let hDynastyText = hDynasty.append("g")
            hDynastyText.selectAll(".hDynasty-text")
                .data(item.hDynasty)
                .enter()
                .append("text")
                .attr('class', 'hDynasty-text')
                .text((d) => d.lord.charAt(0))
                .attr('x', (d) => d.x - 8)
                .attr("y", (d) => d.y - hDynastyLength * 2 + 30)
                .style("opacity", 0)
                .style("pointer-events", "none")
                .transition()
                .duration(500)
                .delay((d, i) => index * timeDuration + i * 50)
                .style("opacity", 1)
        }

    })
    //添加书籍
    let bookLength = 25  //朝上的书籍线长 
    historyData.forEach((item, index) => {
        if (item.book) {
            //添加书籍icon
            let bookSvg = book.append("g")
            bookSvg.selectAll(".book-svg")
                .data(item.book)
                .enter()
                .append("image")
                .attr("class", "book-svg")
                .attr("x", (d) => d.x - 26)
                .attr("y", (d) => d.y - bookLength * 1.5)
                .attr("xlink:href", 'image/history/book1.svg')
                .attr("opacity", 0)
                .on("mouseover", function (d) {
                    let book = d3.select(this).node()
                    lineTip.select(".text-describe").text(d.name)
                    lineTip.style('display', 'block');
                    lineTip.style('opacity', 2);
                    lineTip.style('left', (book.x.baseVal.value - d.name.length / 2 * 14) + 'px')
                        .style('top', (book.y.baseVal.value + 50) + 'px');
                })
                .on("mouseleave", function (d) {
                    d3.select('.node-text')
                        .remove()
                    lineTip.style("display", "none");
                    lineTip.style('opacity', 0);
                })
                .transition()
                .delay((d, i) => index * timeDuration + i * 50)
                .duration(timeDuration)
                .attr("opacity", 1)
        }

    })
    //历史名医以及重要人物
    let people = svg.append("g")
    let peopleYStart = axisRadius * 1
    let peopleYEnd = axisRadius * 19
    //历史人物时间轴
    let peopleAxis = people.append("g")
    let tipContent = d3.select(".tooltip").select(".content")
    tipContent.append("text")
    peopleAxis.append("path")
        .attr("class", "peopleYAxis")
        .attr("d", `M${margin * 1.5},${peopleYStart} V${peopleYStart}`)
        .attr('stroke-width', 7)
        .transition()
        .duration(8 * (timeDuration))
        .ease(d3.easeLinear)
        .attr("d", `M${margin * 1.5},${peopleYStart} V${peopleYEnd}`)

    peopleAxis.append("g")
        .selectAll("text")
        .data(historyData)
        .enter()
        .append("text")
        .text((d) => d.stage)
        .attr("fill", "rgb(97,135,113)")
        .attr("y", (d) => d.height + 5)
        .attr("x", (d) => margin * 1.5 - (d.stage.length + 1) * 20 - 5)
        .attr("font-size", 23)
    // .attr("fill", "rgb(71,52,36)")
    peopleAxis.append("g")
        .selectAll(".mark")
        .data(historyData)
        .enter()
        .append("path")
        .attr("class", "solidPath")
        .attr("d", function (d) {
            return `M${margin * 1.5},${d.height} H${margin * 1.5 + 10}`
        })
        .attr('stroke-width', 3)
    // 添加节点
    let peopleNode = people.append("g")
    let peopleImage = d3.select(".history-chart").append("g")

    historyData.forEach((item, index) => {
        if (item.people) {
            peopleNode.append("g")
                .selectAll("circle")
                .data(item.people)
                .enter()
                .append("circle")
                .attr("class", "peopleNode")
                .style("cursor", "pointer")
                .attr("r", 0)
                .attr("cx", (d) => d.x)
                .attr('cy', (d) => d.y)
                .attr("fill", "rgb(201,169,146)")
                .attr('stroke', d => {
                    if (d.sect == '南派') {
                        return "rgb(154,190,216)"
                    } else if (d.sect == '北派') {
                        return "rgb(255,244,153)"
                    } else {
                        return "rgb(175,156,150)"
                    }
                })
                .attr('stroke-width', 10)
                .transition()
                .delay((d, i) => index * timeDuration + i * 30)
                .duration(500)
                .attr("r", 15)

            let activeDivWidth = 20, activeDivHeight = 20,
                divWidth = 15, divHeight = 15
            peopleImage.append("g")
                .selectAll("div")
                .data(item.people)
                .enter()
                .append("div")
                .attr("class", "history-people-image")
                .style("width", `${divWidth * 2}px`)
                .style("height", `${divHeight * 2}px`)
                .style("left", (d) => d.x - divWidth + "px")
                .style("top", (d) => d.y - divHeight + "px")
                .style("background-image", (d) => {
                    if (d.image) {
                        return `url(/image/peopleImage/${d.image}.png)`
                    } else {
                        return `url(/image/peopleImage/presonNo.png)`
                    }
                })
                .style("opacity", 0)
                .on("mouseover", function (d, i) {
                    tipContent.text(d.name)
                    console.log(1);
                    d3.select(".tooltip")
                        .style('opacity', 1)
                        .style('left', (this.offsetLeft - 70) + 'px')
                        .style('top', (this.offsetTop - 60) + 'px');
                })
                .on("mouseleave", function (d) {
                    d3.select(".tooltip")
                        .style('opacity', 0)
                        .style("left", 0)
                        .style("top", 0);
                    tipContent.text("")
                })
                .on("click", function (d) {
                    d3.select(".test")
                        .append("svg")
                        .attr("class", "headPic")
                        .append("image")
                        .attr("class", "headPic-img")
                        .attr("xlink:href", `image/peopleImage/${d.image}.png`)
                })
                .transition()
                .duration(300)
                .delay((d, i) => index * timeDuration + 50 * i)
                .style("opacity", 1)
        }
    })


    //事件详情
    let eventDetails = d3.select(".eventDetails .contain")

    eventDetails.append("text")
        // .attr("transform", "translate(540,350)")
        .text("请在时间线上选择历史事件节点，这里显示详细事件描述")
        .attr("class", "eventDetailsWord")
        .style("font-size", "25px")
        .style("color", "#5d7851")
    //人物悬浮框
}
