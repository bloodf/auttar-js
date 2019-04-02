/* eslint-disable */
import { logInfo, logError, logMethod, logWarn } from './Helpers';

const privateVariables = {
  transactions: {
    credit: {
      base: 112,
      installment: 113,
      installmentWithInterest: 114,
    },
    debit: {
      base: 101,
      voucher: 106,
    },
    cancel: 128,
    confirm: 6,
    requestCancel: 191,
  },
  return: {
    success: 0,
    timeOut: 1,
    notAuthorizes: 5,
    internetError: 10,
    intertefError: 12,
    error: 20,
    ecommerceError: 30,
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
    5355: 'O tipo de financiamento informado não é coerente com o número de parcelas',
  },
  ws: null,
  timeout: null,
  close: true,
  timeoutConn: null,
  firstCall: true,
  debug: false,
};

function _disconnect() {
  if (privateVariables.debug) {
    logMethod('_disconnect');
  }

  privateVariables.ws.close();

  if (privateVariables.debug) {
    logInfo('WebSocket Disconnected');
  }
}

function _clearTimeout() {
  if (privateVariables.debug) {
    logMethod('_clearTimeout');
  }

  privateVariables.close = false;
  clearTimeout(privateVariables.timeoutConn);

  if (privateVariables.debug) {
    logInfo('WebSotcket Timeout cleared.');
  }
}

function _timeout(time = 10000) {
  if (privateVariables.debug) {
    logMethod('_timeout', 'time', time);
  }

  privateVariables.close = true;

  if (privateVariables.debug) {
    logInfo('Starting WebSocket Timeout');
  }

  privateVariables.timeoutConn = setTimeout(() => {
    if (privateVariables.close) {
      _disconnect();
    } else {
      _clearTimeout();
    }
  }, time);
}

function _webSocket(host, payload) {
  if (privateVariables.debug) {
    logMethod('_webSocket', 'host, payload', host, payload);
  }

  return new Promise((resolve, reject) => {
    try {
      if (privateVariables.debug) {
        logInfo('Starting WebSocket Connection.');
      }

      if (privateVariables.ws === null) {
        if (privateVariables.debug) {
          logInfo('WebSocket not active, creating a new connection.');
        }

        privateVariables.ws = new WebSocket(host);
      } else if (privateVariables.ws.readyState === 2 || privateVariables.ws.readyState === 3) {
        if (privateVariables.debug) {
          logWarn('WebSocket is connected but not available. Closing connection to start a new one.');
        }

        _disconnect();
        privateVariables.ws = new WebSocket(host);
      }
    } catch (e) {
      reject(e);
    }

    if (privateVariables.ws) {
      _timeout(20000);

      privateVariables.ws.onopen = () => {
        if (privateVariables.debug) {
          logInfo('Setting the WebSocket opening message');
        }

        if (payload) {
          if (privateVariables.debug) {
            logInfo(payload);
          }

          privateVariables.ws.send(JSON.stringify(payload));
        }

        _clearTimeout();
      };

      privateVariables.ws.onmessage = (evtMsg) => {
        if (privateVariables.debug) {
          logInfo('Receiving a message from the WebSocket.');
          logInfo(evtMsg);
        }

        _clearTimeout();
        resolve(JSON.parse(evtMsg.data));
      };

      privateVariables.ws.onerror = (evtError) => {
        if (privateVariables.debug) {
          logWarn('WebSocket has returned an error.');
          logError(evtError);
        }

        _clearTimeout();
        reject(evtError);
      };
    }
  });
}

