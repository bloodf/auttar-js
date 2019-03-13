<template>
  <div class="columns">
    <div class="column">
      <auttar-form-text
        v-model="orderId"
        :maxlength="10"
        label="Order ID"
        placeholder="ID da ordem que vai ser enviado para a Auttar"
      />
      <auttar-form-number
        v-model.number="amount"
        label="Valor"
        placeholder="Valor que será processado"
      />
      <auttar-form-toggle
        v-model="voucher"
        label="Voucher"
        placeholder="Utilizando um voucher para pagamento"
      />
      <auttar-action-buttons
        @start="start"
        @cancel="cancel"
        @finish="finish"
        @reset="reset"
      />
    </div>
  </div>
</template>
<script>
  import AuttarActionButtons from './buttons/action';
  import AuttarFormNumber from './form/number';
  import AuttarFormText from './form/text';
  import AuttarFormToggle from './form/toggle';

  export default {
    name: 'AuttarDebit',
    components: {
 AuttarActionButtons, AuttarFormText, AuttarFormToggle, AuttarFormNumber,
},
    data: () => ({
      orderId: '',
      amount: 0,
      voucher: false,
      started: false,
    }),
    methods: {
      start() {
        if (!this.amount) return false;
        this.$dialog.confirm({
                               title: 'Iniciar Transação',
                               message: `Você está iniciando uma compra no cartão de débito.<br /><br />
                                <strong>Valor</strong> R$ ${this.amount}<br />
                                ${this.voucher ? '<br /><strong>Voucher</strong> send utilizado.' : ''}`,
                               cancelText: 'Cancelar',
                               confirmText: 'Iniciar',
                               type: 'is-success',
                               onConfirm: () => {
                                 this.$toast.open('Cheque o TEF.');
                                 this.$emit('start', {
                                   type: 'debit',
                                   orderId: this.orderId,
                                   amount: this.amount,
                                   voucher: this.voucher,
                                 });
                                 this.started = true;
                               },
                             });
        return true;
      },
      finish() {
        if (this.started) {
          this.$dialog.confirm({
                                 title: 'Confirmar Transação',
                                 message: 'Você tem certeza que deseja confirmar a transação?',
                                 confirmText: 'Confirmar',
                                 type: 'is-danger',
                                 hasIcon: true,
                                 onConfirm: () => {
                                   this.reset();
                                   this.$toast.open('Transação confirmada');
                                   this.$emit('finish');
                                 },
                               });
        }
      },
      cancel() {
        if (this.started) {
          this.$dialog.confirm({
                                 title: 'Cancelar Transação',
                                 message: 'Você tem certeza que deseja cancelar a transação?',
                                 confirmText: 'Confirmar',
                                 type: 'is-danger',
                                 hasIcon: true,
                                 onConfirm: () => {
                                   this.$emit('cancel');
                                   this.reset();
                                   this.$toast.open('Transação cancelada');
                                 },
                               });
        }
      },
      reset() {
        this.orderId = '';
        this.amount = 0;
        this.voucher = false;
        this.started = false;
        this.$emit('reset');
      },
    },
  };
</script>
