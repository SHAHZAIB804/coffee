import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: Number,
  price: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String },
    notes: { type: String }
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: Number,
    discount: Number,
    delivery: Number,
    tax: Number,
    total: Number
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  status: { 
    type: String, 
    enum: ['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'New' 
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

