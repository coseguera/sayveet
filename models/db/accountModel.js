module.exports = function (mongoose) {
    var accountSchema = mongoose.Schema({
        id: String,
        name: String
    });
    return mongoose.model('Account', accountSchema);
};
