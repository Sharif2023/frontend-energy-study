import { reactive } from 'vue'

export const store = reactive({
  itemCounter: 0,
  widgetRefreshCounter: 0,
  pageLoads: 0,
  
  incrementItemCounter(amount) {
    this.itemCounter += amount
  },
  
  decrementItemCounter(amount) {
    this.itemCounter = Math.max(0, this.itemCounter - amount)
  },
  
  refreshWidgets() {
    this.widgetRefreshCounter++
  },
  
  incrementPageLoads() {
    this.pageLoads++
  }
})
