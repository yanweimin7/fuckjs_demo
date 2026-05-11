// test entry for sourcemap demo
function calculateTotal(items) {
  return items.reduce((sum, item) => {
    if (item.price === undefined) {
      throw new Error('item.price is undefined');
    }
    return sum + item.price * item.quantity;
  }, 0);
}

function renderCart(cart) {
  const total = calculateTotal(cart.items);
  console.log('total:', total);
}

export { renderCart };
