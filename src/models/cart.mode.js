const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number, required: true }
        }],
        default: []
    }
});

const cartModel = mongoose.model('carts', cartSchema);

module.exports = cartModel;