/* eslint-disable no-underscore-dangle */
import { logInfo } from './Helpers.js';

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
};

function _disconnect() {
  privateVariables.ws.close();
}

function _clearTimeout() {
  privateVariables.close = false;
  clearTimeout(privateVariables.timeoutConn);
}

function _timeout(time = 10000) {
  privateVariables.close = true;
  privateVariables.timeoutConn = setTimeout(() => {
    if (privateVariables.close) {
      privateVariables.ws.close();
    } else {
      _clearTimeout();
    }
  }, time);
}

function _connect(host, payload) {
  return new Promise((resolve, reject) => {
    if (privateVariables.ws === null) {
      privateVariables.ws = new WebSocket(host);
    } else if (privateVariables.ws.readyState === 2 || privateVariables.ws.readyState === 3) {
      _disconnect();
      try {
        privateVariables.ws = new WebSocket(host);
      } catch (e) {
        reject(e);
      }
    }

    _timeout();

    privateVariables.ws.onopen = () => {
      _clearTimeout();
      privateVariables.ws.send(JSON.stringify(payload));
      _timeout(60000);
    };

    privateVariables.ws.onmessage = (evtMsg) => {
      _clearTimeout();
      resolve(JSON.parse(evtMsg.data));
    };

    privateVariables.ws.onerror = (evtError) => {
      _clearTimeout();
      reject(evtError);
    };
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
    this.orderId = props.orderId || '';
    this.__amount = 0;
    if (props.amount) this.amount = props.amount;
    this.__transactionDate = (new Date(Date.now())).toLocaleDateString('pt-BR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }).replace(/\//g, '');
    this.ctfTransaction = {};
  }

  debugLog(message) {
    if (this.debug) {
      logInfo(message);
    }
  }

  classError(message) {
    this.debugLog((typeof message === 'object') ? message.text : message);
    return new Error(message);
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

      this.debugLog(`Pagamento com cartão de crédito. Operação: ${requisition.operacao}. Valor ${this.amount} centavos`);
      _connect(this.__host, requisition)
        .then((response) => {
          if (response.retorno > 0) {
            const errorMsg = privateVariables.errorCodes[response.codigoErro]
                             || (response.display.length)
                             ? response.display.map(m => m.mensagem).join(' ')
                             : ' ';
            const error = this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`);
            reject(error);
          }

          this.ctfTransaction = {
            ...response,
            dataTransacao: this.__transactionDate,
          };
          this.debugLog(`Resposta do servidor -> ${JSON.stringify(response)}`);
          resolve(response);
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
      const operacao = isVoucher
                       ? privateVariables.transactions.debit.voucher
                       : privateVariables.transactions.debit.base;

      this.debugLog(`Pagamento com cartão de débito. Operação: ${operacao}. Valor ${this.amount} centavos`);
      _connect(this.__host, {
        valorTransacao: this.amount,
        documento: this.orderId,
        dataTransacao: this.__transactionDate,
        operacao,
      })
        .then((response) => {
          if (response.retorno > 0) {
            const errorMsg = privateVariables.errorCodes[response.codigoErro]
                             || (response.display.length)
                             ? response.display.map(m => m.mensagem).join(' ')
                             : ' ';
            const error = this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`);
            reject(error);
          }

          this.ctfTransaction = {
            ...response,
            dataTransacao: this.__transactionDate,
          };
          this.debugLog(`Resposta do servidor -> ${JSON.stringify(response)}`);
          resolve(response);
        });
    });
  }

  /**
   * Confirma a operação com o CTF
   * @returns {Promise<void>}
   */
  confirm() {
    return new Promise((resolve, reject) => {
      const operacao = privateVariables.transactions.confirm;
      this.debugLog(`Confirmação de pagamento da operação realizada.
      Operação: ${this.ctfTransaction.operacao}
      Data: ${this.ctfTransaction.dataTransacao}
      Valor: ${this.amount}
      Bandeira: ${this.ctfTransaction.bandeira}
      Cartão: ${this.ctfTransaction.cartao}`);
      _connect(this.__host, { operacao })
        .then((response) => {
          if (response.retorno > 0) {
            const errorMsg = privateVariables.errorCodes[response.codigoErro]
                             || (response.display.length)
                             ? response.display.map(m => m.mensagem).join(' ')
                             : ' ';
            reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
          }

          this.ctfTransaction = Object.assign(this.ctfTransaction, response);
          this.debugLog(`Resposta do servidor -> ${JSON.stringify(response)}`);
          resolve(response);
        });
    });
  }

  /**
   * Inicia o processo de cancelamento de compra.
   * @returns {Promise<void>}
   */
  requestCancellation() {
    return new Promise((resolve, reject) => {
      const operacao = privateVariables.transactions.requestCancel;
      this.debugLog(`Requisição de cancelamento de compra.
      Operação: ${this.ctfTransaction.operacao}
      Data: ${this.ctfTransaction.dataTransacao}
      Valor: ${this.amount}
      NSU: ${this.ctfTransaction.nsuCTF}`);
      _connect(this.__host, { operacao })
        .then((response) => {
          if (response.retorno > 0) {
            const errorMsg = privateVariables.errorCodes[response.codigoErro]
                             || (response.display.length)
                             ? response.display.map(m => m.mensagem).join(' ')
                             : ' ';
            reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
          }

          this.debugLog(`Resposta do servidor -> ${JSON.stringify(response)}`);
          resolve(response);
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
      const operacao = privateVariables.transactions.cancel;
      const tefOperacao = prop.operacao || this.ctfTransaction.operacao;
      const tefDataTransacao = prop.dataTransacao || this.ctfTransaction.dataTransacao;
      const tefAmount = prop.amount ? (parseFloat(prop.amount) * 100) : this.ctfTransaction.valorTransacao;
      const tefNsuCTF = prop.nsuCTF || this.ctfTransaction.nsuCTF;

      this.debugLog(`Cancelamento de compra.
      Operação: ${tefOperacao}
      Data: ${tefDataTransacao}
      Valor: ${tefAmount}
      NSU: ${tefNsuCTF}`);
      _connect(this.__host, {
        operacao,
        valorTransacao: tefAmount,
        dataTransacao: tefDataTransacao,
        nsuCTF: tefNsuCTF,
      })
        .then((response) => {
          if (response.retorno > 0) {
            const errorMsg = privateVariables.errorCodes[response.codigoErro] || response.display[0].mensagem;
            reject(this.classError(`Transação não concluída ${response.codigoErro}: ${errorMsg}`));
          }

          this.debugLog(`Resposta do servidor -> ${JSON.stringify(response)}`);
          resolve(response);
        });
    });
  }
}

export default Auttar;
