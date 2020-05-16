const path = require('path');
const express = require('express');
const capsuleService = require('./capsuleService');
const capsulesRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');
const moment = require('moment')

const serializeCapsule = capsule => {
    capsule.burydate = moment(capsule.burydate).add(-4, 'hours')
    capsule.unlockdate = moment(capsule.unlockdate).add(-4, 'hours')
    return {
    id: capsule.id,
    title: capsule.title,
    note: xss(capsule.note),
    imageurl: xss(capsule.imageurl),
    burydate: capsule.burydate,
    unlockdate: capsule.unlockdate,
    usernumber: capsule.usernumber,
    }
};
/*
* capsules Router. /api/capsules.
*/ 
capsulesRouter
    .route('/')
/*
* Recieves all expeneses from all users.
*/ 
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        capsuleService.getAllCapsules(knexInstance)
            .then(capsules => {
                res.json(capsules.map(serializeCapsule))
            })
            .catch(next)
    })
/*
* Add new capsules. Needs, amount, style description, date and usernumber. 
*Usernumber is user's id which is a primary key
*/
    .post(jsonParser, (req, res, next) => {
        const { title, note, unlockdate, imageurl, burydate, usernumber } = req.body;
        const newCapsule = { title, note, unlockdate, burydate, imageurl, usernumber }
        for (const [key, value] of Object.entries(newCapsule))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        
            capsuleService.insertCapsule(
            req.app.get('db'),
            newCapsule
        )
            .then(capsule => {
                console.log(capsule)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${capsule.id}`))
                    .json(serializeCapsule(capsule))
            })
        .catch(next)
    })
/*
* capsules Router. /api/capsules/:capsule_id
*/ 
capsulesRouter
    .route('/:capsule_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        capsuleService.getById(
            knexInstance,
            req.params.capsule_id
        )
        .then(capsule => {
            if (!capsule) {
                return res.status(404).json({
                    error: { message: `capsule doesn't exist` }
                })
            } 
            console.log
            res.capsule = capsule
            next()
        })
        .catch(next)
    })
/*
* Recieves the expenese from specific capsule id.
*/ 
    .get((req, res, next) => {
        console.log(res);
        res.json(serializeCapsule(res.capsule))
    })

    
/*
* Deletes expeneses from specific capsule id.
*/ 
    .delete((req, res, next) => {
        capsuleService.deleteCapsule(
            req.app.get('db'),
            req.params.capsule_id
        )
            .then(() => {
                res.status(204).end()
                console.log('worked');
            })
            .catch(next)
    })
/*
* Updates expeneses from specific capsule id.
*/ 
    .patch(jsonParser, (req, res, next) => {
        const { title, note, unlockdate, burydate, imageurl } = req.body;
        const capsuleToUpdate = { title, note, unlockdate, burydate, imageurl }

        const numberOfValues = Object.values(capsuleToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'amount', 'style', or 'description'`
                }
            })
        }

        capsuleService.updateCapsule(
            req.app.get('db'),
            req.params.capsule_id,
            capsuleToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
/*
* capsules Router. /api/capsules/user/:capsule_usernumber
*/ 
capsulesRouter
    .route('/user/:capsule_usernumber')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        capsuleService.getByusernumber(
            knexInstance,
            req.params.capsule_usernumber
        )
        .then(capsule => {
            if (!capsule) {
                return res.status(404).json({
                    error: { message: `capsule doesn't exist` }
                })
            } 
            console.log
            res.capsule = capsule
            next()
        })
        .catch(next)
    })
/*
* Recieves all expeneses from specific user.
*/ 
    .get((req, res, next) => {
        res.json(res.capsule.map(serializeCapsule))
    })
/*
* Deletes expeneses from specific user.
*/ 
    .delete((req, res, next) => {
        capsuleService.deleteCapsule(
            req.app.get('db'),
            req.params.capsule_usernumber
        )
            .then(() => {
                res.status(204).end()
                console.log('worked');
            })
            .catch(next)
    })
/*
* Updates expeneses from specific user.
*/ 
    .patch(jsonParser, (req, res, next) => {
        const { title, note, unlockdate, burydate, imageurl } = req.body;
        const capsuleToUpdate = { title, note, unlockdate, burydate, imageurl }

        const numberOfValues = Object.values(capsuleToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'amount', 'style', or 'description'`
                }
            })
        }

        capsuleService.updateCapsule(
            req.app.get('db'),
            req.params.capsule_usernumber,
            capsuleToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    module.exports = capsulesRouter;