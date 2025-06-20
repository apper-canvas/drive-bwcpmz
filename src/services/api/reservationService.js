import reservationsData from '../mockData/reservations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let reservations = [...reservationsData];

export const reservationService = {
  async getAll() {
    await delay(300);
    return [...reservations];
  },

  async getById(id) {
    await delay(200);
    const reservation = reservations.find(r => r.Id === parseInt(id, 10));
    return reservation ? { ...reservation } : null;
  },

  async getByDate(date) {
    await delay(250);
    const targetDate = new Date(date).toDateString();
    return reservations.filter(r => 
      new Date(r.dateTime).toDateString() === targetDate
    ).map(r => ({ ...r }));
  },

  async create(reservationData) {
    await delay(400);
    const newReservation = {
      ...reservationData,
      Id: Math.max(...reservations.map(r => r.Id)) + 1,
      status: 'confirmed'
    };
    reservations.push(newReservation);
    return { ...newReservation };
  },

  async update(id, reservationData) {
    await delay(350);
    const index = reservations.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Reservation not found');
    
    const updatedReservation = { 
      ...reservations[index], 
      ...reservationData, 
      Id: parseInt(id, 10) 
    };
    reservations[index] = updatedReservation;
    return { ...updatedReservation };
  },

  async delete(id) {
    await delay(300);
    const index = reservations.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Reservation not found');
    
    reservations.splice(index, 1);
    return true;
  }
};

export default reservationService;