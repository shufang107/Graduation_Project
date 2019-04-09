module.exports = app => {
    app.get('/api/test', function (req, res, next) {
        res.send({
            code: 0,
            msg: '哈哈哈！跨域调取！'
        });
    });
}
