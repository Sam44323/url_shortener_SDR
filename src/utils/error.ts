const errorCreator = (message: string, code = 404) => {
  const error: any = new Error(message)
  error.code = code
  return error
}

module.exports = errorCreator
