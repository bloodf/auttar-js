<template>
  <div class="columns">
    <div class="column">
      <table
        style="width: 100%"
        class="table"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Parcelas</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in transactions"
            :key="transaction.orderId"
            :class="{
              'has-background-danger': transaction.status === 'error',
              'has-background-warning': transaction.status === 'cancel',
              'has-background-success': transaction.status === 'success',
              'has-background-black-ter': transaction.status === 'fail',
            }"
            class="has-text-white"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ transaction.orderId }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.installment || 1 }}</td>
            <td>{{ transaction.status }}</td>
            <td>
              <button
                v-if="transaction.status === 'success' || transaction.status === 'start'"
                class="button"
                style="margin-right: 5px"
                @click="$emit('request-cancel', transaction)"
              >
                <span class="icon"><i class="fas fa-ban" /></span>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Parcelas</th>
            <th>Status</th>
            <th />
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AuttarTransactions',
    props: {
      transactions: {
        type: Array,
        required: true,
      },
      messages: {
        type: Array,
        required: true,
      },
    },
  };
</script>
