import * as d3 from "d3"
import treeData from "@/assets/data/treeData.json"

export function lifeTree(that) {
    let width = document.querySelector(".tree-chart").offsetWidth * 0.6,
        height = document.querySelector(".tree-chart").offsetHeight,
        realWidth = document.querySelector(".tree-chart").offsetWidth
    let basicRadius = width / 2.5
    //设置人体部位数据
    let bodyPart = ['肉', '骨', '头', '胸', '心脏', '肠胃', '肛门', '肝脏', '眼睛', '皮肤', '舌', '关节']
    let bodyData = [
        {
            name: "肉",
            x: realWidth * 0.72,
            y: height * 0.43
        },
        {
            name: "骨",
            x: realWidth * 0.71,
            y: height * 0.5
        },
        {
            name: "头",
            x: realWidth * 0.79,
            y: height * 0.18
        },
        {
            name: "胸",
            x: realWidth * 0.76,
            y: height * 0.40
        },
        {
            name: "心脏",
            x: realWidth * 0.82,
            y: height * 0.41
        },
        {
            name: "肠胃",
            x: realWidth * 0.798,
            y: height * 0.6
        },
        {
            name: "肛门",
            x: realWidth * 0.793,
            y: height * 0.75
        },
        {
            name: "肝脏",
            x: realWidth * 0.76,
            y: height * 0.5
        },
        {
            name: "眼睛",
            x: realWidth * 0.77,
            y: height * 0.215
        },
        {
            name: "皮肤",
            x: realWidth * 0.7,
            y: height * 0.6
        },
        {
            name: "舌",
            x: realWidth * 0.788,
            y: height * 0.28
        },
        {
            name: "关节",
            x: realWidth * 0.68,
            y: height * 0.85
        }
    ]
    let svg = d3.select(".tree-chart").append("svg")
        .attr("class", "life-tree-svg")
        .attr("width", realWidth)
        .attr("height", height)
    let state = d3.select(".state")
    //人体图
    let bodyImage = svg.append("g")
        .append("image")
        .attr("x", realWidth * 0.6)
        .attr("y", 10)
        .attr("width", realWidth * 0.4)
        .attr("height", height)
        .attr("xlink:href", "image/body1.png")
    //人体图上各部位的圆点
    let bodyPartG = svg.append("g")
    bodyPartG.selectAll("circle")
        .data(bodyData)
        .enter()
        .append("circle")
        .attr("class", (d, i) => `body-part-${i}`)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 10)
        .attr("fill", "rgb(128,128,128)")
        .attr("opacity", 0.5)
    bodyPartG.selectAll("text")
        .data(bodyData)
        .enter().append("text")
        .attr("class", (d, i) => `body-text-${i}`)
        .attr("font-size", 18)
        .attr("x", (d) => d.x - d.name.length * 18 / 2)
        .attr("y", (d, i) => d.y + 6)
        .text((d) => d.name)
        .attr("fill", "white")
        .attr("opacity", 0)
    //树根部分
    //初始化树的布局
    let initTreeData = d3.hierarchy(treeData.foods)
    let initTreeSet = d3.tree()
        .size([360, basicRadius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
    initTreeSet(initTreeData)
    //变成径向布局
    initTreeData.each((item) => {
        let x1 = item.x
        let scale = 2.2
        item.r = basicRadius / 4.2 * item.depth
        item.angle = x1 / (180 * scale) * Math.PI + (Math.PI - Math.PI / scale)
        item.x = width / 2 + item.r * Math.sin(item.angle)
        item.y = height / 2 * 1.1 - item.r * Math.cos(item.angle)
    })
    let node = initTreeData.descendants()
    let link = initTreeData.links()
    //树干
    let trunk = svg.append("g")
    let trunkX1 = node[0].x - 20,
        trunkX2 = node[0].x + 20,
        trunkBottom = height / 2,
        trunkTop = height / 2.5,
        trunkMid = (trunkBottom + trunkTop) / 2,
        trunkRootX1 = width / 2 - basicRadius,
        trunkRootX2 = width / 2 + basicRadius
    //树干左右两条线的控制点
    let trunkPathLeft = [
        [trunkRootX1, trunkBottom * 1.3], //起点
        [trunkRootX1 + 100, trunkBottom * 1.2],
        [trunkX1 - 100, trunkBottom * 1.15],
        [trunkX1, trunkBottom],
        [trunkX1, trunkTop],
        [(trunkX1 + width / 3) / 2, (trunkTop + height / 4) / 2],
        [width / 3 + 20, height / 4 + 70]
    ]
    let trunkPathRight = [
        [trunkRootX2, trunkBottom * 1.3], //起点
        [trunkRootX2 - 100, trunkBottom * 1.2],
        [trunkX2 + 100, trunkBottom * 1.15],
        [trunkX2, trunkBottom],
        [trunkX2, trunkTop],
        [(trunkX2 + width / 3 * 2) / 2, (trunkTop + height / 4) / 2],
        [width / 3 * 2 - 20, height / 4 + 70]
    ]
    let trunkPathMid1 = [
        [trunkX1 - 50, trunkBottom + 50],
        [trunkX1 + 20, trunkBottom],
        [trunkX1 + 10, trunkTop - 100],
        [width / 3 + 150, height / 4]
    ]
    let trunkPathMid2 = [
        [trunkX2 + 50, trunkBottom + 50],
        [trunkX2 - 20, trunkBottom],
        [trunkX2 - 10, trunkTop - 100],
        [width / 3 * 2 - 150, height / 4]
    ]
    let trunkPath = d3.line()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveBasis)
    let trunkColor = "rgb(255,255,205)"
    trunk.append("path")
        .attr("stroke-width", 0)
        .attr("stroke", trunkColor)
        .attr("stroke-linecap", "round")
        .attr("fill", "none")
        .attr("d", trunkPath(trunkPathLeft))
        .transition()
        .duration(1000)
        .attr("stroke-width", 3)
    trunk.append("path")
        .attr("stroke-width", 0)
        .attr("stroke", trunkColor)
        .attr("stroke-linecap", "round")
        .attr("fill", "none")
        .attr("d", trunkPath(trunkPathRight))
        .transition()
        .duration(1000)
        .attr("stroke-width", 3)
    trunk.append("path")
        .attr("stroke-width", 0)
        .attr("stroke", trunkColor)
        .attr("stroke-linecap", "round")
        .attr("fill", "none")
        .attr("d", trunkPath(trunkPathMid1))
        .transition()
        .delay(1000)
        .duration(1000)
        .attr("stroke-width", 3)
    trunk.append("path")
        .attr("stroke-width", 0)
        .attr("stroke", trunkColor)
        .attr("stroke-linecap", "round")
        .attr("fill", "none")
        .attr("d", trunkPath(trunkPathMid2)).transition()
        .delay(1000)
        .duration(1000)
        .attr("stroke-width", 3)
    //画树根
    let treeRootR = 6
    let treeRootLink = svg.append("g")
    let treeRootNode = svg.append("g")
    let foodActiveR = 8
    let foodActiveColor = "rgb(255,231,147)"
    let nodeColor = d3.scaleSequential(d3.interpolateBuPu);
    treeRootNode.selectAll("circle")
        .data(node)
        .enter()
        .append("circle")
        .attr("class", (d) => {
            if (d.data.id) {
                return `tree-root-circle tree-food-${d.data.id}`
            }
            return `tree-root-circle`
        })
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => {
            if (d.depth == 0) {
                return treeRootR - 1
            } else {
                return treeRootR
            }
        })
        .attr("fill", (d) => nodeColor(0.1 + d.depth * 0.1))
    // .attr("fill","#fdf1df")
    treeRootLink.selectAll("path")
        .data(link)
        .enter()
        .append("path")
        .attr("class", "tree-root-link")
        .attr("stroke-width", (d) => {
            if (d.target.children) {
                return treeRootR / 2
            } else {
                return 1
            }
        })
        .attr("stroke", trunkColor)
        .attr("stroke-linecap", "round")
        .attr("fill", trunkColor)
        .attr("d", (d) => {
            let curve = d.source.depth % 2 ? 10 : -10
            if (d.target.children) {
                return `M${d.source.x},${d.source.y} Q${d.source.x},${d.source.y} ${d.source.x},${d.source.y}`
            } else {
                return `M${d.source.x - treeRootR / 2},${d.source.y}
                Q${d.source.x},${d.source.y} ${d.source.x},${d.source.y}
                Q${d.source.x},${d.source.y} ${d.source.x},${d.source.y}`
            }
        })
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .delay((d) => d.target.depth * 300)
        .attr("d", (d) => {
            let curve = d.source.depth % 2 ? 10 : -10
            if (d.target.children) {
                return `M${d.source.x},${d.source.y} Q${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2 + curve} ${d.target.x},${d.target.y}`
            } else {
                return `M${d.source.x - treeRootR / 2},${d.source.y} 
                Q${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2 + curve} ${d.target.x},${d.target.y}
                Q${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2 + curve} ${d.source.x + treeRootR / 2},${d.source.y}`
            }
        })
    //添加根部文字
    treeRootNode.append("g")
        .selectAll("path")
        .data(node)
        .enter()
        .append("text")
        .attr("x", (d) => {
            let rotateAngle = (-Math.PI / 2 + d.angle) / Math.PI * 180
            if (rotateAngle > 90) {
                return d.x - 10
            } else {
                return d.x + 10
            }
        })
        .attr("y", (d) => d.y + 4)
        .text((d) => {
            if (d.children) {
                return
            }
            return d.data.name
        })
        .attr("font-size", 16)
        .attr("fill", "#f0f8ff")
        .attr("transform", function (d) {
            let rotateAngle = (-Math.PI / 2 + d.angle) / Math.PI * 180
            let translate = [0, 0]
            if (rotateAngle > 90) {
                translate = [-d.data.name.length * 16, 0]
                rotateAngle += 180
                return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x + d.data.name.length * 16},${d.y})`
            }
            return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x},${d.y})`
        })
    //树叶部分
    //生命三因
    let lifeColor = '#FF8272'
    let categoryColor = ["#D2B48C", "#E07142", "#FFBEC6"]
    let materialColor = "#1d588c",
        materialChildrenColor = "#9ab5a7"
    let impurityColor = "#da9b32",
        impurityChildrenColor = "#A4675E"

    let lifeData = treeData.life
    let lifeMainR = 80, lifeSecondR = lifeMainR / 2
    let lifeMainInterval = Math.PI / (lifeData.children.length - 0.5)
    lifeData.x = width / 2
    lifeData.y = height / 5
    lifeData.children.forEach((item, index) => {
        item.angle = lifeMainInterval * (index - 1)
        item.x = lifeData.x + lifeMainR * 1.6 * Math.sin(item.angle)
        item.y = lifeData.y - lifeMainR * 1.6 * Math.cos(item.angle)
        //二级子节点的开始和结束角度
        item.startAngle = item.angle - Math.PI / 6 * 5
        item.endAngle = item.angle + Math.PI / 6 * 5
        let control = 2
        let smallAngle = (Math.PI / 3 * 5) / (item.category.length + control)
        item.category.forEach((item1, index1) => {
            item1.angle = item.startAngle + smallAngle * (index1 + (control + 1) * 0.5) - smallAngle / 1.5 * (index - 1)
            item1.x = item.x + lifeSecondR * 1.6 * Math.sin(item1.angle)
            item1.y = item.y - lifeSecondR * 1.6 * Math.cos(item1.angle)
        })
    });
    //添加三因主节点life
    let life = svg.append("g")
    life.append("g")
        .append("circle")
        .datum(lifeData)
        .attr("r", 0)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", lifeColor)
        .on("mouseover", function (d, i) {
            let tooltip = d3.select(".life-tooltip")
            tooltip.style("opacity", 1)
            tooltip.select(".name").text("隆、赤巴、培根被称为生命的三因，三者配合正常则身体健康无病，三者发生紊乱则疾病随之产生。因此，隆、赤巴、培根既指身体功能，又指疾病名称。用来指身体功能时，三者分别对应汉语的气、火、土和水。").style("color", "rgb(93, 120, 81)")
            // tooltip.select(".text").text(111)
        })
        .on("mouseleave", function (d, i) {
            let tooltip = d3.select(".life-tooltip")
            tooltip.style("opacity", 0)
            tooltip.select(".name").text("")
        })
        .transition()
        .duration(1000)
        .attr("r", lifeMainR)


    life.append("text")
        .datum(lifeData)
        .attr("font-size", 28)
        .attr("x", (d) => d.x - d.name.length / 2 * 28)
        .attr("y", (d) => d.y + 20 / 2)
        .text((d) => d.name)
        .style("fill", "rgb(241,243,244)")
        .attr("opacity", 0)
        .style("user-select", "none")
        .style("pointer-events", "none")
        .transition()
        .duration(1000)
        .attr("opacity", 1)
    //添加次要节点
    lifeData.children.forEach((item, index) => {
        let g = life.append("g")
        g.append("circle")
            .datum(item)
            .attr("r", 0)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("fill", categoryColor[index])
            .on("mouseover", (d) => {
                d.food.forEach((item) => {
                    if (d3.select(`.tree-food-${item.id}`)) {
                        d3.select(`.tree-food-${item.id}`)
                            .transition()
                            .duration(500)
                            .attr("fill", foodActiveColor)
                            .attr("r", foodActiveR)
                    };
                })
                state.style("opacity", 1)
                d3.select(".init").style("opacity", 0)
                that.stateData = d.threeStates
                that.lifeName = d.name
            })
            .on("mouseleave", (d) => {
                d.food.forEach((item) => {
                    if (d3.select(`.tree-food-${item.id}`)) {
                        d3.select(`.tree-food-${item.id}`)
                            .transition()
                            .duration(500)
                            .attr("fill", (d) => nodeColor(0.5 + d.depth * 0.05))
                            .attr("r", treeRootR)
                    };
                })
            })
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("r", lifeSecondR)
        g.append("text")
            .datum(item)
            .attr("font-size", 24)
            .attr("x", (d) => d.x - d.name.length / 2 * 24)
            .attr("y", (d) => d.y)
            .text((d) => d.name)
            .style("fill", "rgb(241,243,244)")
            .style("pointer-events", "none")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", 1)
        g.append("text")
            .datum(item)
            .attr("font-size", 14)
            .attr("x", (d) => d.x - (d.trMedical.length + 1) / 2 * 14)
            .attr("y", (d) => d.y + 20)
            .text((d) => `(${d.trMedical})`)
            .style("fill", "rgb(241,243,244)")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", 1)
        item.category.forEach((item1, index1) => {
            g.append("circle")
                .datum(item1)
                .attr("r", 0)
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
                .attr("fill", categoryColor[index])
                .on("mouseover", function (d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", lifeSecondR / 1.5)
                        .attr("fill", "rgb(166,119,95)")
                    d.bodyParts.forEach((item1, index1) => {
                        d3.select(`.body-part-${bodyPart.indexOf(item1)}`)
                            .transition()
                            .duration(500)
                            .attr("r", 22)
                            .attr("fill", "#12264f")
                            .attr("opacity", 1)

                        d3.select(`.body-text-${bodyPart.indexOf(item1)}`)
                            .transition()
                            .duration(500)
                            .attr("opacity", 1)
                    })
                    d3.select(".body-tooltip")
                        .style("opacity", 1)
                    d3.select(".body-tooltip")
                        .select(".body-tooltip-title")
                        .text(item1.categoryName)
                    d3.select(".body-tooltip")
                        .select(".body-tooltip-text")
                        .text(item1.function)
                })
                .on("mouseleave", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", lifeSecondR / 2)
                        .attr("fill", categoryColor[index])
                    d.bodyParts.forEach((item1, index1) => {
                        d3.select(`.body-part-${bodyPart.indexOf(item1)}`)
                            .transition()
                            .duration(500)
                            .attr("r", 10)
                            .attr("fill", "rgb(128,128,128)")
                            .attr("opacity", 0.5)
                        d3.select(`.body-text-${bodyPart.indexOf(item1)}`)
                            .transition()
                            .duration(500)
                            .attr("opacity", 0)
                    })
                    d3.select(".body-tooltip")
                        .style("opacity", 0)
                })
                .transition()
                .delay(2000)
                .duration(1000)
                .attr("r", lifeSecondR / 2)
        })
    })
    //七大物质转换
    let materialTransData = [
        {
            name: "胃中食物",
            to: "大便、小便",
            out: "排出体外"
        },
        {
            name: "饮食精微",
            to: "胆汁",
            out: ""
        },
        {
            name: "血液",
            to: "",
            out: ""
        },
        {
            name: "肌肉",
            to: "眼屎、耳垢 鼻涕、唾液",
            out: "排出体外"
        },
        {
            name: "脂肪",
            to: "关节润滑物 皮肤、汗液",
            out: "排出体外"
        },
        {
            name: "骨骼",
            to: "牙齿、指（趾） 甲、毛发",
            out: ""
        },
        {
            name: "骨髓",
            to: "肛门、毛孔 上的油脂",
            out: ""
        },
        {
            name: "精液",
            to: "男精、女经 及卵子",
            out: "排出体外"
        },
        {
            name: "元气",
            to: "",
            out: ""
        }
    ]
    let materialTransWidth = width / 4, materialTransHeight = height / 1.8
    let mtHeightInterval = materialTransHeight / (materialTransData.length + 1)
    let materialTransformG = svg.append("g").attr("class", `material-transform-g`).attr("opacity", 0)
    materialTransData.forEach((item, index) => {
        let g = materialTransformG.append("g")
        let width1 = 100, width2 = 130, width3 = 80,
            height1 = 30, height2 = 25, height3 = 30
        let text = item.to.split(" ")
        let mainX = width / 6 + 20,
            mainY = mtHeightInterval * (index + 1),
            toX = width / 12 - 10,
            toY = mtHeightInterval * (index + 1.5),
            outX = 10,
            outY = mtHeightInterval * (index + 1)
        g.append("rect")
            .datum(item)
            .attr("x", mainX)
            .attr("y", mainY)
            .attr("rx", 10)
            .attr("height", height1)
            .attr("width", width1)
            .attr("fill", "#ccc5a2")
            .attr("opacity", "1")
            .attr("stroke", "#ccc5a2")
            .attr("stroke-width", 2)
        g.append("text")
            .datum(item)
            .attr("font-size", 18)
            .attr("x", (d) => (width / 6 + 20) + (width1 - d.name.length * 18) / 2)
            .attr("y", mtHeightInterval * (index + 1) + height1 / 2 + 6)
            .text((d) => d.name)
        if (item.to !== "") {
            g.append("rect")
                .datum(item)
                .attr("x", toX)
                .attr("y", toY)
                .attr("rx", 10)
                .attr("height", height2 * text.length)
                .attr("width", width2)
                .attr("fill", "white")
                .attr("opacity", "0.8")
                .attr("stroke", "grey")
                .attr("stroke-width", 2)
            g.append("g")
                .selectAll("text")
                .data(text)
                .enter()
                .append("text")
                .attr("font-size", 18)
                .attr("x", (d) => toX + width2 / 2 - d.length * 18 / 2)
                .attr("y", (d, i) => toY + 20 * i + height2 / 2 + 6)
                .text((d) => d)
            g.append("path")
                .attr("stroke", "#fdf1df")
                .attr("stroke-width", 2)
                .attr("d", `M${mainX + width1 / 2},${mainY + height1} L${toX + width2},${toY + height2 * text.length / 2}`)
        }
        if (item.out !== "") {
            g.append("rect")
                .datum(item)
                .attr("x", outX)
                .attr("y", outY)
                .attr("rx", 10)
                .attr("height", height3)
                .attr("width", width3)
                .attr("fill", "#fdf1df")
                .attr("opacity", "0.9")
                .attr("stroke", "#fdf1df")
                .attr("stroke-width", 2)
            g.append("text")
                .datum(item)
                .attr("font-size", 18)
                .attr("x", (d) => outX + width3 / 2 - d.out.length * 18 / 2)
                .attr("y", (d) => outY + height3 / 2 + 6)
                .text((d) => d.out)
            g.append("path")
                .attr("stroke", "grey")
                .attr("stroke-width", 2)
                .attr("d", `M${toX},${toY + height2 * text.length / 2} L${outX + width3 / 2},${outY + height3}`)
        }
    })
    materialTransformG.append("text")
        .attr("font-size", 28)
        .attr("x", materialTransWidth / 3 - 80)
        .attr("y", materialTransHeight + 20)
        .text("人体七种物质转换图")
        .attr("fill", "#f0f8ff")

    //七大物质
    let matterData = treeData.matter
    let matterMainR = 50, matterSecondR = matterMainR / 2
    let matterMainInterval = Math.PI * 1.8 / matterData.children.length
    matterData.x = width / 3 - 15
    matterData.y = height / 3.5 + 20
    matterData.children.forEach((item, index) => {
        item.angle = matterMainInterval * (index - matterData.children.length / 2)
        item.x = matterData.x + matterMainR * 1.6 * Math.sin(item.angle)
        item.y = matterData.y - matterMainR * 1.6 * Math.cos(item.angle)
    })
    let matter = svg.append("g")
    //七大物质主节点
    matter.append("circle")
        .datum(matterData)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", materialColor)
        .on("mouseover", function (d) {
            d3.select(".material-transform-g")
                .transition()
                .attr("opacity", 1)
        })
        .on("mouseleave", function (d) {
            d3.select(".material-transform-g")
                .transition()
                .attr("opacity", 0)
        })
        .transition()
        .duration(1000)
        .attr("r", matterMainR)
    matter.append("text")
        .datum(matterData)
        .attr("font-size", 24)
        .attr("x", (d) => d.x - d.name.length / 2 * 24)
        .attr("y", (d) => d.y + 20 / 2)
        .text((d) => d.name)
        .style("fill", "rgb(241,243,244)")
        .attr("opacity", 0)
        .style("user-select", "none")
        .style("pointer-events", "none")
        .transition()
        .duration(1000)
        .attr("opacity", 1)
    //七大物质二级节点 
    matter.append("g")
        .selectAll("circle")
        .data(matterData.children)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", materialChildrenColor)
        .on("mouseover", function (d) {
            that.stateData = d.stateClass
            that.lifeName = d.name
            d3.select(".init").style("opacity", 0)
            state.style("opacity", 1)
        })
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("r", matterSecondR)
    matter.append("g")
        .selectAll("text")
        .data(matterData.children)
        .enter()
        .append("text")
        .attr("font-size", 20)
        .attr("x", (d) => d.x - d.name.length / 2 * 20)
        .attr("y", (d) => d.y + 16 / 2)
        .attr("opacity", 0)
        .text((d) => d.name)
        .style("fill", "rgb(241,243,244)")
        .on("mouseover", function (d) {
            that.stateData = d.stateClass
            that.lifeName = d.name
            d3.select(".init").style("opacity", 0)
            state.style("opacity", 1)
        })
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("opacity", 1)
    //三大秽物
    let impurityData = treeData.impurity
    let impurityMainR = 50, impuritySecondR = impurityMainR / 2
    let impurityMainInterval = Math.PI / impurityData.children.length
    impurityData.x = width / 3 * 2 + 15
    impurityData.y = height / 3.5 + 20
    impurityData.children.forEach((item, index) => {
        item.angle = impurityMainInterval * (index - 0.5)
        item.x = impurityData.x + impurityMainR * 1.6 * Math.sin(item.angle)
        item.y = impurityData.y - impurityMainR * 1.6 * Math.cos(item.angle)
    })
    let impurity = svg.append("g")
    //三大秽物主节点
    impurity.append("circle")
        .datum(impurityData)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", impurityColor)
        .on("mouseover", function (d, i) {
            let tooltip = d3.select(".life-tooltip")
            tooltip.style("opacity", 1)
            tooltip.select(".name").text("所谓三种秽物，就是指大便、小便以及汗液三种人体主要的排泄物。内脏吸收食物的营养以后，其剩余的糟粕就会以固体和液体的形式排出体外，形成大、小便，而汗液也是人体排出糟粕的重要途径之一，它们共同维持着身体的新陈代谢。此外，牙齿、指甲、趾甲、耳垢、鼻涕、眼垢、毛发等，也属于身体的秽物。")
            // tooltip.select(".text").text(111)
        })
        .on("mouseleave", function (d, i) {
            let tooltip = d3.select(".life-tooltip")
            tooltip.style("opacity", 0)
            tooltip.select(".name").text("")
            tooltip.select(".text").text("")
        })
        .transition()
        .duration(1000)
        .attr("r", impurityMainR)


    impurity.append("text")
        .datum(impurityData)
        .attr("font-size", 24)
        .attr("x", (d) => d.x - d.name.length / 2 * 24)
        .attr("y", (d) => d.y + 20 / 2)
        .text((d) => d.name)
        .style("fill", "rgb(241,243,244)")
        .style("user-select", "none")
        .style("pointer-events", "none")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1)
    //三大秽物二级节点
    impurity.append("g")
        .selectAll("circle")
        .data(impurityData.children)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", impurityChildrenColor)
        .on("mouseover", function (d) {
            that.stateData = d.stateClass
            that.lifeName = d.name
            d3.select(".init").style("opacity", 0)
            state.style("opacity", 1)
        })
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("r", impuritySecondR)
    impurity.append("g")
        .selectAll("text")
        .data(impurityData.children)
        .enter()
        .append("text")
        .attr("font-size", 20)
        .attr("x", (d) => d.x - d.name.length / 2 * 20)
        .attr("y", (d) => d.y + 16 / 2)
        .attr("opacity", 0)
        .text((d) => d.name)
        .style("fill", "rgb(241,243,244)")
        .on("mouseover", function (d) {
            that.stateData = d.stateClass
            that.lifeName = d.name
            d3.select(".init").style("opacity", 0)
            state.style("opacity", 1)
        })
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("opacity", 1)

    //三因涉及身体部位
    // let tempArr = []
    // lifeData.children.forEach((item, index) => {
    //     item.category.forEach((item1, index1) => {
    //         tempArr = tempArr.concat(item1.bodyParts)
    //     })
    // })
    // let body = Array.from(new Set([...tempArr]))
}


