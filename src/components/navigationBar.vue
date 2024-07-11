<template>
    <div>
        <div class="navBar" v-show="showBar">
            <div class="navBarItem" @click="goto('/')" style="background-color: #eee;">
                <img src="../../public/image/bar1.png" alt="">
            </div>
            <div v-for="(path, index) in sectionInfo[sectionIndex]['paths']" :key="index" @click="goto(path)"
                :class="{ 'navBarItem': true, 'selected': pageIndex === index }">
                <p>{{ navBarText[index] }}</p>
            </div>
            <div></div>
        </div>
        <div class="navBartitle">
            {{ sectionInfo[sectionIndex]['names'][pageIndex] }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showBar: false,
            sectionIndex: 0,
            pageIndex: 0,
            sectionInfo: [
                { paths: ['/history', '/spread'], names: ["历史发展", "传播影响"] },
                { paths: ['/lifeTree', '/cure'], names: ["生命运行", "三邪疾病"] },
                { paths: ['/surgicalInstrument', '/medicationClassification', '/medicationPrinciple', '/preserveHealth'], names: ["手术器械", "药物分类", "用药原则", "浅谈养生"] }
            ],
            navBarText: ["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"]
        }


    },
    created() {
        this.$router.beforeEach((to, from, next) => {
            this.checkRoute(to);
            next();
        });
        window.addEventListener('load', this.reload)
    },
    beforeDestroy() {
        window.removeEventListener('load', this.reload)
    },
    methods: {
        reload() {
            this.checkRoute(this.$router.currentRoute)
        },
        checkRoute(route) {
            let path = route.path;
            if (route.name == "home") {
                this.showBar = false;
            } else {
                for (let i = 0; i < this.sectionInfo.length; ++i) {
                    let index = this.sectionInfo[i].paths.indexOf(path);
                    if (index != -1) {

                        this.sectionIndex = i;
                        this.pageIndex = index;
                        this.showBar = true;
                        break;
                    }
                }
            }
        },
        goto(path) {
            if (path != this.$router.currentRoute.path) {
                this.$router.push(path);
            }
        },
    },
}
</script>

<style lang="less" scoped>
.navBar {
    z-index: 999;

    position: absolute;
    right: 0;
    top: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transform: translateX(80%);
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: translateX(10%);
    }


    .navBarItem {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        width: 10vw;
        height: 10vw;
        max-width: 80px;
        max-height: 80px;

        border-radius: 50%;
        overflow: hidden;
        background: url("/public/image/navigationBarNo.png") no-repeat;
        background-size: cover;


        cursor: pointer;
        margin-bottom: 2.5vh;

        text-align: center;
        font-size: 2.5vw;
        color: #363535;

        img {
            width: 85%;
            height: 85%;
            margin: 0 auto;
        }

        p {
            width: 100%;
            height: 10vw;
            text-align: center;
            font-size: 35px;
            color: #2e59a7;
            line-height: 10vw;
        }
    }

    .selected {
        background: url("/public/image/navigationBarOn.png") no-repeat;
        background-size: cover;
        color: #000000;
        font-weight: 800;
    }

}

.navBartitle {
    width: 15%;
    height: 20%;
    position: absolute;
    top: 2.8vh;
    right: 2vw;

    background: url("/public/image/title.png") no-repeat;
    background-size: contain;
    text-align: center;
    line-height: 230%;
    font-size: 32px;
    font-weight: 550;
    color: white;
}
</style>