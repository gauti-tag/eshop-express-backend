const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

// code for adding attribute 'id' in the response database
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);