export function stateChart(data, title) {
    d3.select(".state-svg").remove()
    let width = document.querySelector(".state").offsetWidth,
        height = document.querySelector(".state").offsetHeight
    let svg = d3.select(".state")
        .append("svg")
        .attr("class", "state-svg")
        .attr("width", width)
        .attr("height", height)

    let chartRadius = width / 5
    let curAngle = 0
    data.forEach((item, index) => {
        item.startAngle = curAngle
        item.endAngle = curAngle + Math.PI * 2 / data.length
        curAngle = item.endAngle
        item.x = width / 2 + chartRadius / 2 * Math.sin(item.startAngle + (item.endAngle - item.startAngle) / 2)
        item.y = chartRadius * 1.2 - chartRadius / 2 * Math.cos(item.startAngle + (item.endAngle - item.startAngle) / 2)
    })
    d3.select(".state-text")
        .style("opacity", 1)
        .text("")
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(chartRadius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
    let pieChart = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "pie-path")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("fill", (d, i) => i == 0 ? "rgba(167,119,96,0.9)" : "transparent")
        .attr("d", arc)
        .attr("transform", `translate(${width / 2},${chartRadius * 1.2})`)
        .on("mouseover", function (d) {
            d3.selectAll(".pie-path")
                .transition()
                .attr("fill", "transparent")
            d3.select(this)
                .transition()
                .attr("fill", "rgba(167,119,96,0.7)")
            d3.select(".state-text")
                .transition()
                .style("opacity", 1)
                .text(d.symptom)
        })
    d3.select(".state-text")
        .transition()
        .style("opacity", 1)
        .text(data[0].symptom)
    d3.select(".state-title")
        .transition()
        .text(title)
    let pieText = svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("font-size", 28)
        .attr("x", (d) => d.x - 28)
        .attr("y", (d) => d.y + 14)
        .style("pointer-events", "none")
        .attr("fill", "#455882")
        .text((d) => d.state)
}
