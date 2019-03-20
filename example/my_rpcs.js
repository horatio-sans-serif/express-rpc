module.exports = {
  greet: ({ name }) => {
    return { greeting: `Hello, ${name || 'anon'}` }
  }
}
