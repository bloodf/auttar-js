
# Auttar WebSocket JS Class
Classe para facilitar a implementação do WebSocket da Auttar com o seu sistema.

### API
```JS
// Inicializando Classe
const  Auttar  =  new  Auttar({});

//Realizando pagamento com cartão de crédito.
Auttar.credit();

//Realizando pagamento com cartão de débito.
Auttar.debit();

//Realizando desfazimento total de operação
Auttar.requestCancellation();

//Realizando cancelamento da última compra;
Auttar.cancel();

//Realizando confirmação da operação
Auttar.confirm();
```

### Parâmetros
#### Construtor
|Propiedade|Tipo|Default|
|--|--|--|
| host | string | ws://localhost:2500
| debug | boolean | false
| orderId | string | ''
| amount | float | 0

#### credit
```JS
credit(installments =  1, withInterest = false)
```

#### debit
```JS
debit(isVoucher = false)
```
#### cancel
```JS
cancel(prop = {})
```
|Propiedade|Tipo|Default|
|--|--|--|
| operacao | number | Última operação realizada
| dataTransacao | string | Data da última operação realizada
| amount | float | Valor da última operação realizada
| nsuCTF | string | nsuCTF da última operação realizada

### Exemplos
```JS
const  Auttar  =  new  Auttar({
orderId:  '123456ABCDEF',
amount:  100.90
});

//Realizando pagamento com cartão de crédito.
Auttar.credit();

//Realizando pagamento com cartão de crédito parcelado
Auttar.credit(3);

//Realizando pagamento com cartão de crédito parcelado juros pela administradora
Auttar.credit(3,  true);

//Realizando pagamento com cartão de débito.
Auttar.debit();

//Realizando desfazimento total de operação
Auttar.requestCancellation();

//Realizando cancelamento da última compra
Auttar.cancel();

//Realizando confirmação da operação
Auttar.confirm();

```
