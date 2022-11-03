import mongoose from "mongoose";

const kycDetails = new mongoose.Schema({
    aadharNo: { type: String, maxlength: 12, minlength: 12, required: true },
    panCardNo: { type: String, required: true, maxlength: 10, minlength: 10 },
    voterCardNo: { type: String, required: true, maxlength: 10, minlength: 10 },
    createdAt: { type: Date, default: () => Date.now() },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
});
const nomineeDetails = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true }
    },
    relation: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: () => Date.now() },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})
const customerData = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true }
    },
    email: {
        type: String
    },
    mobile: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10,
        unique: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Others"]
    },
    address: {
        village: {
            type: String,
            required: true
        },
        postOffice: {
            type: String,
            required: true
        },
        policeStation: {
            type: String,
            required: true
        },
        distric: {
            type: String,
            required: true
        },
        pin: {
            type: String,
            maxlength: 6,
            minlength: 6
        }
    },

    kyc: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "kycs"
    },
    nominee: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "nominees"
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

const customerSchema = mongoose.model("customers", customerData);
const kycSchema = mongoose.model('kycs', kycDetails);
const nomineeSchema = mongoose.model('nominees', nomineeDetails);

export { customerSchema as customers, kycSchema as kyc, nomineeSchema as nominee }