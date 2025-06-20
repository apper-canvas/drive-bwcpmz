import ordersData from '../mockData/orders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id, 10));
    return order ? { ...order } : null;
  },

  async getByTableId(tableId) {
    await delay(250);
    return orders.filter(o => o.tableId === tableId.toString()).map(o => ({ ...o }));
  },

  async create(orderData) {
    await delay(400);
    const newOrder = {
      ...orderData,
      Id: Math.max(...orders.map(o => o.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: 'ordered'
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay(350);
    const index = orders.findIndex(o => o.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Order not found');
    
    const updatedOrder = { 
      ...orders[index], 
      ...orderData, 
      Id: parseInt(id, 10) 
    };
    orders[index] = updatedOrder;
    return { ...updatedOrder };
  },

  async updateStatus(id, status) {
    await delay(250);
    const index = orders.findIndex(o => o.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Order not found');
    
    const updatedOrder = { 
      ...orders[index], 
      status, 
      Id: parseInt(id, 10) 
    };
    orders[index] = updatedOrder;
    return { ...updatedOrder };
  },

  async delete(id) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Order not found');
    
    orders.splice(index, 1);
    return true;
  }
};

export default orderService;