/* eslint-disable no-underscore-dangle */
import {
  logInfo, logError, logMethod, logWarn, sleep,
} from './Helpers';

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
  timeoutMs: 60000,
  debug: false,
};

function _disconnect() {
  if (privateVariables.debug) {
    logMethod('_disconnect');
  }

  privateVariables.ws.close();
}

function _clearTimeout() {
  if (privateVariables.debug) {
    logMethod('_clearTimeout');
    logInfo('Clearing WebSocket timeout.');
  }

  privateVariables.close = false;
  clearTimeout(privateVariables.timeoutConn);
  privateVariables.close = true;
}

function _timeout(time = 10000) {
  return new Promise((resolve, reject) => {
    if (privateVariables.debug) {
      logMethod('_timeout', 'time', time);
      logInfo('Starting WebSocket timeout.');
    }

    privateVariables.timeoutConn = setTimeout(() => {
      if (!privateVariables.close) {
        _clearTimeout();
        resolve(true);
      } else {
        privateVariables.ws.close();
        reject(new Error('Connection Timeout.'));
      }
    }, time);
  });
}

function _connect(host, payload) {
  if (privateVariables.debug) {
    logMethod('_connect', 'host', host);
  }

  return new Promise((resolve, reject) => {
    try {
      if (privateVariables.ws === null) {
        if (privateVariables.debug) {
          logInfo('Starting WebSocket Connection.');
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
      _timeout();

      const sendRequest = () => {
        if (privateVariables.debug) {
          logInfo('Sending a message to the WebSocket.');
          logInfo(JSON.stringify(payload));
        }

        _clearTimeout();
        privateVariables.ws.send(JSON.stringify(payload));
        _timeout(privateVariables.timeoutMs)
          .catch(e => reject(e));
      };

      if (privateVariables.ws.readyState === 1) {
        sendRequest();
      } else {
        privateVariables.ws.onopen = () => {
          if (privateVariables.debug) {
            logInfo('WebSocket Connected.');
          }

          sendRequest();
        };
      }

      privateVariables.ws.onmessage = (evtMsg) => {
        if (privateVariables.debug) {
          logInfo('Received a message from the WebSocket.');
          logInfo(JSON.stringify(evtMsg.data));
        }

        _clearTimeout();
        resolve(JSON.parse(evtMsg.data));
      };

      privateVariables.ws.onerror = (evtError) => {
        if (privateVariables.debug) {
          logWarn('WebSocket has returned an error.');
          logError(JSON.stringify(evtError));
        }

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
 * @property {number} webSocketTimeout - SocketTimeout
 * @property {number} sleepTimeout - sleepTimeout
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
    privateVariables.timeoutMs = props.webSocketTimeout || 60000;
    this.orderId = props.orderId || '';
    this.__amount = 0;
    this.__sleepTimeout = props.sleepTimeout || 1000;
    if (props.amount) this.amount = props.amount;
    this.__transactionDate = new Date()
      .toLocaleDateString(
        'pt-BR',
        {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'America/Sao_Paulo',
        },
      )
      .replace(/\//g, '');
    this.ctfTransaction = {};
    this.__debugMessage = [];
  }

  debugLog(message) {
    if (this.debug) {
      logInfo(JSON.stringify(message));
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
      };

      if (debugLog.logLevel === 'log' && debugLog.message) {
        return this.debugLog(debugLog.message);
      }

      this.__debugMessage
          .push({
                  ...debugLog,
                  date: new Date().toISOString(),
                });

      return this.debugLog(debugLog.message);
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

  /**
   * Pagamento com cartão de crédito, podendo ser declarado
   * com parcelamento e se o juro é da administradora.
   * @param {number} installments - número de parcelas
   * @param {boolean} withInterest - juros pela administradora
   * @returns {Promise<AuttarSuccessResponse>}
   */
  credit(installments = 1, withInterest = false) {
    return new Promise((resolve, reject) => {
      this.debugLogMethod('credi', 'installments, withInterest', installments, withInterest);
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
      sleep(this.__sleepTimeout)
        .then(() => {
          _connect(this.__host, requisition)
            .then((response) => {
              if (response.retorno > 0) {
                const errorMsg = privateVariables.errorCodes[response.codigoErro]
                                 || response.display.length
                                 ? response.display.map(m => m.mensagem)
                                           .join(' ')
                                 : ' ';

                reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
              }

              this.ctfTransaction = {
                ...response,
                dataTransacao: this.__transactionDate,
              };

              this.debugMessage = {
                message: this.ctfTransaction,
              };

              resolve({
                        documento: this.orderId,
                        dataTransacao: this.__transactionDate,
                        ...response,
                      });
            })
            .catch(e => this.classError(e));
        });
    });
  }

  /**
   * Pagamento com cartão de crédito, podendo ser
   * declarado com parcelamento e se o juro é da administradora.
   * @param {boolean} isVoucher
   * @returns {Promise<AuttarSuccessResponse>}
   */
  debit(isVoucher = false) {
    return new Promise((resolve, reject) => {
      this.debugLogMethod('debit', 'isVoucher', isVoucher);
      const operacao = isVoucher
                       ? privateVariables.transactions.debit.voucher
                       : privateVariables.transactions.debit.base;

      this.debugMessage = {
        message: `Pagamento com cartão de débito. Operação: ${operacao}. Valor ${this.amount} centavos`,
      };
      sleep(this.__sleepTimeout)
        .then(() => {
          _connect(this.__host, {
            valorTransacao: this.amount,
            documento: this.orderId,
            dataTransacao: this.__transactionDate,
            operacao,
          })
            .then((response) => {
              if (response.retorno > 0) {
                const errorMsg = privateVariables.errorCodes[response.codigoErro]
                                 || response.display.length
                                 ? response.display.map(m => m.mensagem)
                                           .join(' ')
                                 : ' ';

                reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
              }

              this.ctfTransaction = {
                ...response,
                dataTransacao: this.__transactionDate,
              };

              this.debugMessage = {
                message: this.ctfTransaction,
              };

              resolve({
                        documento: this.orderId,
                        dataTransacao: this.__transactionDate,
                        ...response,
                      });
            })
            .catch(e => this.classError(e));
        });
    });
  }

  /**
   * Confirma a operação com o CTF
   * @returns {Promise<void>}
   */
  confirm() {
    return new Promise((resolve, reject) => {
      this.debugLogMethod('confirm');
      const operacao = privateVariables.transactions.confirm;
      sleep(this.__sleepTimeout)
        .then(() => {
          _connect(this.__host, { operacao })
            .then((response) => {
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

                reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
              }

              this.ctfTransaction = Object.assign(this.ctfTransaction, response);
              this.debugMessage = {
                message: this.ctfTransaction,
              };

              resolve({
                        ...this.ctfTransaction,
                        ...response,
                      });
            })
            .catch(e => this.classError(e));
        });
    });
  }

  /**
   * Inicia o processo de cancelamento de compra.
   * @returns {Promise<void>}
   */
  requestCancellation() {
    return new Promise((resolve, reject) => {
      this.debugLogMethod('requestCancellation');
      const operacao = privateVariables.transactions.requestCancel;
      sleep(this.__sleepTimeout)
        .then(() => {
          _connect(this.__host, { operacao })
            .then((response) => {
              this.debugMessage = {
                message: `Requisição de cancelamento de compra.
      Operação: ${this.ctfTransaction.operacao}
      Data: ${this.ctfTransaction.dataTransacao}
      Valor: ${this.amount}
      NSU: ${this.ctfTransaction.nsuCTF}`,
              };
              if (response.retorno > 0) {
                const errorMsg = privateVariables.errorCodes[response.codigoErro]
                                 || response.display.length
                                 ? response.display.map(m => m.mensagem)
                                           .join(' ')
                                 : ' ';

                reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
              }

              this.debugMessage = {
                message: response,
              };

              resolve({
                        ...this.ctfTransaction,
                        ...response,
                      });
            })
            .catch(e => this.classError(e));
        });
    });
  }

  /**
   * Realiza o cancelamento da compra.
   * @param {string} prop.dataTransacao
   * @param {number} prop.amount
   * @param {string} prop.nsuCTF
   * @param {string} prop.operacao
   * @returns {Promise<any>}
   */
  cancel(prop = {}) {
    return new Promise((resolve, reject) => {
      this.debugLogMethod('cancel', 'prop', prop);
      const operacao = privateVariables.transactions.cancel;
      const tefOperacao = prop.operacao || this.ctfTransaction.operacao;
      const tefDataTransacao = prop.dataTransacao || this.ctfTransaction.dataTransacao;
      const tefAmount = prop.amount ? parseFloat(prop.amount) * 100 : this.ctfTransaction.valorTransacao;
      const tefNsuCTF = prop.nsuCTF || this.ctfTransaction.nsuCTF;
      sleep(this.__sleepTimeout)
        .then(() => {
          _connect(this.__host, {
            operacao,
            valorTransacao: tefAmount,
            dataTransacao: tefDataTransacao,
            nsuCTF: tefNsuCTF,
          })
            .then((response) => {
              this.debugMessage = {
                message: `Cancelamento de compra.
        Operação: ${tefOperacao}
        Data: ${tefDataTransacao}
        Valor: ${tefAmount}
        NSU: ${tefNsuCTF}`,
              };
              if (response.retorno > 0) {
                const errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display[0].mensagem;

                reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
              }

              this.debugMessage = {
                message: response,
              };

              resolve({
                        ...this.ctfTransaction,
                        ...response,
                      });
            })
            .catch(e => this.classError(e));
        });
    });
  }
}

export default Auttar;
