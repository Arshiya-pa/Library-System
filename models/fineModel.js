import mongoose from "mongoose";

    const fineSchema = new mongoose.Schema({

        UserId: String,
        UserName: String,
        BookTitle: String,
        PaymentMethod: String,  
        FinePerDay: Number,
        DaysOverdue: {
          type: Number,
          required: [true, "DaysOverDue is required"], 
        },
         TotalFine: {
          type: Number,
          required: [true, "TotalFine is required"], 
        },
         AmountPaid: {
          type: Number,
          required: [true, "AmountPaid is required"], 
        },
        DueDate:Date,
        PaymentDate:Date,
        })

   const FineCollection = mongoose.models.FineCollection || mongoose.model("FineCollection",fineSchema)
   export default FineCollection;