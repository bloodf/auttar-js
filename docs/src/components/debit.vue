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
        v-model.numeric="amount"
        label="Valor"
        placeholder="Valor que será processado"
      />
      <auttar-form-toggle
        v-model="voucher"
        label="Voucher"
        placeholder="Utilizando um voucher para pagamento"
      />
      <div class="columns">
        <div class="column">
          <button
            class="button is-danger"
            @click="reset"
          >
            Reiniciar
          </button>
        </div>
        <div class="column has-text-right">
          <button
            class="button is-primary"
            style="margin-right: 20px;"
            @click="start"
          >
            Iniciar
          </button>
          <button
            class="button is-success"
            @click="confirm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AuttarFormNumber from './form/number';
  import AuttarFormText from './form/text';
  import AuttarFormToggle from './form/toggle';

  export default {
    name: 'AuttarDebit',
    components: { AuttarFormText, AuttarFormToggle, AuttarFormNumber },
    data: () => ( {
      orderId: '',
      amount: 0,
      voucher: false,
      started: false,
    } ),
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
                               }
                             });
      },
      confirm() {
        if (this.started) {
          this.$dialog.confirm({
                                 title: 'Confirmar Transação',
                                 message: 'Você tem certeza que deseja confirmar a transação?',
                                 confirmText: 'Confirmar',
                                 type: 'is-danger',
                                 hasIcon: true,
                                 onConfirm: () => {
                                   this.$emit('confirm');
                                   this.reset();
                                   this.$toast.open('Transação confirmada');
                                 }
                               })
        }
      },
      reset() {
        this.orderId = '';
        this.amount = 0;
        this.voucher = false;
        this.started = false;
        this.$emit('reset');
      },
    }
  }
</script>
