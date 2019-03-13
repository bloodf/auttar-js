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
              @start="start"
              @reset="reset"
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
          if (Object.keys(newValue).length) {
            this.transactions.push(newValue);
          }
        },
        immediate: false,
        deep: true,
      },
      'auttar.debugMessage': {
        handler(newValue) {
          this.messages = newValue;
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      start(params) {
        this.auttar = new Auttar({
                                   ...this.settings,
                                   orderId: params.orderId || Date.now(),
                                   amount: params.amount,
                                 });

        if (params.type === 'credit') {
          this.auttar.credit(params.installment, params.interest);
        }

        if (params.type === 'debit') {
          this.auttar.debit(params.voucher);
        }
      },
      reset() {
        this.auttar = null;
      },
    },
  };
</script>
