// https://replit.com/@daerdemandt/Rename-ES-class
const extendClass = (name, cls) => ({ [name]: class extends cls {} }[name]);
module.exports = extendClass;
