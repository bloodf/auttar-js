const LogLevelName = {
  Info: 'info',
  Warn: 'warn',
  Error: 'error',
  Method: 'method',
  All: 'all',
  None: 'none',
};

const LogLevelStyle = {
  Info: 'background:#215ace ; padding: 2px; border-radius: 2px 0 0 2px;  color: #fff;',
  Warn: 'background:#e8c82c ; padding: 2px; border-radius: 2px 0 0 2px;  color: #000;',
  Error: 'background:#c92112 ; padding: 2px; border-radius: 2px 0 0 2px;  color: #fff;',
  Method: 'background:#6d0cb2 ; padding: 2px; border-radius: 2px 0 0 2px;  color: #fff;',
};

const NAME = 'Auttar ';
const BACKGROUND = 'background:#bc0909 ; padding: 2px; border-radius: 0 2px 2px 0;  color: #fff ';

const log = (name, style, className, classStyle, message) => {
  console.log(`%c ${name} %c ${className} %c ${message}`, style, classStyle, 'background: transparent;'); // eslint-disable-line no-console
};

const showError = (name, style, className, classStyle, message) => {
  console.error(`%c ${name} %c ${className} %c ${message}`, style, classStyle, 'background: transparent;'); // eslint-disable-line no-console
};

export function required(name, param) {
  if (param === undefined) {
    throw new Error(`Parâmetro obrigatório ${name} não declarado.`);
  }

  return param;
}

export function logInfo(msg) {
  log(LogLevelName.Info, LogLevelStyle.Info, NAME, BACKGROUND, msg);
}

export function logWarn(msg) {
  log(LogLevelName.Warn, LogLevelStyle.Warn, NAME, BACKGROUND, msg);
}

export function logMethod(method, args, params) {
  log(LogLevelName.Method, LogLevelStyle.Method, NAME, BACKGROUND, `Call Method: ${method}(${args || ''}) ${(params) ? `=> ${JSON.stringify(params)}` : ''}`);
}

export function logError(msg) {
  showError(LogLevelName.Warn, LogLevelStyle.Warn, NAME, BACKGROUND, msg);
}

/**
 * Add spaces to match the max screen length
 * @param {string} text
 * @param {number} maxChar
 * @returns {string}
 */
export function addSpaces(text, maxChar) {
  return text
    .split('')
    .concat(...Array(maxChar)
      .fill(' '))
    .slice(0, maxChar)
    .join('');
}

export default {
  required,
  logInfo,
  logError,
  logWarn,
  logMethod,
  addSpaces,
};
