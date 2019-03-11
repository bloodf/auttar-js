<template>
  <div class="columns">
    <div class="column">
      <auttar-form-text
        :value="value.host"
        label="Host"
        placeholder="Endereço do WebSocket"
        @input="updateSettings('host', $event)"
      />
      <auttar-form-toggle
        :value="value.debug"
        label="Debug"
        @input="updateSettings('debug', $event)"
      />
    </div>
  </div>
</template>
<script>
  import AuttarFormText from './form/text';
  import AuttarFormToggle from './form/toggle';

  export default {
    name: 'AuttarSettings',
    components: { AuttarFormToggle, AuttarFormText },
    props: {
      value: Object,
    },
    data: () => ( {
      settings: {
        host: 'ws://localhost:2500',
        debug: true,
      }
    } ),
    watch: {
      settings: {
        handler(newValue) {
          this.$emit('input', newValue);
        },
        deep: true,
        immediate: true,
      }
    },
    methods: {
      updateSettings(key, value) {
        this.settings[key] = value;
      }
    },
  }
</script>
