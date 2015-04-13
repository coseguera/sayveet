'use strict';

module.exports = function (repo, logger) {
    return {
        '/': {
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
                    id: req.body.id,
                    name: req.body.name
                };

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
            }
        }
    };
};
