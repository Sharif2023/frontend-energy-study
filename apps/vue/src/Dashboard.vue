<script setup>
const items = ref([]);
const count = ref(0);

const addItems = () => {
  const input = document.getElementById('item-input');
  const newItems = Array.from({length: parseInt(input.value)}, (_, i) => ({
    id: Date.now() + i,
    name: `Item ${items.value.length + i + 1}`
  }));
  items.value.push(...newItems);
  count.value += newItems.length;
};
</script>
