export default {
  props: {
    value: {
      type: [String, Boolean, Array, Object],
      required: false,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
  },
};
