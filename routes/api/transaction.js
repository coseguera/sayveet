'use strict';

module.exports = function (repo, logger) {
    function isValidDate(d) {
        return !isNaN(d.getTime());
    }

    function aggregateQuery(from, res) {
        var result = {};
        repo.aggregate(from, '$account', function (err, accountSummaries) {
            if (err) {
                logger.error(err);
                res.sendStatus(500);
                return;
            }

            result.accountSummaries = accountSummaries;

            repo.aggregate(from, '$person', function (errp, personSummaries) {
                if (errp) {
                    logger.error(errp);
                    res.sendStatus(500);
                    return;
                }

                result.personSummaries = personSummaries;

                res.json(result);
            });
        });
    }

    return {
        '/': {
            get: function (req, res) {
                var from;

                if (!req.query.from && !req.query.to) {
                    from = new Date();
                    from.setDate(from.getDate() - 30);
                } else {
                    from = new Date(req.query.from);
                }

                if (req.query.aggregates) {
                    aggregateQuery(from, res);
                } else {
                    var query = {
                        from: from,
                        to: req.query.to
                    };

                    repo.query(query, function (err, result) {
                        if (err) {
                            logger.error(err);
                            res.sendStatus(500);
                            return;
                        }

                        res.json(result);
                    });
                }
            },
            post: function (req, res) {
                var obj = {
                    date: new Date(req.body.date),
                    concept: req.body.concept,
                    amount: req.body.amount,
                    account: req.body.account,
                    person: req.body.person
                };

                if (!req.body.date ||
                    !isValidDate(obj.date) ||
                    !obj.concept ||
                    !obj.amount ||
                    isNaN(obj.amount) ||
                    !obj.account ||
                    !obj.person) {
                    res.sendStatus(400);
                    return;
                }

                if (req.body.splitId) {
                    obj.splitId = req.body.splitId;
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

                repo.get(id, function (err, result) {
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
                    account: req.body.account,
                    person: req.body.person
                };

                if (!req.body.date ||
                    !isValidDate(obj.date) ||
                    !obj.concept ||
                    !obj.amount ||
                    isNaN(obj.amount) ||
                    !obj.account ||
                    !obj.person) {
                    res.sendStatus(400);
                    return;
                }

                if (req.body.splitId) {
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
