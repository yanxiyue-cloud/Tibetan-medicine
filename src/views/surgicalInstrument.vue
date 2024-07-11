<template>
    <div class="tool">
        <div class="image">
            <div class="top-left pain">
            </div>
            <div class="top-mid bone">
            </div>
            <div class="top-right piles">
            </div>
            <div class="bottom-left operation">
            </div>
            <div class="bottom-mid cataract">
            </div>
            <div class="bottom-right other">
            </div>
        </div>
        <div class="tool-chart">
            <div class="chart-title">器械数量统计图</div>
            <div class="tool-chart-tooltip">
                <div class="name"></div>
                <div class="cnt"></div>
            </div>
        </div>
        <div class="tool-tooltip">
            <div class="name"></div>
            <div class="text"></div>
        </div>
    </div>
</template>

<script>
import tool from "@/assets/data/tool.json"
import { autoToolImage, toolChart } from '@/assets/js/surgicalInstrument';

export default {
    data() {
        return {
            tool: {
                pain: [],
                cataract: [],
                piles: [],
                operation: [],
                bone: [],
                other: []
            },
            color: ["#8FB1BD", "#98B293", "#A7665C", "#D89E85", "#6C87FF", "#F48F87"]
            // color: ["#6877ae", "#689e90", "#bae0af", "#e3ad7f", "#dd754e", "#aa3a2c"]
        }
    },
    created() {
        this.tool.pain = tool[0]
        this.tool.cataract = tool[3]
        this.tool.piles = tool[1]
        this.tool.operation = tool[2]
        this.tool.bone = tool[4]
        this.tool.other = tool[5]
    },
    mounted() {
        Object.keys(this.tool).forEach((item, index) => {
            let width = document.querySelector(`.${item}`).offsetWidth
            let height = document.querySelector(`.${item}`).offsetHeight
            autoToolImage(item, this.tool[item], width, height)
        })
        toolChart(tool)
    }
}
</script>

<style lang="less">
.tool {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;

    .tool-tooltip {
        width: 250px;
        background-color: rgba(240, 248, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        pointer-events: none;

        .name {
            width: 90%;
            padding: 10px 0 0;
            box-sizing: border-box;
            text-align: center;
            font-size: 20px;
            font-family: STXingKai;
        }

        .text {
            width: 90%;
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
        }
    }

    .image {
        width: 60%;
        height: 100%;
        position: relative;

        .top-left {
            position: absolute;
            box-sizing:border-box;
            width: 30%;
            height: 40%;
            // background-color:#8FB1BD; 
            border-right: 8px solid #FFE7D4;
            border-image:-webkit-linear-gradient(#F80,#2ED) 30 30 ;
            border-bottom: 8px solid #FFE7D4;
            border-image:-webkit-linear-gradient(#F80,#2ED) 30 30 ;
        }

        .top-mid {
            position: absolute;
            width: 30%;
            height: 40%;
            left: 30%;
            // background-color:#98B293;
            box-sizing:border-box;
            border-right: 8px solid #FFE7D4;
            border-bottom: 8px solid #FFE7D4;
        }

        .top-right {
            left: 60%;
            box-sizing: border-box;
            position: absolute;
            width: 40%;
            height: 35%;
            // background-color: #A7665C;
            box-sizing:border-box;
            // border-right: 8px solid #FFE7D4;
            border-bottom: 8px solid #FFE7D4;
        }

        .bottom-left {
            position: absolute;
            width: 40%;
            height: 60%;
            top: 40%;
            // background-color:#D89E85;
            box-sizing:border-box;
            border-right: 8px solid #FFE7D4;
        }

        .bottom-mid {
            position: absolute;
            width: 20%;
            height: 60%;
            top: 40%;
            left: 40%;
            // background-color:#7c86b3;
            box-sizing:border-box;
            border-right: 8px solid #FFE7D4;
        }

        .bottom-right {
            position: absolute;
            width: 40%;
            height: 65%;
            top: 35%;
            left: 60%;
            // background-color: #F48F87;
            box-sizing:border-box;
            // border-right: 8px solid #FFE7D4;
        }
    }

    .tool-chart {
        width: 40%;
        height: 100%;
        position: relative;

        .chart-title {
            width: 40%;
            height: 70px;
            left: 50%;
            top: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            background-color: rgba(250, 235, 215, 0.3);
            transform: translateX(-50%);
            border-radius: 50px;
            font-size: 40px;
            color: white;
            font-family: STXingKai;
        }

        .tool-chart-tooltip {
            left: 0;
            top: 0;
            width: 150px;
            background-color: rgba(239, 226, 218, 0.7);
            opacity: 0;
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            pointer-events: none;

            .name {
                width: 90%;
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px dashed grey;
            }

            .cnt {
                width: 90%;
                padding: 10px 0;
                text-align: center;
            }
        }
    }
}
</style>