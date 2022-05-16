var mongoose = require("mongoose");
var schema =  mongoose.Schema;

var expenseSchema = new schema({
  expenseSource:[{type:String}],
  amount:{type:String},
  expenseDate:{type:Date},
  userId:{type:schema.Types.ObjectId, ref:"user"}
}, {timestamps:true});

module.exports = mongoose.model("expense", expenseSchema);