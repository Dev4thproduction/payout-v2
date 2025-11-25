import jwt from 'jsonwebtoken'

const generateToken = (id, tokenVersion = 0) => {
  return jwt.sign(
    { id, tokenVersion },
    process.env.JWT_SECRETT
    //   {
    //   expiresIn: '7d',
    // }
  )
}

export { generateToken }