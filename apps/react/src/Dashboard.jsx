const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

const addItems = () => {
  const input = document.getElementById('item-input');
  const newItems = Array.from({length: parseInt(input.value)}, (_, i) => ({
    id: Date.now() + i,
    name: `Item ${items.length + i + 1}`
  }));
  setItems(prev => [...prev, ...newItems]);
  setCount(prev => prev + newItems.length);
};