function _send(payload) {
  if (privateVariables.debug) {
    logMethod('_send', 'payload', payload);
  }

  _timeout(20000);

  return new Promise((resolve, reject) => {
    try {
      if (privateVariables.ws && privateVariables.ws.readyState === 1) {
        if (privateVariables.debug) {
          logInfo('Sending a message to the WebSocket.');
          logInfo(payload);
        }

        privateVariables.ws.send(JSON.stringify(payload));
        privateVariables.ws.onmessage = (evtMsg) => {
          if (privateVariables.debug) {
            logInfo('Received an message from the WebSocket.');
          }

          _clearTimeout();
          resolve(JSON.parse(evtMsg.data));
        };
      } else {
        _clearTimeout();

        setTimeout(() => _send(payload), 5000);
      }
    } catch (error) {

      _clearTimeout();
      reject(error);
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

class Auttar {
  /**
   * Construtor da classe
   * @param {AuttarConstructor} props
   */
  constructor(props) {
    this.__host = props.host || 'ws://localhost:2500';
    this.debug = props.debug || false;
    privateVariables.debug = props.debug || false;
    this.orderId = props.orderId || '';
    this.__amount = 0;
    if (props.amount) this.amount = props.amount;
    this.__transactionDate = new Date()
      .toLocaleDateString(
        'pt-BR',
        {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'America/Sao_Paulo',
        })
      .replace(/\//g, '');
    this.ctfTransaction = {};
    this.__debugMessage = [];
  }

  debugLog(message) {
    if (this.debug) {
      logInfo(message);
    }
  }

  debugWarning(message) {
    if (this.debug) {
      logWarn(message);
    }
  }

  debugLogMethod(method, args, ...params) {
    if (this.debug) {
      logMethod(method, args, params);
    }
  }

  classError(message) {
    this.debugMessage = {
      message,
      logLevel: 'error',
    };

    if (this.debug) {
      logError(message);
    }

    return new Error(message);
  }

  get debugMessage() {
    return this.__debugMessage;
  }

  set debugMessage(value) {
    if (this.debug) {
      const debugLog = {
        logLevel: 'info',
        message: '',
        ...value,
        date: new Date().toISOString(),
      };

      if (debugLog.logLevel === 'log' && debugLog.message) {
        return this.debugLog(debugLog.message);
      }

      this.__debugMessage.push(
        {
          ...debugLog,
          date: new Date().toISOString(),
        }
      );

      if (debugLog.logLevel === 'info' && debugLog.message) {
        this.debugLog(debugLog.message);
      }
    }
  }

  get amount() {
    return this.__amount;
  }

  /**
   * Define o valor em para a classe em centavos
   * @param value
   */
  set amount(value) {
    if (typeof value === 'number' && value <= 0) {
      throw new Error('Não é possível definir um valor menor ou igual a zero.');
    } else {
      this.__amount = parseFloat(value) * 100;
    }
  }

  async init() {
    this.debugLogMethod('init');
    try {
      await _webSocket(this.__host);

      return Promise.resolve(this);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Pagamento com cartão de crédito, podendo ser declarado
   * com parcelamento e se o juro é da administradora.
   * @param {number} installments - número de parcelas
   * @param {boolean} withInterest - juros pela administradora
   * @returns {Promise<AuttarSuccessResponse>}
   */
  async credit(installments = 1, withInterest = false) {
    this.debugLogMethod('credi', 'installments, withInterest', installments, withInterest);
    try {
      const requisition = {
        valorTransacao: this.amount,
        documento: this.orderId,
        operacao: privateVariables.transactions.credit.base,
        dataTransacao: this.__transactionDate,
      };
      if (installments > 1) {
        requisition.operacao = privateVariables.transactions.credit.installment;
        requisition.numeroParcelas = installments;
      }

      if (installments > 1 && withInterest) {
        requisition.operacao = privateVariables.transactions.credit.installmentWithInterest;
        requisition.numeroParcelas = installments;
      }

      this.debugMessage = {
        message: `Pagamento com cartão de crédito. Operação: ${requisition.operacao}. Valor ${this.amount} centavos`,
      };

      const response = await _send(requisition);

      if (response.retorno > 0) {
        const errorMsg = privateVariables.errorCodes[response.codigoErro]
                         || response.display.length
                         ? response.display.map(m => m.mensagem)
                                   .join(' ')
                         : ' ';
        return Promise.reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
      }

      this.ctfTransaction = {
        ...response,
        dataTransacao: this.__transactionDate,
      };

      this.debugMessage = {
        message: `Resposta do servidor -> ${JSON.stringify(response)}`,
        logLevel: 'log',
      };

      this.debugMessage = {
        message: this.ctfTransaction,
        logLevel: 'json',
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Pagamento com cartão de crédito, podendo ser
   * declarado com parcelamento e se o juro é da administradora.
   * @param {boolean} isVoucher
   * @returns {Promise<AuttarSuccessResponse>}
   */
  async debit(isVoucher = false) {
    try {
      this.debugLogMethod('debit', 'isVoucher', isVoucher);

      this.debugMessage = {
        message: `Pagamento com cartão de débito. Operação: ${operacao}. Valor ${this.amount} centavos`,
      };

      const requisition = {
        valorTransacao: this.amount,
        documento: this.orderId,
        dataTransacao: this.__transactionDate,
        operacao: isVoucher
                  ? privateVariables.transactions.debit.voucher
                  : privateVariables.transactions.debit.base,
      };

      const response = await _send(requisition);

      if (response.retorno > 0) {
        const errorMsg = privateVariables.errorCodes[response.codigoErro]
                         || response.display.length
                         ? response.display.map(m => m.mensagem)
                                   .join(' ')
                         : ' ';
        return Promise.reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
      }

      this.ctfTransaction = {
        ...response,
        dataTransacao: this.__transactionDate,
      };

      this.debugMessage = {
        message: `Resposta do servidor -> ${JSON.stringify(response)}`,
        logLevel: 'log',
      };

      this.debugMessage = {
        message: this.ctfTransaction,
        logLevel: 'json',
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Confirma a operação com o CTF
   * @returns {Promise<void>}
   */
  async confirm() {
    try {
      this.debugLogMethod('confirm');
      const response = await _send({ operacao: privateVariables.transactions.confirm });

      this.debugMessage = {
        message: `Confirmação de pagamento da operação realizada.
      Operação: ${this.ctfTransaction.operacao}
      Data: ${this.ctfTransaction.dataTransacao}
      Valor: ${this.amount}
      Bandeira: ${this.ctfTransaction.bandeira}
      Cartão: ${this.ctfTransaction.cartao}`,
      };

      if (response.retorno > 0) {
        const errorMsg = privateVariables.errorCodes[response.codigoErro]
                         || response.display.length
                         ? response.display.map(m => m.mensagem)
                                   .join(' ')
                         : ' ';

        return Promise.reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
      }

      this.ctfTransaction = Object.assign(this.ctfTransaction, response);

      this.debugMessage = {
        message: `Resposta do servidor -> ${JSON.stringify(response)}`,
        logLevel: 'log',
      };

      this.debugMessage = {
        message: response,
        logLevel: 'json',
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Inicia o processo de cancelamento de compra.
   * @returns {Promise<void>}
   */
  async requestCancellation() {
    try {
      this.debugLogMethod('requestCancellation');
      this.debugMessage = {
        message: `Requisição de cancelamento de compra.
      Operação: ${this.ctfTransaction.operacao}
      Data: ${this.ctfTransaction.dataTransacao}
      Valor: ${this.amount}
      NSU: ${this.ctfTransaction.nsuCTF}`,
      };
      const response = await _send({ operacao: privateVariables.transactions.requestCancel });
      if (response.retorno > 0) {
        const errorMsg = privateVariables.errorCodes[response.codigoErro]
                         || response.display.length
                         ? response.display.map(m => m.mensagem)
                                   .join(' ')
                         : ' ';

        return Promise.reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
      }

      this.debugMessage = {
        message: `Resposta do servidor -> ${JSON.stringify(response)}`,
        logLevel: 'log',
      };

      this.debugMessage = {
        message: responsea,
        logLevel: 'json',
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Realiza o cancelamento da compra.
   * @param {string} prop.dataTransacao
   * @param {number} prop.amount
   * @param {string} prop.nsuCTF
   * @returns {Promise<any>}
   */
  async cancel(prop = {}) {
    try {
      this.debugLogMethod('cancel', 'prop', prop);

      const operacao = privateVariables.transactions.cancel;
      const tefOperacao = prop.operacao || this.ctfTransaction.operacao;
      const tefDataTransacao = prop.dataTransacao || this.ctfTransaction.dataTransacao;
      const tefAmount = prop.amount ? parseFloat(prop.amount) * 100 : this.ctfTransaction.valorTransacao;
      const tefNsuCTF = prop.nsuCTF || this.ctfTransaction.nsuCTF;
      this.debugMessage = {
        message: `Cancelamento de compra.
        Operação: ${tefOperacao}
        Data: ${tefDataTransacao}
        Valor: ${tefAmount}
        NSU: ${tefNsuCTF}`,
      };

      const response = await _send(
        {
          operacao,
          valorTransacao: tefAmount,
          dataTransacao: tefDataTransacao,
          nsuCTF: tefNsuCTF,
        }
      );

      if (response.retorno > 0) {
        const errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display[0].mensagem;

        return Promise.reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
      }

      this.debugMessage = {
        message: `Resposta do servidor -> ${JSON.stringify(response)}`,
        logLevel: 'log',
      };

      this.debugMessage = {
        message: response,
        logLevel: 'json',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Auttar;
