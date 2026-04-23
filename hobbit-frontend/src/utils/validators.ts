const BLOCKED_INPUTS = [
  'hi', 'hello', 'hey', 'ok', 'okay', 'yes', 'no',
  'test', 'abc', 'lol', 'idk', 'hmm', 'um', 'uh'
]

export const validateHobby = (input: string): string | null => {
  const trimmed = input.trim().toLowerCase()

  if (trimmed.length < 3) {
    return 'Please enter a hobby name with at least 3 characters'
  }

  if (trimmed.length > 50) {
    return 'Hobby name is too long'
  }

  if (BLOCKED_INPUTS.includes(trimmed)) {
    return "Hi! I can only help you master actual hobbies or skills (like Guitar, Chess, or Coding). Let's try something else!"
  }

  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Hobby name must contain letters'
  }

  return null
}
