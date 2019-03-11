<template>
  <div class="tabs">
    <ul>
      <li
        :class="value === 'credit' ? 'is-active' : ''"
      >
        <a @click="changeTo('credit')">Crédito</a>
      </li>
      <li
        :class="value === 'debit' ? 'is-active' : ''"
      >
        <a @click="changeTo('debit')">Débito</a>
      </li>
      <li
        :class="value === 'transactions' ? 'is-active' : ''"
      >
        <a @click="changeTo('transactions')">Transações</a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'AuttarTabs',
    props: {
      value: {
        type: String,
        required: false,
        default: 'credit',
      },
    },
    methods: {
      changeTo(tab) {
        this.$emit('input', tab);
      }
    }
  };
</script>
