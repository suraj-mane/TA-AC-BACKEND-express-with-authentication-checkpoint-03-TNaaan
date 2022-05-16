var mongoose = require("mongoose");
var schema = mongoose.Schema;

var incomeSchema = new schema({
  incomeSource:[{type:String}],
  amount:{type:String},
  incomeDate:{type:Date},
  userId:[{type:schema.Types.ObjectId, ref:"user"}]
},{timestamps:true});

incomeSchema.index({amount:1})

module.exports = mongoose.model("income", incomeSchema);