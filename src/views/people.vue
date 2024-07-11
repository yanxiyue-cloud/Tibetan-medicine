<template>
    <div class="people-contain">
        <div class="left">
            <div class="people-chart"></div>
        </div>
        <div class="right">
            <div class="people-profile">
                <div class="title">人物简介</div>
                <div class="profile">
                    {{ profile }}
                </div>
            </div>
            <div class="people-career">
                <div class="title"> 生平经历 </div>
                <div class="career">
                    <div class="career-item" v-for="(item, index) in renderCareer" :key="index">
                        <div class="time">● {{ item.year }}</div>
                        <div class="describe">{{ item.describe }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { drawPeople } from "@/assets/js/people"
import persson from "@/assets/data/person.json"

export default {
    data() {
        return {
            renderCareer: [],
            profile: "",
            curPeople: 4
        }
    },
    created() {
        this.profile = persson[this.curPeople].profile
        this.renderCareer = persson[this.curPeople].career
    },
    mounted() {
        drawPeople(this)
    },
    watch: {
        curPeople(n, o) {
            this.profile = persson[this.curPeople].profile
            this.renderCareer = persson[n].career
        }
    }
}
</script>

<style lang="less">
.people-contain {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

    .left {
        width: 60%;
        height: 100%;
        border-right: 1px solid grey;

        .people-chart {
            width: 100%;
            height: 100%;
        }
    }

    .right {
        width: 40%;
        height: 100%;

        .title {
            width: 100%;
            height: 100px;
            font-size: 40px;
            font-family: KaiTi;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }

        .people-profile {
            width: 100%;
            height: 20%;
            border-bottom: 1px dashed grey;

            .profile {
                width: 100%;
                height: calc(100% - 100px);
                box-sizing: border-box;
                padding: 0 5%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                text-align: left;
                text-indent: 64px;
                font-family: KaiTi;
                font-weight: bold;
                color: white;
            }
        }

        .people-career {
            width: 100%;
            height: 80%;

            .career {
                width: 100%;
                height: calc(100% - 100px);

                .career-item {
                    width: 100%;
                    height: 15%;
                    margin-bottom: 30px;

                    .time {
                        height: 30%;
                        width: 100%;
                        font-size: 24px;
                        text-align: left;
                        text-indent: 64px;
                        font-family: KaiTi;
                        font-weight: bold;
                        color: white;
                    }

                    .describe {
                        height: 70%;
                        width: 100%;
                        font-size: 24px;
                        text-align: left;
                        text-indent: 64px;
                        font-family: KaiTi;
                        font-weight: bold;
                        color: white;
                    }
                }
            }
        }
    }
}
</style>