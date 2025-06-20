import tablesData from '../mockData/tables.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tables = [...tablesData];

export const tableService = {
  async getAll() {
    await delay(300);
    return [...tables];
  },

  async getById(id) {
    await delay(200);
    const table = tables.find(t => t.Id === parseInt(id, 10));
    return table ? { ...table } : null;
  },

  async create(tableData) {
    await delay(400);
    const newTable = {
      ...tableData,
      Id: Math.max(...tables.map(t => t.Id)) + 1
    };
    tables.push(newTable);
    return { ...newTable };
  },

  async update(id, tableData) {
    await delay(350);
    const index = tables.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Table not found');
    
    const updatedTable = { ...tables[index], ...tableData, Id: parseInt(id, 10) };
    tables[index] = updatedTable;
    return { ...updatedTable };
  },

  async updateStatus(id, status, additionalData = {}) {
    await delay(250);
    const index = tables.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Table not found');
    
    const updatedTable = { 
      ...tables[index], 
      status,
      ...additionalData,
      Id: parseInt(id, 10)
    };
    
    // Handle status-specific updates
    if (status === 'occupied' && !updatedTable.seatedAt) {
      updatedTable.seatedAt = new Date().toISOString();
    } else if (status === 'available') {
      updatedTable.seatedAt = null;
      updatedTable.currentPartySize = 0;
      updatedTable.serverId = null;
    }
    
    tables[index] = updatedTable;
    return { ...updatedTable };
  },

  async delete(id) {
    await delay(300);
    const index = tables.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Table not found');
    
    tables.splice(index, 1);
    return true;
  }
};

export default tableService;