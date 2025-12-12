<template>
  <div 
    class="widget" 
    :data-id="id" 
    :style="{ borderTop: `4px solid ${color}` }"
  >
    <h3>Widget {{ id }}</h3>
    <div :style="{ fontSize: '32px', fontWeight: 'bold', color }">
      {{ number }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { store } from '../store'

export default {
  name: 'PlaceholderWidget',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe']
    const color = colors[props.id % colors.length]
    const number = ref(Math.floor(Math.random() * 1000))

    const updateNumber = () => {
      number.value = Math.floor(Math.random() * 1000)
    }

    watch(() => store.widgetRefreshCounter, () => {
      updateNumber()
    })

    onMounted(() => {
      updateNumber()
    })

    return {
      color,
      number
    }
  }
}
</script>
