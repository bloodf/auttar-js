/*!
 * auttarjs v0.1.5
 * (c) Heitor Ramon Ribeiro <heitor.ramon@gmail.com>
 * Released under the MIT License.
 */
define(function(){"use strict";function a(a,o){for(var e=0;e<o.length;e++){var n=o[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(a,n.key,n)}}var o="%c Auttar ",e="background:#bc0909 ; padding: 2px; border-radius: 2px;  color: #fff ";var n={transactions:{credit:{base:112,installment:113,installmentWithInterest:114},debit:{base:101,voucher:106},cancel:128,confirm:6,requestCancel:191},return:{success:0,timeOut:1,notAuthorizes:5,internetError:10,intertefError:12,error:20,ecommerceError:30},errorCodes:{5300:"Valor não informado",5301:"Cartão inválido",5302:"Cartão vencido",5303:"Data de vencimento inválido",5304:"Código de segurança inválido",5305:"Taxa de serviço excede limite",5306:"Operação não permitida",5307:"Dados inválidos",5308:"Valor mínimo da parcela inválido",5309:"Número de parcelas inválido",5310:"Número de parcelas excede limite",5311:"Valor da entrada maior ou igual ao valor da transação",5312:"Valor da parcela inválido",5313:"Data inválida",5314:"Prazo excede limite",5316:"NSU inválido",5317:"Operação cancelada pelo usuário",5318:"Documento inválido (CPF ou CNPJ)",5319:"Valor do documento inválido",5328:"Erro na captura de dados do Pin-Pad",5329:"Erro na captura do chip ou cartão removido antes da hora.",5364:"Data de emissão do cartão inválida",5355:"O tipo de financiamento informado não é coerente com o número de parcelas"},ws:null,timeout:null,close:!0,timeoutConn:null};function t(){n.close=!1,clearTimeout(n.timeoutConn)}function r(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e4;n.close=!0,n.timeoutConn=setTimeout(function(){n.close?n.ws.close():t()},a)}function s(a,o){return new Promise(function(e,s){try{null===n.ws?n.ws=new WebSocket(a):2!==n.ws.readyState&&3!==n.ws.readyState||(n.ws.close(),n.ws=new WebSocket(a))}catch(a){s(a)}n.ws&&(r(),n.ws.onopen=function(){t(),n.ws.send(JSON.stringify(o)),r(6e4)},n.ws.onmessage=function(a){t(),e(JSON.parse(a.data))},n.ws.onerror=function(a){t(),s(a)})})}return function(){function t(a){!function(a,o){if(!(a instanceof o))throw new TypeError("Cannot call a class as a function")}(this,t),this.__host=a.host||"ws://localhost:2500",this.debug=a.debug||!1,this.orderId=a.orderId||"",this.__amount=0,a.amount&&(this.amount=a.amount),this.__transactionDate=(new Date).toLocaleDateString("pt-BR",{year:"2-digit",month:"2-digit",day:"2-digit",timeZone:"America/Sao_Paulo"}).replace(/\//g,""),this.ctfTransaction={},this.__debugMessage=[]}var r,c,i;return r=t,(c=[{key:"debugLog",value:function(a){var n;this.debug&&(n=a,console.log(o,e,n))}},{key:"classError",value:function(a){return this.debugMessage={message:a,logLevel:"error"},new Error(a)}},{key:"credit",value:function(){var a=this,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return new Promise(function(t,r){var c={valorTransacao:a.amount,documento:a.orderId,operacao:n.transactions.credit.base,dataTransacao:a.__transactionDate};o>1&&(c.operacao=n.transactions.credit.installment,c.numeroParcelas=o),o>1&&e&&(c.operacao=n.transactions.credit.installmentWithInterest,c.numeroParcelas=o),a.debugMessage={message:"Pagamento com cartão de crédito. Operação: ".concat(c.operacao,". Valor ").concat(a.amount," centavos")},s(a.__host,c).then(function(o){if(o.retorno>0){var e=n.errorCodes[o.codigoErro]||o.display.length?o.display.map(function(a){return a.mensagem}).join(" "):" ",s=a.classError("Transação não concluída ".concat(o.codigoErro,": ").concat(e));r(s)}a.ctfTransaction=Object.assign({},o,{dataTransacao:a.__transactionDate}),a.debugMessage={message:"Resposta do servidor -> ".concat(JSON.stringify(o)),logLevel:"log"},a.debugMessage={message:a.ctfTransaction,logLevel:"json"},t(o)}).catch(function(o){return a.classError(o)})})}},{key:"debit",value:function(){var a=this,o=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return new Promise(function(e,t){var r=o?n.transactions.debit.voucher:n.transactions.debit.base;a.debugMessage={message:"Pagamento com cartão de débito. Operação: ".concat(r,". Valor ").concat(a.amount," centavos")},s(a.__host,{valorTransacao:a.amount,documento:a.orderId,dataTransacao:a.__transactionDate,operacao:r}).then(function(o){if(o.retorno>0){var r=n.errorCodes[o.codigoErro]||o.display.length?o.display.map(function(a){return a.mensagem}).join(" "):" ",s=a.classError("Transação não concluída ".concat(o.codigoErro,": ").concat(r));t(s)}a.ctfTransaction=Object.assign({},o,{dataTransacao:a.__transactionDate}),a.debugMessage={message:"Resposta do servidor -> ".concat(JSON.stringify(o)),logLevel:"log"},a.debugMessage={message:a.ctfTransaction,logLevel:"json"},e(o)}).catch(function(o){return a.classError(o)})})}},{key:"confirm",value:function(){var a=this;return new Promise(function(o,e){var t=n.transactions.confirm;a.debugMessage={message:"Confirmação de pagamento da operação realizada.\n      Operação: ".concat(a.ctfTransaction.operacao,"\n      Data: ").concat(a.ctfTransaction.dataTransacao,"\n      Valor: ").concat(a.amount,"\n      Bandeira: ").concat(a.ctfTransaction.bandeira,"\n      Cartão: ").concat(a.ctfTransaction.cartao)},s(a.__host,{operacao:t}).then(function(t){if(t.retorno>0){var r=n.errorCodes[t.codigoErro]||t.display.length?t.display.map(function(a){return a.mensagem}).join(" "):" ",s=a.classError("Transação não concluída ".concat(t.codigoErro,": ").concat(r));e(s)}a.ctfTransaction=Object.assign(a.ctfTransaction,t),a.debugMessage={message:"Resposta do servidor -> ".concat(JSON.stringify(t)),logLevel:"log"},a.debugMessage={message:t,logLevel:"json"},o(t)}).catch(function(o){return a.classError(o)})})}},{key:"requestCancellation",value:function(){var a=this;return new Promise(function(o,e){var t=n.transactions.requestCancel;a.debugMessage={message:"Requisição de cancelamento de compra.\n      Operação: ".concat(a.ctfTransaction.operacao,"\n      Data: ").concat(a.ctfTransaction.dataTransacao,"\n      Valor: ").concat(a.amount,"\n      NSU: ").concat(a.ctfTransaction.nsuCTF)},s(a.__host,{operacao:t}).then(function(t){if(t.retorno>0){var r=n.errorCodes[t.codigoErro]||t.display.length?t.display.map(function(a){return a.mensagem}).join(" "):" ",s=a.classError("Transação não concluída ".concat(t.codigoErro,": ").concat(r));e(s)}a.debugMessage={message:"Resposta do servidor -> ".concat(JSON.stringify(t)),logLevel:"log"},a.debugMessage={message:responsea,logLevel:"json"},o(t)}).catch(function(o){return a.classError(o)})})}},{key:"cancel",value:function(){var a=this,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(e,t){var r=n.transactions.cancel,c=o.operacao||a.ctfTransaction.operacao,i=o.dataTransacao||a.ctfTransaction.dataTransacao,d=o.amount?100*parseFloat(o.amount):a.ctfTransaction.valorTransacao,u=o.nsuCTF||a.ctfTransaction.nsuCTF;a.debugMessage={message:"Cancelamento de compra.\n        Operação: ".concat(c,"\n        Data: ").concat(i,"\n        Valor: ").concat(d,"\n        NSU: ").concat(u)},s(a.__host,{operacao:r,valorTransacao:d,dataTransacao:i,nsuCTF:u}).then(function(o){if(o.retorno>0){var r=n.errorCodes[o.codigoErro]||o.display[0].mensagem,s=a.classError("Transação não concluída ".concat(o.codigoErro,": ").concat(r));t(s)}a.debugMessage={message:"Resposta do servidor -> ".concat(JSON.stringify(o)),logLevel:"log"},a.debugMessage={message:o,logLevel:"json"},e(o)}).catch(function(o){return a.classError(o)})})}},{key:"debugMessage",get:function(){return this.__debugMessage},set:function(a){if(this.debug){var o=Object.assign({logLevel:"info",message:""},a,{date:(new Date).toISOString()});if("log"===o.logLevel&&o.message)return this.debugLog(o.message);this.__debugMessage.push(Object.assign({},o,{date:(new Date).toISOString()})),"info"===o.logLevel&&o.message&&this.debugLog(o.message)}}},{key:"amount",get:function(){return this.__amount},set:function(a){if("number"==typeof a&&a<=0)throw new Error("Não é possível definir um valor menor ou igual a zero.");this.__amount=100*parseFloat(a)}}])&&a(r.prototype,c),i&&a(r,i),t}()});
//# sourceMappingURL=index.amd.js.map
