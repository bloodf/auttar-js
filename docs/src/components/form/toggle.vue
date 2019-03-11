<template>
  <div class="columns">
    <div class="column">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">{{ label }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <b-switch
              :value="value"
              @input="$emit('input', $event)"
            >
              {{placeholder}}
            </b-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CommonBooleanMixin from './commonBoolean';

  export default {
    name: 'AuttarFormToggle',
    mixins: [CommonBooleanMixin],
  }
</script>
