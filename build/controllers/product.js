'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _dbconString = require('./dbconString');

var _dbconString2 = _interopRequireDefault(_dbconString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var productControlObj = {};
var schema = _joi2.default.object().keys({
  product_desc: _joi2.default.string().required(),
  unit_price: _joi2.default.number().required(),
  quantity_supplied: _joi2.default.number().required(),
  supplier_name: _joi2.default.string().required(),
  category: _joi2.default.string().required()
});
var schema2 = _joi2.default.object().keys({
  product_desc: _joi2.default.string().required(),
  unit_price: _joi2.default.number().required(),
  quantity_supplied: _joi2.default.number().required(),
  supplier_name: _joi2.default.string().required(),
  category: _joi2.default.string().required(),
  token: _joi2.default.string().required()
});

productControlObj.createProduct = function (req, res) {
  console.log(req.body);
  var result = _joi2.default.validate(req.body, schema);
  if (result.error === null) {
    var pname = req.body.product_desc;
    var unitPrice = req.body.unit_price;
    var quantSup = req.body.quantity_supplied;
    var supplier = req.body.supplier_name;
    var cat = req.body.category;
    var params = [];
    params.push(pname, unitPrice, quantSup, supplier, cat);
    var sql = 'INSERT INTO products (product_desc, unit_price, quantity_in_stock, supplier_name, category) VALUES ( $1, $2, $3, $4, $5);';
    _db2.default.connect(_dbconString2.default, function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, client) {
        var _dbrows;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return client.query(sql, params);

              case 3:
                _dbrows = _context.sent;

                res.status(201).json({
                  message: 'Resource Created!'
                });
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0.message);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 7]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  } else {
    res.status(404).json({
      message: 'resource could not be created',
      Error: result.error
    });
  }
};

productControlObj.getAllProducts = function (req, res) {
  _db2.default.connect(_dbconString2.default, function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, client) {
      var sql, _dbrows2;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              sql = 'SELECT * FROM products';
              _context2.prev = 1;
              _context2.next = 4;
              return client.query(sql);

            case 4:
              _dbrows2 = _context2.sent;
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2['catch'](1);

              console.error(_context2.t0.message);

            case 10:
              res.status(200).json(dbrows.rows);

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[1, 7]]);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};

productControlObj.getProductById = function (req, res) {
  var param = Number(req.params.id);
  var temp = [];
  temp.push(param);
  var sql = 'SELECT * FROM products WHERE product_id = $1';
  _db2.default.connect(function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(err, client) {
      var dbrows;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return client.query(sql, temp);

            case 2:
              dbrows = _context3.sent;

              console.log(dbrows.rows[0]);
              res.status(200).json({
                message: 'Resource Found',
                resorce: dbrows.rows[0]
              });

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};
// Replace
productControlObj.modifyProduct = function (req, res) {
  var param = [];
  param.push(req.params.id);
  var sql = 'SELECT * FROM products WHERE product_id = $1';
  _db2.default.connect(process.env.DATABASE_URL, function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(err, client) {
      var dbrows, params, sql2, dbrows2;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return client.query(sql, param);

            case 2:
              dbrows = _context4.sent;

              if (!dbrows.rows[0].product_id) {
                _context4.next = 16;
                break;
              }

              params = [req.body.product_desc, req.body.unit_price, req.body.quantity_supplied, req.body.supplier_name, req.body.category, req.body.product_id];
              sql2 = 'UPDATE products SET product_desc=$1, unit_price=$2, quantity_in_stock=$3, supplier_name=$4, category=$5 WHERE product_id = $6';
              _context4.prev = 6;
              _context4.next = 9;
              return client.query(sql2, params);

            case 9:
              dbrows2 = _context4.sent;

              res.status(200).json({
                message: 'Resource Updated',
                resorce: dbrows2.rows[0]
              });
              _context4.next = 16;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4['catch'](6);

              console.log(_context4.t0.message);

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[6, 13]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
};

productControlObj.deleteProduct = function (req, res) {
  var param = [];
  param.push(req.body.product_id);
  var sql = 'SELECT product_id FROM products WHERE product_id = $1';
  _db2.default.connect(_dbconString2.default, function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(err, client) {
      var _dbrows3, temp, sql2, dbrows2;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return client.query(sql, param);

            case 3:
              _dbrows3 = _context5.sent;

              console.log(_dbrows3.rows[0]);

              if (!(_dbrows3.rows[0].product_id === req.body.product_id)) {
                _context5.next = 20;
                break;
              }

              console.log(_dbrows3.rows[0]);
              temp = [];

              temp.push(_dbrows3.rows[0].product_id);
              sql2 = 'DELETE FROM products WHERE product_id = $1';
              _context5.prev = 10;
              _context5.next = 13;
              return client.query(sql2, temp);

            case 13:
              dbrows2 = _context5.sent;

              res.status(200).json({
                message: 'Resource Deleted!',
                resorce: dbrows2.rows[0]
              });
              _context5.next = 20;
              break;

            case 17:
              _context5.prev = 17;
              _context5.t0 = _context5['catch'](10);

              console.log(_context5.t0.message);

            case 20:
              _context5.next = 25;
              break;

            case 22:
              _context5.prev = 22;
              _context5.t1 = _context5['catch'](0);

              console.log(_context5.t1.message);

            case 25:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 22], [10, 17]]);
    }));

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());
};

exports.default = productControlObj;