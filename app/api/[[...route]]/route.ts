// Mock data
const meals = [
  { id: "1", name: "Chicken", type: "Main meal", originPrice: 123, discountPrice: 100 },
  { id: "2", name: "Singanggang", type: "Dessert", originPrice: 123, discountPrice: 100 },
  { id: "3", name: "Coca", type: "Drink", originPrice: 123, discountPrice: 100 },
  { id: "4", name: "Macbook pro 16", type: "#123-456ABC", originPrice: 123, discountPrice: 100 },
]

const staff = [
  { id: "1", number: "001", name: "Nguyen Van A", shift: "Morning (6AM - 2PM)", status: "active" },
  { id: "2", number: "002", name: "Tran Thi B", shift: "Afternoon (2PM - 10PM)", status: "active" },
  { id: "3", number: "003", name: "Le Van C", shift: "Night (10PM - 6AM)", status: "inactive" },
  { id: "4", number: "004", name: "Pham Thi D", shift: "Morning (6AM - 2PM)", status: "active" },
  { id: "5", number: "005", name: "Hoang Van E", shift: "Afternoon (2PM - 10PM)", status: "active" },
]

const orders = [
  { id: '1', orderNumber: '#ORD-001', date: '2024-01-10 14:30', table: 'Table 5', meals: 'Chicken, Coca Cola', itemCount: 2, totalPrice: 25.50 },
  { id: '2', orderNumber: '#ORD-002', date: '2024-01-10 15:45', table: 'Table 2', meals: 'Singanggang, Chicken, Coca', itemCount: 3, totalPrice: 42.75 },
  { id: '3', orderNumber: '#ORD-003', date: '2024-01-10 16:20', table: 'Table 8', meals: 'Coca Cola', itemCount: 1, totalPrice: 3.50 },
  { id: '4', orderNumber: '#ORD-004', date: '2024-01-10 17:10', table: 'Table 3', meals: 'Chicken, Singanggang, Coca Cola, Dessert', itemCount: 4, totalPrice:111}
]
