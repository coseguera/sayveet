'use strict';

module.exports = function (repo, logger) {
    return {
        '/': {
        },
        '/:id': {
            put: function (req, res) {
                var id = req.params.id;

                var obj = {
                    date: Date.parse(req.body.date),
                    concept: req.body.concept,
                    amount: req.body.amount,
                    person: req.body.person,
                    account: req.body.account
                };

                if(req.body.splitId) {
                    obj.splitId = req.body.splitId;
                }
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
