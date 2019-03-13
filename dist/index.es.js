function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var objectSpread = _objectSpread;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

var NAME = '%c Auttar ';
var BACKGROUND = 'background:#bc0909 ; padding: 2px; border-radius: 2px;  color: #fff ';
function logInfo(msg) {
  console.log(NAME, BACKGROUND, msg); // eslint-disable-line no-console
}

var privateVariables = {
  transactions: {
    credit: {
      base: 112,
      installment: 113,
      installmentWithInterest: 114
    },
    debit: {
      base: 101,
      voucher: 106
    },
    cancel: 128,
    confirm: 6,
    requestCancel: 191
  },
  return: {
    success: 0,
    timeOut: 1,
    notAuthorizes: 5,
    internetError: 10,
    intertefError: 12,
    error: 20,
    ecommerceError: 30
  },
  errorCodes: {
    5300: 'Valor não informado',
    5301: 'Cartão inválido',
    5302: 'Cartão vencido',
    5303: 'Data de vencimento inválido',
    5304: 'Código de segurança inválido',
    5305: 'Taxa de serviço excede limite',
    5306: 'Operação não permitida',
    5307: 'Dados inválidos',
    5308: 'Valor mínimo da parcela inválido',
    5309: 'Número de parcelas inválido',
    5310: 'Número de parcelas excede limite',
    5311: 'Valor da entrada maior ou igual ao valor da transação',
    5312: 'Valor da parcela inválido',
    5313: 'Data inválida',
    5314: 'Prazo excede limite',
    5316: 'NSU inválido',
    5317: 'Operação cancelada pelo usuário',
    5318: 'Documento inválido (CPF ou CNPJ)',
    5319: 'Valor do documento inválido',
    5328: 'Erro na captura de dados do Pin-Pad',
    5329: 'Erro na captura do chip ou cartão removido antes da hora.',
    5364: 'Data de emissão do cartão inválida',
    5355: 'O tipo de financiamento informado não é coerente com o número de parcelas'
  },
  ws: null,
  timeout: null,
  close: true,
  timeoutConn: null
};

function _disconnect() {
  privateVariables.ws.close();
}

function _clearTimeout() {
  privateVariables.close = false;
  clearTimeout(privateVariables.timeoutConn);
}

function _timeout() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
  privateVariables.close = true;
  privateVariables.timeoutConn = setTimeout(function () {
    if (privateVariables.close) {
      privateVariables.ws.close();
    } else {
      _clearTimeout();
    }
  }, time);
}

function _connect(host, payload) {
  return new Promise(function (resolve, reject) {
    try {
      if (privateVariables.ws === null) {
        privateVariables.ws = new WebSocket(host);
      } else if (privateVariables.ws.readyState === 2 || privateVariables.ws.readyState === 3) {
        _disconnect();

        privateVariables.ws = new WebSocket(host);
      }
    } catch (e) {
      reject(e);
    }

    if (privateVariables.ws) {
      _timeout();

      privateVariables.ws.onopen = function () {
        _clearTimeout();

        privateVariables.ws.send(JSON.stringify(payload));

        _timeout(60000);
      };

      privateVariables.ws.onmessage = function (evtMsg) {
        _clearTimeout();

        resolve(JSON.parse(evtMsg.data));
      };

      privateVariables.ws.onerror = function (evtError) {
        _clearTimeout();

        reject(evtError);
      };
    }
  });
}
/**
 * @typedef {Object} AuttarCupomLinha
 * @property {string} linha
 */

/** @typedef {Object} AuttarSuccessResponse
 * @property {String} bandeira
 * @property {String} cartao
 * @property {String} codigoAprovacao
 * @property {String} codigoErro
 * @property {String} codigoRespAutorizadora
 * @property {Array} cupomCliente
 * @property {Array.<AuttarCupomLinha>} cupomEstabelecimento
 * @property {Array.<AuttarCupomLinha>} cupomReduzido
 * @property {Array} display
 * @property {Number} nsuAutorizadora
 * @property {Number} nsuCTF
 * @property {Number} operacao
 * @property {String} redeAdquirente
 * @property {Number} retorno
 * @property {String} valorTransacao
 */

/**
 * @class Auttar WebSocket
 * @constructor {AuttarConstructor}
 */

/**
 * @typedef {object} AuttarConstructor
 * @property {string} host - WebSocket Host URL
 * @property {boolean} debug - Método debug da classe
 * @property {string} orderId - Número de identificação da venda
 * @property {float} amount - Valor da venda
 * @property {AuttarSuccessResponse} ctfTrasaction - Objecto de resposta do websocket
 */


