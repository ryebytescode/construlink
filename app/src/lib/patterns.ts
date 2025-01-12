export default {
  name: /^[-'a-zA-ZÑñ\s+]+$/,
  // https://uibakery.io/regex-library/email
  email:
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  phone: /((\+[0-9]{2})|0)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/,
  password: {
    oneUpperCase: /(?=.*?[A-Z])/,
    oneLowerCase: /(?=.*?[a-z])/,
    oneDigit: /(?=.*?[0-9])/,
    oneSpecialChar: /(?=.*?[.#?!@$%^&*-])/,
  },
}
