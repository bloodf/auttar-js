<template>
  <div>
    <auttar-title />
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <section class="section">
              <div class="container">
                <auttar-tabs
                  v-model="selectedTab"
                />
                <component
                  :is="tabComponent"
                />
              </div>
            </section>
          </div>
          <div class="column">
            <auttar-result />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import AuttarCredit from './components/credit';
  import AuttarDebit from './components/debit';
  import AuttarResult from './components/result';
  import AuttarTabs from './components/tabs';
  import AuttarTitle from './components/title';
  import AuttarTransactions from './components/transactions';

  export default {
    name: 'App',
    components: {
      AuttarTransactions,
      AuttarDebit,
      AuttarCredit,
      AuttarTabs,
      AuttarResult,
      AuttarTitle,
    },
    data: () => ( {
      selectedTab: 'credit',
    } ),
    computed: {
      tabComponent() {
        if (this.selectedTab === 'debit') return AuttarDebit;
        if (this.selectedTab === 'transactions') return AuttarTransactions;
        return AuttarCredit;
      }
    }
  };
</script>
