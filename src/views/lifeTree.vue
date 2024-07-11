<template>
    <div class="life-tree-contain">
        <div class="init">请在树枝上选择一个二级结点，这里显示其对应的状态</div>
        <div class="left">
            <div class="tree-chart"></div>
        </div>
        <div class="life-tooltip">
            <div class="name"></div>
            <div class="text"></div>
        </div>
        <div class="state">
            <div class="state-title"></div>
            <div class="state-text"></div>
        </div>
        <div class="body-tooltip">
            <div class="body-tooltip-title"></div>
            <div class="body-tooltip-text"></div>
        </div>
    </div>
</template>

<script>
import { lifeTree, stateChart } from '@/assets/js/lifeTree';
import treeData from "@/assets/data/treeData.json"

export default {
    data() {
        return {
            stateData: [],
            lifeName: ""
        }
    },
    mounted() {
        lifeTree(this)
        stateChart(treeData.impurity.children[0].stateClass, treeData.impurity.children[0].name)
    },
    watch: {
        stateData(n, o) {
            stateChart(n, this.lifeName)
        }
    }
}
</script>

<style lang="less">
.life-tree-svg {
    margin-top: 50px;
}

.init {
    left: 48%;
    top: 10%;
    width: 18%;
    height: 40%;
    position: absolute;
    border: 1px dashed grey;
    border-radius: 10px;
    // background-color: #fddcd3;
    // background-color: rgb(233, 222, 219);
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    // font-size: 28px;
    background-image: url(../../public/image/textBox.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding-left: 20px;
    font-size: 29px;
    color:#8ab4d2;
}

.life-tree-contain {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    position: relative;

    .life-tooltip {
        position: absolute;
        left: 20px;
        top: 100px;
        width: 350px;
        opacity: 0;
        background-image: url("@/assets/image/for_frame1.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        padding: 30px;

        .name {
            width: 90%;
            padding: 10px 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .text {
            width: 90%;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .left {
        width: 100%;
        height: 100%;
        border-right: 1px dashed grey;

        .tree-chart {
            height: 100%;
            width: 100%;
        }
    }

    .state {
        left: 48%;
        top: 10%;
        width: 18%;
        height: 40%;
        position: absolute;
        border: 1px dashed grey;
        border-radius: 10px;
        // background-color: #fddcd3;
        background-image: url(../../public/image/textBox.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        opacity: 0;
        color: #8ab4d2;

        .state-title {
            position: absolute;
            top: 45%;
            width: 90%;
            height: 10%;
            padding: 0 5px;
            background-color: rgba(250, 235, 215, 0.5);
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            font-family: STXingKai;
            border-bottom: 3px dashed grey;
        }

        .state-text {
            position: absolute;
            top: 55%;
            width: 90%;
            height: 40%;
            padding: 0 5px;
            background-color: rgba(250, 235, 215, 0.5);
            font-size: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .body-tooltip {
        position: absolute;
        width: 220px;
        height: 100px;
        right: 100px;
        top: 200px;
        border-radius: 20px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;

        .body-tooltip-title {
            height: 40%;
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-family: STXingkai;
        }

        .body-tooltip-text {
            height: 40%;
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-family: KaiTi;
        }
    }
    // .oneBigNode{
    //     background: radial-gradient(at center, yellow 0%, blue 30%, red 70%, purple 100%);
    // }
}
</style>