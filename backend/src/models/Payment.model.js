const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, required: true },
  status: { type: String, default: 'completed' },
  notes: { type: String },
  type: { type: String, enum: ['debit', 'credit'], default: 'debit' }
});
module.exports = mongoose.model('Payment', paymentSchema); 