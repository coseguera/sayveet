module.exports = function (mongoose) {
    var personSchema = mongoose.Schema({
        id: String,
        name: String
    });
    return mongoose.model('Person', personSchema);
};
