<template>
  <div>
    <article
      v-for="(message, index) in messages"
      :key="index"
      class="message"
      :class="{
        'is-danger': message.logLevel === 'error',
        'is-info': message.logLevel === 'info',
        'is-dark': message.logLevel === 'json',
      }"
    >
      <div class="message-body">
        <p><strong>{{ message.date }}</strong></p>
        <hr style="margin: 5px 0">
        <article
          v-if="typeof message.message === 'object' && !Array.isArray(message.message)"
          class="message is-dark"
        >
          <div class="message-header">
            <p>JSON</p>
          </div>
          <div class="message-body">
            <vue-json-pretty
              :data="message.message"
              :deep="1"
            />
          </div>
        </article>
        <p v-else>
          {{ message.message }}
        </p>
      </div>
    </article>
  </div>
</template>
<script>
  import VueJsonPretty from 'vue-json-pretty';

  export default {
    name: 'AuttarResult',
    components: {
      VueJsonPretty,
    },
    props: {
      value: {
        type: Array,
        required: false,
        default: () => ([]),
      },
    },
    computed: {
      messages() {
        const messages = this.value;
        return messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse();
      },
    },
  };
</script>
