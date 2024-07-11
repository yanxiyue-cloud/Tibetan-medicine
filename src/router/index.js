import Vue from 'vue'
import VueRouter from 'vue-router'
import history from '@/views/history.vue'
import spread from '@/views/spread.vue'
import people from '@/views/people.vue'
import lifeTree from "@/views/lifeTree.vue"
import home from "@/views/home.vue"
import cure from "@/views/cure.vue"
import surgicalInstrument from "@/views/surgicalInstrument.vue"
import medicationClassification from "@/views/medicationClassification.vue"
import medicationPrinciple from "@/views/medicationPrinciple.vue"
import preserveHealth from "@/views/preserveHealth.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/history',
    name: 'history',
    component: history
  },
  {
    path: '/spread',
    name: 'spread',
    component: spread
  },
  {
    path: '/people',
    name: 'people',
    component: people
  },
  {
    path: '/lifeTree',
    name: 'lifeTree',
    component: lifeTree
  },
  {
    path: '/cure',
    name: 'cure',
    component: cure
  },
  {
    path: '/preserveHealth',
    name: 'preserveHealth',
    component: preserveHealth
  },
  {
    path: '/surgicalInstrument',
    name: 'surgicalInstrument',
    component: surgicalInstrument
  },
  {
    path: '/medicationClassification',
    name: 'medicationClassification',
    component: medicationClassification
  },
  {
    path: '/medicationPrinciple',
    name: 'medicationPrinciple',
    component: medicationPrinciple
  },
]

const router = new VueRouter({
  routes
})

export default router
