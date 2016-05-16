var express = require('express'),
	app = express(),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	user = require('./app/routes/user'),
	product = require('./app/routes/product'),
	product_main_category = require('./app/routes/product_main_category'),
	product_sub_category = require('./app/routes/product_sub_category'),
	payment = require('./app/routes/payment'),
	cart = require('./app/routes/cart'),
	store = require('./app/routes/store'),
	upload = require('./app/routes/upload'),
	ordered = require('./app/routes/ordered'),
	rwmi = require('./app/routes/rwmi'),
	product_category = require('./app/routes/product_category'),
	port = process.env.PORT || 2000;
//updating all stores     
// var mongoose = require('mongoose'),
// db = mongoose.createConnection('mongodb://127.0.0.1/multi_vendor'),
//     Store = require('./app/models/store.js')(db);
    
// Store.update({},{product_limit:2}, {multi: true},function(err,res){
//     console.log(res)
// })
    
require('./app/config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(session({secret: 'this is multivendor', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());


//check if is vendor / admin to view get api
var auth_vendor = function(req, res, next){
	if(!req.isAuthenticated()){
		res.sendStatus(401);
	}else if(req.user.response.role.indexOf('seller') < 0){
		if(req.user.response.role.indexOf('admin') < 0){
			res.sendStatus(401);
		}else{
			next();
		}
	}else{
		next();
	}
}

app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.post('/api/login', passport.authenticate('local-login'), user.login);
app.post('/api/register', passport.authenticate('local-register'), user.register);
app.get('/loggedin', user.loggedin);
app.post('/logout', user.logout);
app.get('/api/validate', user.validate);
app.put('/api/user', user.update_user);
app.put('/api/user_qrpay', user.user_qrpay);
app.post('/api/user_check', user.user_check);

//product__main_category
app.post('/api/main_category', product_main_category.insert_category);
app.get('/api/main_category',  product_main_category.get_category);
app.put('/api/main_category', product_main_category.update_category);
app.post('/api/update_category_image', product_main_category.update_category_image);
app.post('/api/insert_category_json', product_main_category.insert_category_json);

//product__sub_category
app.post('/api/sub_category', product_sub_category.insert_category);
app.get('/api/sub_category',  product_sub_category.get_category);
app.put('/api/sub_category', product_sub_category.update_category);
app.get('/api/product_category', product_category.get_category);
app.post('/api/insert_sub_category_json', product_sub_category.insert_sub_category_json);

//product
app.post('/api/product', product.insert_product);
app.get('/api/product/:page/:size/:id', product.get_product_vendor);
app.get('/api/product', product.get_product);
app.put('/api/product', product.update_product);
app.delete('/api/product/:id', product.delete_product);
app.put('/api/product_status', product.update_status);
app.get('/api/vendor/:name', product.get_vendor);
app.post('/api/get_product_vendor', product.get_product_vendor_data);

//product details
app.get('/api/product_detail/:id', product.get_product_detail);
app.get('/api/product_details/:id', product.get_product_details);

//cart
app.post('/api/cart', cart.add_to_cart);
app.get('/api/cart/:id', cart.get_order);
app.get('/api/cart', cart.get_orders);
app.put('/api/cart', cart.update_order);
app.put('/api/cart_order', cart.delete_order);
app.put('/api/cart_uniqid_update', cart.cart_uniqid_update);
//store
app.post('/api/store', store.add);
app.get('/api/store', store.get);
app.post('/api/update_store_name', store.update_store_name);
app.post('/api/update_store_landing', store.update_store_landing);
app.post('/api/update_store_productlayout', store.update_store_productpage);

//payment
app.get('/api/payment/:id/:seller', payment.create);
app.get('/api/payment_get', payment.get);

//ordered
app.get('/api/ordered/:store', ordered.get_order);
app.post('/api/qrpay_order', ordered.qr_save_order);
app.post('/api/update_order_status', ordered.update_order_status);

//upload image
app.post('/api/upload', upload.image);
app.post('/api/captcha', upload.captcha);


app.post('/api/rwmi', rwmi.generate_payment);
app.post('/api/rwmi_delete_payment', rwmi.rwmi_delete_payment);
app.post('/api/rwmi_recall_payment', rwmi.rwmi_recall_payment);

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.listen(port);
console.log("Live at localhost: "+port);