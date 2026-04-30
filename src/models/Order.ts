import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  variant: {
    size: string;
    unit: string;
    price: number;
  };
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  orderNumber?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  orderNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    variant: {
      size: { type: String, required: true },
      unit: { type: String, required: true },
      price: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: { type: String, default: 'Credit Card' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
