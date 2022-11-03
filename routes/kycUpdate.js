import express from 'express';
import { kyc, customers } from '../models/customers.js';


const route = express.Router();


route.post("/:id", (req, res, next) => {
    const updateDetail = new kyc(req.body);
    customers.findById(req.params.id)
        .then(cust => {
            if (cust == null) {
                res.status(404).json({
                    message: "Customer Not Available !",
                })
            } else if (cust.kyc) {
                res.status(500).json({
                    message: "KYC Already Updated"
                })
            } else {
                updateDetail.save()
                    .then(result => {
                        if (result != null) {
                            customers.findByIdAndUpdate(req.params.id, { kyc: result._id }, { returnOriginal: false })
                                .populate('createdBy', '-password')
                                .populate('kyc')
                                .populate('nominee')
                                .then(updatedCustomer => {
                                    res.status(200).json({
                                        message: "Kyc Details Added !",
                                        data: updatedCustomer
                                    })
                                }).catch(err => {
                                    res.status(500).json({
                                        message: "Error Occured !",
                                        error: err.message
                                    })
                                })
                        } else {
                            res.status(500).json({
                                message: "Error While Adding KYC"
                            })
                        }
                    }).catch(err => {
                        res.status(500).json({
                            message: "Error Occured !",
                            error: err.message
                        })
                    })
            }
        }).catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
})
route.patch("/:id", (req, res, next) => {
    customers.findById(req.params.id)
        .then(r => {
            if (r !== null) {
                kyc.findByIdAndUpdate(req.body._id, req.body, { returnOriginal: false })
                    .then(result => {
                        if (result !== null)
                            customers.findById(req.params.id)
                                .populate('createdBy', '-password')
                                .populate('kyc')
                                .populate('nominee')
                                .then(user => {
                                    res.status(200).json({
                                        message: "KYC Details Updated",
                                        data: user
                                    })
                                }).catch(err => {
                                    res.status(500).json({
                                        message: "Error Occured !",
                                        error: err.message
                                    })
                                })
                        else {
                            res.status(500).json({
                                message: "KYC Not found to Update!"
                            })
                        }
                    })
            } else {
                res.status(404).json({
                    message: "Customer not Found"
                })
            }
        }).catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
})
route.delete("/:id", (req, res, next) => {
    customers.findById(req.params.id)
        .then(r => {
            if (r !== null) {
                kyc.findByIdAndDelete(req.body._id)
                    .then(result => {
                        if (result !== null)
                            customers.findById(req.params.id)
                                .populate('createdBy', '-password')
                                .populate('kyc')
                                .populate('nominee')
                                .then(user => {
                                    res.status(200).json({
                                        message: "KYC Details Deleted",
                                        data: user
                                    })
                                }).catch(err => {
                                    res.status(500).json({
                                        message: "Error Occured !",
                                        error: err.message
                                    })
                                })
                        else {
                            res.status(500).json({
                                message: "KYC Not Found"
                            })
                        }
                    })
            } else {
                res.status(404).json({
                    message: "Customer not Found"
                })
            }
        }).catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
})











export { route as kycUpdate }