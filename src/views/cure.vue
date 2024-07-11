<template>
    <div class="cure">
        <div class="cure-chart"></div>
        <div class="select">
            <div :class="curFactor == index ? 'option active' : 'option'" v-for="(item, index) in factor" :key="index"
                 @click="change(index)">{{ item.real }}
            </div>
        </div>
        <div class="medicineImg"></div>
    </div>
</template>

<script>
import { cure } from "@/assets/js/cure"
import threeFactorData from "@/assets/data/threeFactorData.json"
import * as d3 from "d3"

export default {
    data() {
        return {
            factor: [
                { name: "long", real: "隆" },
                { name: "chiBa", real: "赤巴" },
                { name: "peiGen", real: "培根" }
            ],
            curFactor: 0
        }
    },
    mounted() {
        cure(this.curFactor)
    },
    methods: {
        change(index) {
            this.curFactor = index
        }
    },
    watch: {
        curFactor(n, o) {
            d3.select(".cure-svg").remove()
            cure(n)
        }
    }
}
</script>

<style lang="less">
.cure {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .select {
        right: 11%;
        top: 8%;
        width: 25%;
        height: 12%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;

        .option {
            height: 70%;
            width: 25%;
            font-size: 36px;
            font-family: KaiTi;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgb(189, 155, 124);
            color: white;
            border-radius: 70px;
            cursor: pointer;
            transition: all 0.5s;
        }

        .option.active {
            background-color: rgb(215, 115, 21) ;
        }
    }
}

.cure-chart {
    width: 100%;
    height: 100%;
}
.medicineImg{
    width: 13%;
    height: 20%;
    position: absolute;
    bottom: 0.5%;
    left: 0.2%;
    opacity: 0.6;
    background: url('/public/image/medicine1.png');
    background-size: 100% 100%;
}
</style>