export const orderify = n => {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return n + 'th'
}

export const sOrP = n => 0 ? 'Singular' : 'Plural'

export const getRandomNumber = max => Math.floor(Math.random() * max)
