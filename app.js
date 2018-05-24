var express = require('express')
var port = process.env.PORT || 3000
var path = require('path')
var bodyParser = require('body-parser')
var app = express()

var mongoose = require('mongoose'); // 加载mongoose模块
var movie = require('./models/movie.js'); // 载入mongoose编译后的模型movie
mongoose.connect('mongodb://localhost:27017/imovie'); // 连接mongodb本地数据库imovie
var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段
app.locals.moment = require('moment'); // 载入moment模块，格式化日期

app.set('views','./views/pages')
app.set('view engine','jade')
// 表单数据格式化
// app.use(express.bodyParser)
// 控制静态文件从bower_components获取
// app.use(require('body-parser').urlencoded({extended: true}))
// app.use(express.static(path.join(__dirname, 'bower_components')))  //__dirname代表当前目录
app.use(express.static(path.join(__dirname)))  //__dirname代表当前目录
app.use(bodyParser.urlencoded())
app.listen(port)

console.log('imooc started on port ' + port)

// index page
app.get('/',function(req,res) {
	movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {  // 渲染index 首页
            title: 'i_movie 首页',
            movies: movies
        });
    });

	// res.render('index',{
	// 	title: 'imooc 首页',
	// 	movies: [
	// 	{
	// 		title: '超级警察',
	// 		_id:1,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	},{
	// 		title: '超级警察',
	// 		_id:2,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	},{
	// 		title: '超级警察',
	// 		_id:3,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	},{
	// 		title: '超级警察',
	// 		_id:4,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	},{
	// 		title: '超级警察',
	// 		_id:5,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	},{
	// 		title: '超级警察',
	// 		_id:6,
	// 		poster: 'http://image.game.uc.cn/2015/4/9/10386575.jpg'
	// 	}]
	// })
})

// detail page
app.get('/movie/:id',function(req,res) {
	var id = req.params.id;
    movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'i_movie' + movie.title,
            movie: movie
        });
    });
	// res.render('detail',{
	// 	title: 'imooc 详情页',
	// 	movie: {
	// 		director: '张艺谋',
	// 		country: '中国',
	// 		title: '超级警察',
	// 		year: 2014,
	// 		poster: 'http://www.baidu.com',
	// 		language: '英语',
	// 		flash: 'flash5952.swf',
	// 		summary: '本片是一部科幻、悬疑、恐怖大片，警察join通过重重难关，打开秦始皇帝陵的故事。本片是一部科幻、悬疑、恐怖大片，警察join通过重重难关，打开秦始皇帝陵的故事本片是一部科幻、悬疑、恐怖大片，警察join通过重重难关，打开秦始皇帝陵的故事'
	// 	}
	// })
})


// admin update movie 后台更新页
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imovie 后台更新页',
                movie: movie
            });
        });
    }
});

// admin post movie 后台录入提交
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (id !== 'undefined') { // 已经存在的电影数据
        movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {  // 新加的电影
        _movie = new movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
});

// admin page
app.get('/admin/movie',function(req,res) {
	res.render('admin',{
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			director: '',
			country: '',
			year: '',
			poster: '',
			falsh: '',
			summary: '',
			language: '',
		}
	})
})

// list page 列表页
app.get('/admin/list',function(req,res) {
	movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'i_movie 列表页',
            movies: movies
        });
    });
	// res.render('list',{
	// 	title: 'imooc 列表页',
	// 	movies: [{
	// 		title: '超级警察',
	// 		_id:1,
	// 		director: '张艺谋',
	// 		country: '中国',
	// 		year: 2014,
	// 		// poster: '',
	// 		falsh: 'http://my.tv.sohu.com/us/232653571/78502525.shtml',
	// 		// summary: ''
	// 		language: '英语',
	// 	}]
	// })
})

// list delete movie data 列表页删除电影
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
});