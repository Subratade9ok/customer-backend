import express from 'express';

import { customers, kyc, nominee } from '../models/customers.js';
import { kycUpdate } from './kycUpdate.js';
import { nomineeUpdate } from './nominee.js';

const route = express.Router();

route.use("/kyc", kycUpdate);
route.use("/nominee", nomineeUpdate);

route.get("/", (req, res, next) => {
    customers.find()
        .populate('createdBy', '-password')
        .populate('kyc')
        .populate('nominee')
        .then(result => {
            res.status(200).json({
                message: "Customer Fetched !",
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
});
route.get("/:id", (req, res, next) => {
    customers.findById(req.params.id)
        .populate('createdBy', '-password')
        .populate('kyc')
        .populate('nominee')
        .then(result => {
            res.status(200).json({
                message: "Customer Fetched !",
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
});
route.post("/", (req, res, next) => {
    const customer = new customers(req.body);
    customer.save()
        .then(result => {
            res.status(200).json({ message: "Customer Added", data: result })
        })
        .catch(err => {
            res.status(200).json({ message: "Error Occured !", error: err.message })
        })
});
route.patch("/:id", (req, res, next) => {
    customers.findByIdAndUpdate(req.params.id)
        .populate('createdBy', '-password')
        .populate('kyc')
        .populate('nominee')
        .then(result => {
            res.status(200).json({ message: "Customer Updated", data: result })
        })
        .catch(err => {
            res.status(200).json({ message: "Error Occured !", error: err.message })
        })
});
route.delete("/:id", (req, res, next) => {
    customers.findById(req.params.id)
        .then(curUser => {
            if (curUser !== null)
                kyc.findByIdAndDelete(curUser.kyc)
                    .then(r => {
                        nominee.findByIdAndDelete(curUser.nominee)
                            .then(re => {
                                customers.findByIdAndDelete(req.params.id)
                                    .then(result => {
                                        res.status(200).json({
                                            message: "Customer Deleted !"
                                        });
                                    }).catch(err => {
                                        res.status(500).json({
                                            message: "Error Occurred on Customer",
                                            error: err.message
                                        });
                                    });
                            }).catch(err => {
                                res.status(500).json({
                                    message: "Error Occurred on Nominee",
                                    error: err.message
                                })
                            });
                    }).catch(err => {
                        res.status(500).json({
                            message: "Error Occurred on Kyc",
                            error: err.message
                        })
                    });
            else {
                res.status(404).json({
                    message: "User Not Found !"
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            });
        })
})



export { route as customer }