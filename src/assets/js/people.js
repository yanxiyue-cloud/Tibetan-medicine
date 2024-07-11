import * as d3 from "d3"
import person from "@/assets/data/person.json"

export function drawPeople(that) {
    let width = document.querySelector(".people-chart").offsetWidth
    let height = document.querySelector(".people-chart").offsetHeight
    let interval = Math.PI * 2 / person.length  //每个人物占据的角度
    let timeRadius = height / 3.5  //里面时间轴的半径,后面的圆的半径都根据这个
    let personR = 15 //人物头像半径
    let peopleRadius = timeRadius * 1.1
    let bookR = 5
    let bookRadius = (peopleRadius + personR * 2.5)
    let achievementR = 10
    let achievementRadius = (peopleRadius + personR * 3)
    let arcMargin = Math.PI / 150//每段弧之间的间距
    let svg = d3.select(".people-chart ")
        .append("svg")
        .attr("class", "people-svg")
        .attr("width", width)
        .attr('height', height)
    //时期数据
    let stage = [
        { name: "启蒙时期", num: 0 },
        { name: "奠基时期", num: 0 },
        { name: "形成时期", num: 0 },
        { name: "发展时期", num: 0 },
        { name: "兴盛时期", num: 0 },
        { name: "停滞时期", num: 0 },
        { name: "复兴时期", num: 0 },
        { name: "全新发展阶段", num: 0 },
        { name: "现阶段", num: 0 }
    ]
    //将人物根据时间排序
    person.sort((a, b) => stage.indexOf(a.stage) - stage.indexOf(b.stage));
    //计算人物节点位置
    person.forEach((item, index) => {
        for (let i = 0; i < stage.length; i++) {
            if (stage[i].name == item.stage) {
                stage[i].num++
            }
        }
        //每个人物节点位置
        item.angle = interval * (index + 0.5)
        item.x = width / 2 + peopleRadius * Math.sin(item.angle)
        item.y = height / 2 - peopleRadius * Math.cos(item.angle)
        //关系连线的位置
        item.linkX = width / 2 + timeRadius * 1 * Math.sin(item.angle)
        item.linkY = height / 2 - timeRadius * 1 * Math.cos(item.angle)
        //书籍中心位置
        item.bookX = width / 2 + (peopleRadius + personR) * Math.sin(item.angle)
        item.bookY = height / 2 - (peopleRadius + personR) * Math.cos(item.angle)
        //每个人物书籍起始角度、终止角度
        let bookMargin = Math.PI * 2 / 180
        item.bookStart = item.angle - (item.book.length - 1) / 2 * bookMargin//每个人物书籍起始角度
        item.book.forEach((item1, index1) => {
            item1.angle = item.bookStart
            item1.x = width / 2 + bookRadius * Math.sin(item.bookStart)
            item1.y = height / 2 - bookRadius * Math.cos(item.bookStart)
            item1.link = {
                source: [item1.x, item1.y],
                target: [item.bookX, item.bookY]
            }
            item.bookStart += bookMargin
        })
    })
    //计算人物关系连线
    person.forEach((item, index) => {
        if (item.relation.length) {
            item.relation.forEach((item1, index1) => {
                for (let i = 0; i < person.length; i++) {
                    if (person[i].id == item1.target) {
                        item1.link = {
                            source: [item.linkX, item.linkY],
                            target: [person[i].linkX, person[i].linkY]
                        }
                    }
                }
            })
        }
    })
    //设置时间轴
    let timeArc = d3.arc()
        .innerRadius(timeRadius)
        .outerRadius(timeRadius)
    //画时间轴
    let st = 0
    var blues = d3.scaleOrdinal(d3.schemeCategory10);//时间轴颜色
    var piyg = d3.scaleSequential(d3.interpolatePuOr);//人物颜色
    let timeCircle = svg.append("g")
    timeCircle.selectAll("path")
        .data(stage)
        .enter()
        .append("path")
        .attr("stroke-width", 5)
        .attr("stroke", (d, i) => blues(i))
        .attr("stroke-linecap", "round")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .attr("d", (d) => {
            timeArc.startAngle(st + arcMargin)
                .endAngle(st + d.num * interval - arcMargin)
            //算出每段弧的中心角度
            d.centerAngle = st + (d.num * interval) / 2
            st += d.num * interval
            return timeArc(d)
        })

    //添加中心头像div
    let headDiv = d3.select(".people-chart")
        .append("div")
        .style("position", "absolute")
        .style("border-radius", `50%`)
        .style("border", `3px solid grey`)
        .style("width", `${timeRadius * 0.8}px`)
        .style("height", `${timeRadius * 0.9}px`)
        .style("left", `${width / 2 - timeRadius * 0.8 / 2}px`)
        .style("top", `${height / 2 - timeRadius / 2}px`)
        .style("background-position", `center`)
        .style("background-repeat", `no-repeat`)
        .style("background-size", "100%")
        .style("background-image", `url(/image/peopleImage/${person[4].image}.png)`)
    let peopleName = svg.append("text")
        .datum(person[4])
        .attr("font-size", 24)
        .attr("x", (d) => width / 2 - d.name.length / 2 * 24)
        .attr("y", height / 2 + timeRadius / 2)
        .text((d) => d.name)
        .attr("fill","white")
        
    //添加人物头像还有关系连线
    let linkG = svg.append("g")
    let personG = svg.append("g")
    personG.selectAll("circle")
        .data(person)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d, i) => piyg(0.8 + 0.002 * i))
        .attr("r", personR)
        .on("click", (d, i) => {
            console.log(that);
            headDiv.style("background-image", `url(image/peopleImage/${d.image}.png)`)
            peopleName.text(that.name)
            that.curPeople = i
        })
    let link = d3.linkRadial()
        .radius(peopleRadius)
        .angle(function (d) {
            return d.angle
        })
    person.forEach((item) => {
        //画连接线
        if (item.relation.length) {
            linkG.append("g")
                .selectAll("path")
                .data(item.relation)
                .enter()
                .append("path")
                .attr("class", (d) => `link-${item.id}`)
                .attr("stroke", "grey")
                .attr("stroke-width", 2)
                .attr("d", (d) => {
                    let q = [((d.link.source[0] + d.link.target[0]) / 2 + width / 2) / 2, ((d.link.source[1] + d.link.target[1]) / 2 + height / 2) / 2]
                    return `M${d.link.source[0]},${d.link.source[1]} Q${q[0]},${q[1]} ${d.link.target[0]},${d.link.target[1]}`
                })
                .attr("fill", "none")
        }
    })
    let bookLink = svg.append("g")
    let bookTitle = svg.append("g")
    let bookG = svg.append("g")
    person.forEach((item) => {
        if (item.book.length) {
            bookLink.append("g")
                .selectAll("path")
                .data(item.book)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "grey")
                .attr("stroke-width", 2)
                .attr("d", (d) => `M${d.link.target[0]},${d.link.target[1]} Q${(item.x + d.link.source[0]) / 2},${(item.y + d.link.source[1]) / 2} ${d.x},${d.y}`)
            bookG.append("g")
                .selectAll("circle")
                .data(item.book)
                .enter()
                .append("circle")
                .attr("r", bookR)
                .attr("fill", (d, i) => piyg(0.9 + 0.01 * i))
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
            let bookFontSize = 16
            bookTitle.append("g")
                .selectAll("text")
                .data(item.book)
                .enter()
                .append("text")
                .attr("text-align", "right")
                .attr("font-size", bookFontSize)
                .attr("transform", function (d) {
                    let rotateAngle = (-Math.PI / 2 + d.angle) / Math.PI * 180
                    let translate = [0, 0]
                    if (rotateAngle > 90) {
                        translate = [-d.name.length * bookFontSize, 0]
                        rotateAngle += 180
                        return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x + d.name.length * bookFontSize},${d.y})`
                    }
                    return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x},${d.y})`
                })
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y)
                .text((d) => d.name)
                .attr("fill","white")
        }
    })

    let example = svg.append("g")
    let exampleBook = [1, 2, 3]
    //图例连线
    example.append("g")
        .selectAll("path")
        .data(exampleBook)
        .enter()
        .append("path")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("d", (d, i) => `M${width / 5 * 4},${height / 10 * 9} L${width / 5 * 4 + 45 + i % 2 * 5},${height / 10 * 9 - 20 + i * 20}`)
        .attr("fill", "none")
    //图例节点
    example.append("circle")
        .attr("fill", piyg(0.8))
        .attr("r", personR)
        .attr("cx", width / 5 * 4)
        .attr("cy", height / 10 * 9)
    example.append("g")
        .selectAll("circle")
        .data(exampleBook)
        .enter()
        .append("circle")
        .attr("fill", piyg(0.9))
        .attr("r", bookR)
        .attr("cx", (d, i) => width / 5 * 4 + 45 + i % 2 * 5)
        .attr("cy", (d, i) => height / 10 * 9 - 20 + i * 20)
    example.append("text")
        .attr("x", width / 5 * 4 - 18)
        .attr("y", height / 10 * 9 + personR * 2)
        .attr("font-size", 18)
        .text("名医")
        .attr("fill","white")
    example.append("text")
        .attr("x", width / 5 * 4 + 55)
        .attr("y", height / 10 * 9 + 8)
        .attr("font-size", 18)
        .text("著作")
        .attr("fill","white")
}