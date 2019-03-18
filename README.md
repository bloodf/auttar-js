
# Auttar.JS
Uma forma mais fácil de implementar o websocket da Auttar em seu sistema.

## Exemplo Online

Acesse [https://auttar-js.netlify.com](https://auttar-js.netlify.com) para acessar o exemplo online da implementação

## Como Usar
### NPM / Yarn
```sh
npm install auttarjs --save

# For Yarn, use the command below.
yarn add auttarjs
```

### CDN

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/auttarjs@0.1.2/dist/index.js"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/auttarjs@0.1.2/dist/index.js"></script>

<script>
  console.log(Auttar);
</script>
```

## API

### Classe
```JS
import AuttarClass from 'auttarjs';

// Inicializando Classe
const  Auttar  =  new  AuttarClass({});
```

#### Argumentos
##### Construtor
|Propiedade|Tipo|Default|
|--|--|--|
| host | string | ws://localhost:2500
| debug | boolean | false
| orderId | string | ''
| amount | float | 0

### credit
```JS
Auttar.credit(installments =  1, withInterest = false)
```

### debit
```JS
Auttar.debit(isVoucher = false)
```
### cancel
```JS
Auttar.cancel(prop = {})
```
#### Argumentos
|Propiedade|Tipo|Default|
|--|--|--|
| operacao | number | Última operação realizada
| dataTransacao | string | Data da última operação realizada
| amount | float | Valor da última operação realizada
| nsuCTF | string | nsuCTF da última operação realizada

## Exemplos
```JS
import AuttarClass from 'auttarjs';

// Inicializando Classe
const  Auttar  =  new  AuttarClass({
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
