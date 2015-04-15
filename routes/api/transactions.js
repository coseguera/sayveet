'use strict';

module.exports = function (repo, logger) {
    function isValidDate(d) {
        return !isNaN(d.getTime());
    }

    return {
        '/': {
            // temporary get function to start with
            get: function (req, res) {
                repo.getAll(function (err, result) {
                    if (err) {
                        logger.error(err);
                        res.sendStatus(500);
                        return;
                    }

                    res.json(result);
                });
            },
            post: function (req, res) {
                var obj = {
                    date: new Date(req.body.date),
                    concept: req.body.concept,
                    amount: req.body.amount,
                    person: req.body.person,
                    account: req.body.account
                };

                if (!req.body.date ||
                    !isValidDate(obj.date) ||
                    !obj.concept || 
                    !obj.amount || 
                    isNaN(obj.amount) ||
                    !obj.person || 
                    !obj.account) {
                    res.sendStatus(400);
                    return;
                }

                repo.create(obj, function (err) {
                    if (err) {
                        logger.error(err);
                        res.sendStatus(500);
                        return;
                    }

                    res.sendStatus(200);
                });
            }
        },
        '/:id': {
            get: function (req, res) {
                var id = req.params.id;

                repo.get(id, function (err, result){
                    if (err) {
                        logger.error(err);
                        res.sendStatus(500);
                        return;
                    }

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }

                    res.json(result);
                });
            },
            put: function (req, res) {
                var id = req.params.id;

                var obj = {
                    date: new Date(req.body.date),
                    concept: req.body.concept,
                    amount: req.body.amount,
                    person: req.body.person,
                    account: req.body.account
                };

                if (!req.body.date ||
                    !isValidDate(obj.date) ||
                    !obj.concept ||
                    !obj.amount ||
                    isNaN(obj.amount) ||
                    !obj.person ||
                    !obj.account) {
                    res.sendStatus(400);
                    return;
                }

                if(req.body.splitId) {
                    obj.splitId = req.body.splitId;
                }

                repo.update(id, obj, function (err, result) {
                    if (err) {
                        logger.error(err);
                        res.sendStatus(500);
                        return;
                    }

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }

                    res.sendStatus(200);
                });
            },
            delete: function (req, res) {
                var id = req.params.id;

                repo.delete(id, function (err, result) {
                    if (err) {
                        logger.error(err);
                        res.sendStatus(500);
                        return;
                    }

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }

                    res.sendStatus(200);
                });
            }
        }
    };
};
