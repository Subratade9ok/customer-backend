import express from 'express';
import { appUsers } from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const route = express.Router();


import { JWT_SECRET_KEY } from '../config/config.js';


route.get("/", (req, res, next) => {
    appUsers.find()
        .select('-password')
        .then(result => {
            res.status(200).json({
                message: "Users Fetched !",
                data: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Error Occured",
                error: err.message
            })
        })
});

route.get("/:id", (req, res, next) => {
    appUsers.findById(req.params.id)
        .select('-password')
        .then(result => {
            if (result !== null) {
                res.status(200).json({
                    message: "Users Fetched !",
                    data: result
                })
            } else {
                res.status(404).json({
                    message: "User Not Found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
});

route.delete("/:id", (req, res, next) => {
    appUsers.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).json({
                messge: "Users Deleted !",
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "User Not Deleted !",
                error: err.message
            })
        })
});

route.patch("/:id", (req, res, next) => {
    appUsers.findByIdAndUpdate(req.params.id, req.body, { returnOriginal: false })
        .select('-password')
        .then(result => {
            if (result !== null) {
                res.status(200).json({
                    message: "Users Updated !",
                    data: result
                })
            } else {
                res.status(404).json({
                    message: "User Not Found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error Occured !",
                error: err.message
            })
        })
});

route.post("/login", (req, res, next) => {
    appUsers.find({ email: req.body.username })
        .then(result => {
            if (result.length == 1) {
                bcrypt.compare(req.body.password, result[0].password, (err, passCheck) => {
                    if (!passCheck) return res.status(403).json({ message: "Login Failed", error: "Password Not Matched" });

                    const token = jwt.sign({
                        email: result[0].email,
                        name: result[0].name,
                        role: result[0].role,
                        designation: result[0].designation
                    },
                        JWT_SECRET_KEY,
                        {
                            expiresIn: "13h"
                        }
                    )
                    res.status(200).json({
                        message: "User LoggedIn",
                        data: result,
                        token
                    })
                })
            } else {
                res.status(404).json({
                    message: "Login Failed !",
                    error: "Credential Mismatch"
                })
            }
        }).catch(err => res.status(404).json({
            message: "Error Occured !",
            error: err.message
        }));

});


route.post("/", (req, res, next) => {
    const data = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: "Error Occured", error: err.message })

        const user = new appUsers({ ...data, password: hash });
        user.save()
            .then((result) => {
                res.status(200).json({
                    message: "Register Successfully !",
                    data: [{ name: result.name, email: result.email, designation: result.designation, role: result.role, createdAt: result.createdAt, _id: result._id }]
                });
            })
            .catch((err) => {
                console.log(err.message);
                res.status(500).json({
                    message: "Registration Failed !",
                    error: err.message
                })
            });
    })
});

export { route as users }