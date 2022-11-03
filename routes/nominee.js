import express from 'express';

import { nominee, customers } from '../models/customers.js';


const route = express.Router();


route.post("/:id", (req, res, next) => {
    const nomineeData = new nominee(req.body);
    customers.findById(req.params.id)
        .then(cust => {
            if (cust === null) {
                res.status(404).json({ message: "Customer not found" })
            } else if (cust.nominee)
                res.status(404).json({ message: "Nominee Already Added !" })
            else {
                nomineeData.save()
                    .then(nom => {
                        if (nom !== null) {
                            customers.findByIdAndUpdate(req.params.id, { nominee: nom._id }, { returnOriginal: false })
                                .populate('createdBy', '-password')
                                .populate('kyc')
                                .populate('nominee')
                                .then(updatedCustomer => {
                                    res.status(200).json({
                                        message: "Nominee Added !",
                                        data: updatedCustomer
                                    })
                                }).catch(err => {
                                    res.status(500).json({ message: "Error Occured !", error: err.message })
                                })
                        } else {
                            res.status(404).json({ message: "Customer not found" })
                        }
                    }).catch(err => {
                        res.status(500).json({ message: "Error Occured !", error: err.message })
                    })
            }
        }).catch(err => {
            res.status(500).json({ message: "Error Occured !", error: err.message })
        })
})


export { route as nomineeUpdate }