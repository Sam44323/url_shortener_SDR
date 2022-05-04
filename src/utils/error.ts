const errorCreator = (message: string) => {
  const error = new Error(message)
  return error
}

module.exports = errorCreator
