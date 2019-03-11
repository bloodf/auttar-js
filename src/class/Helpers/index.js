const NAME = '%c Auttar ';
const BACKGROUND = 'background:#bc0909 ; padding: 2px; border-radius: 2px;  color: #fff ';

export function required(name, param) {
  if (param === undefined) {
    throw new Error(`Parâmetro obrigatório ${name} não declarado.`);
  }

  return param;
}

export function logInfo(msg) {
  console.log(NAME, BACKGROUND, msg); // eslint-disable-line no-console
}

export function logError(msg) {
  console.error(NAME, BACKGROUND, msg); // eslint-disable-line no-console
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
    .concat(...Array(maxChar).fill(' '))
    .slice(0, maxChar)
    .join('');
}

export default {
  required,
  logInfo,
  logError,
  addSpaces,
};
