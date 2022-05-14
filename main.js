"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketStreamConverter = SocketStreamConverter;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _websocket = require("websocket");

var _rxjs = require("rxjs");

var _delay = _interopRequireDefault(require("delay"));

var warned = false;

function SocketStreamConverter(wsurl) {
  var stream$ = new _rxjs.Subject();
  var client = new _websocket.client();
  client.on('connect', function (connection) {
    console.info("[socket-stream-converter] Connection to ".concat(wsurl, " successful\""));
    connection.on('close', function () {
      connect();
    });
    connection.on('message', function (_ref) {
      var utf8Data = _ref.utf8Data;
      stream$.next(JSON.parse(utf8Data));
    });
  });
  client.on('connectFailed', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!warned) {
              console.warn("[socket-stream-converter] Connection to ".concat(wsurl, " failed, retrying continuously."));
              warned = true;
            }

            _context.next = 3;
            return (0, _delay["default"])(5000);

          case 3:
            connect();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));

  function connect() {
    client.connect(wsurl);
  }

  connect();
  return stream$;
}
