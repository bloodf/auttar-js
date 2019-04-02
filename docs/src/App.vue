<template>
  <div>
    <auttar-title />
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <auttar-tabs
              v-model="selectedTab"
            />
            <component
              :is="tabComponent"
              v-model="settings"
              :transactions="transactions"
              :messages="messages"
              @start="start"
              @reset="reset"
              @finish="finish"
              @cancel="cancel"
              @request-cancel="requestCancel"
            />
          </div>
          <div class="column">
            <auttar-result
              v-model="messages"
            />
          </div>
        </div>
      </div>
    </section>
    <auttar-footer />
  </div>
</template>

<script>
  import Auttar from '../../src/Auttar';
  import AuttarCredit from './components/credit';
  import AuttarDebit from './components/debit';
  import AuttarFooter from './components/footer';
  import AuttarResult from './components/result';
  import AuttarSettings from './components/settings';
  import AuttarTabs from './components/tabs';
  import AuttarTitle from './components/title';
  import AuttarTransactions from './components/transactions';

  export default {
    name: 'Auttar',
    components: {
      AuttarFooter,
      AuttarSettings,
      AuttarTransactions,
      AuttarDebit,
      AuttarCredit,
      AuttarTabs,
      AuttarResult,
      AuttarTitle,
    },
    data: () => ({
      settings: {
        host: 'ws://localhost:2500',
        debug: true,
      },
      selectedTab: 'credit',
      auttar: null,
      transactions: [],
      ctfTransactions: [],
      messages: [],
    }),
    computed: {
      tabComponent() {
        if (this.selectedTab === 'debit') return AuttarDebit;
        if (this.selectedTab === 'transactions') return AuttarTransactions;
        if (this.selectedTab === 'settings') return AuttarSettings;
        return AuttarCredit;
      },
    },
    watch: {
      'auttar.ctfTransaction': {
        handler(newValue) {
          if (typeof newValue === 'object' && Object.keys(newValue).length) {
            this.ctfTransactions.push(newValue);
          }
        },
        immediate: false,
        deep: true,
      },
      'auttar.debugMessage': {
        handler(newValue) {
          if (Array.isArray(newValue)) {
            this.messages = [...newValue, ...this.messages];
          }
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      start(params) {
        const transaction = {
          orderId: params.orderId || Date.now(),
          amount: params.amount,
        };

        this.auttar = new Auttar({
                                   ...this.settings,
                                   ...transaction,
                                 });

        if (params.type === 'credit') {
          this.transactions.push({
                                   ...params,
                                   ...transaction,
                                 });

          this.auttar.credit(params.installment, params.interest)
              .then(() => {
                this.transactionStatus(this.auttar.orderId, 'start', this.auttar.ctfTransaction);
              })
              .catch(() => {
                this.transactionStatus(this.auttar.orderId, 'error');
              });
        }

        if (params.type === 'debit') {
          this.auttar.debit(params.voucher)
              .then(() => {
                this.transactionStatus(this.auttar.orderId, 'start', this.auttar.ctfTransaction);
              })
              .catch(() => {
                this.transactionStatus(this.auttar.orderId, 'error');
              });
        }
      },
      finish() {
        if (this.auttar instanceof Auttar) {
          this.auttar.confirm()
            .then(() => {
              this.transactionStatus(this.auttar.orderId, 'success');
            })
            .catch(() => {
              this.transactionStatus(this.auttar.orderId, 'fail');
            });
        }
      },
      cancel() {
        this.auttar.requestCancellation()
            .then(() => {
              this.requestCancel({ extra: this.auttar.ctfTransaction });
            })
            .catch(() => {
              this.transactionStatus(this.auttar.orderId, 'fail');
            });
      },
      requestCancel(transaction) {
        this.auttar.cancel({
                             dataTransacao: transaction.extra.dataTransacao,
                             amount: transaction.extra.valorTransacao,
                             nsuCTF: transaction.extra.nsuCTF,
                           })
            .then(() => {
              this.transactionStatus(transaction.orderId, 'cancel');
            })
            .catch(() => {
              this.transactionStatus(transaction.orderId, 'fail');
            });
      },
      reset() {
        this.auttar = null;
      },
      transactionStatus(id, status, extra) {
        const index = this.transactions.findIndex(t => t.orderId === id);
        this.transactions[index].status = status;
        if (extra) {
          this.transactions[index].extra = extra;
        }
        if (status === 'error') {
          this.reset();
        }
      },
    },
  };
</script>
