<script>
let items = [];
let count = 0;

function addItems() {
  const input = document.getElementById('item-input');
  const newItems = Array.from({length: parseInt(input.value)}, (_, i) => ({
    id: Date.now() + i,
    name: `Item ${items.length + i + 1}`
  }));
  items = [...items, ...newItems];
  count += newItems.length;
}
</script>