var Auttar =
/*#__PURE__*/
function () {
  /**
   * Construtor da classe
   * @param {AuttarConstructor} props
   */
  function Auttar(props) {
    classCallCheck(this, Auttar);

    this.__host = props.host || 'ws://localhost:2500';
    this.debug = props.debug || false;
    this.orderId = props.orderId || '';
    this.__amount = 0;
    if (props.amount) this.amount = props.amount;
    this.__transactionDate = new Date().toLocaleDateString('pt-BR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Sao_Paulo'
    }).replace(/\//g, '');
    this.ctfTransaction = {};
    this.__debugMessage = [];
  }

  createClass(Auttar, [{
    key: "debugLog",
    value: function debugLog(message) {
      if (this.debug) {
        logInfo(message);
      }
    }
  }, {
    key: "classError",
    value: function classError(message) {
      this.debugMessage = {
        message: message,
        logLevel: 'error'
      };
      return new Error(message);
    }
  }, {
    key: "credit",

    /**
     * Pagamento com cartão de crédito, podendo ser declarado
     * com parcelamento e se o juro é da administradora.
     * @param {number} installments - número de parcelas
     * @param {boolean} withInterest - juros pela administradora
     * @returns {Promise<AuttarSuccessResponse>}
     */
    value: function credit() {
      var _this = this;

      var installments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var withInterest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return new Promise(function (resolve, reject) {
        var requisition = {
          valorTransacao: _this.amount,
          documento: _this.orderId,
          operacao: privateVariables.transactions.credit.base,
          dataTransacao: _this.__transactionDate
        };

        if (installments > 1) {
          requisition.operacao = privateVariables.transactions.credit.installment;
          requisition.numeroParcelas = installments;
        }

        if (installments > 1 && withInterest) {
          requisition.operacao = privateVariables.transactions.credit.installmentWithInterest;
          requisition.numeroParcelas = installments;
        }

        _this.debugMessage = {
          message: "Pagamento com cart\xE3o de cr\xE9dito. Opera\xE7\xE3o: ".concat(requisition.operacao, ". Valor ").concat(_this.amount, " centavos")
        };

        _connect(_this.__host, requisition).then(function (response) {
          if (response.retorno > 0) {
            var errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display.length ? response.display.map(function (m) {
              return m.mensagem;
            }).join(' ') : ' ';

            var error = _this.classError("Transa\xE7\xE3o n\xE3o conclu\xEDda ".concat(response.codigoErro, ": ").concat(errorMsg));

            reject(error);
          }

          _this.ctfTransaction = objectSpread({}, response, {
            dataTransacao: _this.__transactionDate
          });
          _this.debugMessage = {
            message: "Resposta do servidor -> ".concat(JSON.stringify(response)),
            logLevel: 'log'
          };
          _this.debugMessage = {
            message: _this.ctfTransaction,
            logLevel: 'json'
          };
          resolve(response);
        }).catch(function (e) {
          return _this.classError(e);
        });
      });
    }
    /**
     * Pagamento com cartão de crédito, podendo ser
     * declarado com parcelamento e se o juro é da administradora.
     * @param {boolean} isVoucher
     * @returns {Promise<AuttarSuccessResponse>}
     */

  }, {
    key: "debit",
    value: function debit() {
      var _this2 = this;

      var isVoucher = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return new Promise(function (resolve, reject) {
        var operacao = isVoucher ? privateVariables.transactions.debit.voucher : privateVariables.transactions.debit.base;
        _this2.debugMessage = {
          message: "Pagamento com cart\xE3o de d\xE9bito. Opera\xE7\xE3o: ".concat(operacao, ". Valor ").concat(_this2.amount, " centavos")
        };

        _connect(_this2.__host, {
          valorTransacao: _this2.amount,
          documento: _this2.orderId,
          dataTransacao: _this2.__transactionDate,
          operacao: operacao
        }).then(function (response) {
          if (response.retorno > 0) {
            var errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display.length ? response.display.map(function (m) {
              return m.mensagem;
            }).join(' ') : ' ';

            var error = _this2.classError("Transa\xE7\xE3o n\xE3o conclu\xEDda ".concat(response.codigoErro, ": ").concat(errorMsg));

            reject(error);
          }

          _this2.ctfTransaction = objectSpread({}, response, {
            dataTransacao: _this2.__transactionDate
          });
          _this2.debugMessage = {
            message: "Resposta do servidor -> ".concat(JSON.stringify(response)),
            logLevel: 'log'
          };
          _this2.debugMessage = {
            message: _this2.ctfTransaction,
            logLevel: 'json'
          };
          resolve(response);
        }).catch(function (e) {
          return _this2.classError(e);
        });
      });
    }
    /**
     * Confirma a operação com o CTF
     * @returns {Promise<void>}
     */

  }, {
    key: "confirm",
    value: function confirm() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var operacao = privateVariables.transactions.confirm;
        _this3.debugMessage = {
          message: "Confirma\xE7\xE3o de pagamento da opera\xE7\xE3o realizada.\n      Opera\xE7\xE3o: ".concat(_this3.ctfTransaction.operacao, "\n      Data: ").concat(_this3.ctfTransaction.dataTransacao, "\n      Valor: ").concat(_this3.amount, "\n      Bandeira: ").concat(_this3.ctfTransaction.bandeira, "\n      Cart\xE3o: ").concat(_this3.ctfTransaction.cartao)
        };

        _connect(_this3.__host, {
          operacao: operacao
        }).then(function (response) {
          if (response.retorno > 0) {
            var errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display.length ? response.display.map(function (m) {
              return m.mensagem;
            }).join(' ') : ' ';

            var error = _this3.classError("Transa\xE7\xE3o n\xE3o conclu\xEDda ".concat(response.codigoErro, ": ").concat(errorMsg));

            reject(error);
          }

          _this3.ctfTransaction = Object.assign(_this3.ctfTransaction, response);
          _this3.debugMessage = {
            message: "Resposta do servidor -> ".concat(JSON.stringify(response)),
            logLevel: 'log'
          };
          _this3.debugMessage = {
            message: response,
            logLevel: 'json'
          };
          resolve(response);
        }).catch(function (e) {
          return _this3.classError(e);
        });
      });
    }
    /**
     * Inicia o processo de cancelamento de compra.
     * @returns {Promise<void>}
     */

  }, {
    key: "requestCancellation",
    value: function requestCancellation() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var operacao = privateVariables.transactions.requestCancel;
        _this4.debugMessage = {
          message: "Requisi\xE7\xE3o de cancelamento de compra.\n      Opera\xE7\xE3o: ".concat(_this4.ctfTransaction.operacao, "\n      Data: ").concat(_this4.ctfTransaction.dataTransacao, "\n      Valor: ").concat(_this4.amount, "\n      NSU: ").concat(_this4.ctfTransaction.nsuCTF)
        };

        _connect(_this4.__host, {
          operacao: operacao
        }).then(function (response) {
          if (response.retorno > 0) {
            var errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display.length ? response.display.map(function (m) {
              return m.mensagem;
            }).join(' ') : ' ';

            var error = _this4.classError("Transa\xE7\xE3o n\xE3o conclu\xEDda ".concat(response.codigoErro, ": ").concat(errorMsg));

            reject(error);
          }

          _this4.debugMessage = {
            message: "Resposta do servidor -> ".concat(JSON.stringify(response)),
            logLevel: 'log'
          };
          _this4.debugMessage = {
            message: responsea,
            logLevel: 'json'
          };
          resolve(response);
        }).catch(function (e) {
          return _this4.classError(e);
        });
      });
    }
    /**
     * Realiza o cancelamento da compra.
     * @param {string} prop.dataTransacao
     * @param {number} prop.amount
     * @param {string} prop.nsuCTF
     * @returns {Promise<any>}
     */

  }, {
    key: "cancel",
    value: function cancel() {
      var _this5 = this;

      var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (resolve, reject) {
        var operacao = privateVariables.transactions.cancel;
        var tefOperacao = prop.operacao || _this5.ctfTransaction.operacao;
        var tefDataTransacao = prop.dataTransacao || _this5.ctfTransaction.dataTransacao;
        var tefAmount = prop.amount ? parseFloat(prop.amount) * 100 : _this5.ctfTransaction.valorTransacao;
        var tefNsuCTF = prop.nsuCTF || _this5.ctfTransaction.nsuCTF;
        _this5.debugMessage = {
          message: "Cancelamento de compra.\n        Opera\xE7\xE3o: ".concat(tefOperacao, "\n        Data: ").concat(tefDataTransacao, "\n        Valor: ").concat(tefAmount, "\n        NSU: ").concat(tefNsuCTF)
        };

        _connect(_this5.__host, {
          operacao: operacao,
          valorTransacao: tefAmount,
          dataTransacao: tefDataTransacao,
          nsuCTF: tefNsuCTF
        }).then(function (response) {
          if (response.retorno > 0) {
            var errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display[0].mensagem;

            var error = _this5.classError("Transa\xE7\xE3o n\xE3o conclu\xEDda ".concat(response.codigoErro, ": ").concat(errorMsg));

            reject(error);
          }

          _this5.debugMessage = {
            message: "Resposta do servidor -> ".concat(JSON.stringify(response)),
            logLevel: 'log'
          };
          _this5.debugMessage = {
            message: response,
            logLevel: 'json'
          };
          resolve(response);
        }).catch(function (e) {
          return _this5.classError(e);
        });
      });
    }
  }, {
    key: "debugMessage",
    get: function get() {
      return this.__debugMessage;
    },
    set: function set(value) {
      if (this.debug) {
        var debugLog = objectSpread({
          logLevel: 'info',
          message: ''
        }, value, {
          date: new Date().toISOString()
        });

        if (debugLog.logLevel === 'log' && debugLog.message) {
          return this.debugLog(debugLog.message);
        }

        this.__debugMessage.push(objectSpread({}, debugLog, {
          date: new Date().toISOString()
        }));

        if (debugLog.logLevel === 'info' && debugLog.message) {
          this.debugLog(debugLog.message);
        }
      }
    }
  }, {
    key: "amount",
    get: function get() {
      return this.__amount;
    }
    /**
     * Define o valor em para a classe em centavos
     * @param value
     */
    ,
    set: function set(value) {
      if (typeof value === 'number' && value <= 0) {
        throw new Error('Não é possível definir um valor menor ou igual a zero.');
      } else {
        this.__amount = parseFloat(value) * 100;
      }
    }
  }]);

  return Auttar;
}();

export default Auttar;
