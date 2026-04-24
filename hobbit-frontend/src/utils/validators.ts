const BLOCKED_INPUTS = [
  'hi', 'hello', 'hey', 'ok', 'okay', 'yes', 'no',
  'test', 'abc', 'lol', 'idk', 'hmm', 'um', 'uh'
]

export const validateHobby = (input: string): string | null => {
  const trimmed = input.trim().toLowerCase()

  if (trimmed.length < 3) {
    return "Hi! I am Hobbit, your guide to mastery. Please tell me a hobby or skill (at least 3 characters) so we can start your journey!";
  }

  if (trimmed.length > 50) {
    return "That sounds like a very complex interest! Could you keep it under 50 characters so I can better understand the core skill?";
  }

  if (BLOCKED_INPUTS.includes(trimmed)) {
    return "Hi! I am Hobbit, your personal guide to learning. I can only help you master real-world hobbies or skills (like Guitar, Chess, or Coding). Please suggest a valid skill!";
  }

  if (!/[a-zA-Z]/.test(trimmed)) {
    return "A hobby or skill should usually have some letters in it! Could you please tell me a valid skill?";
  }

  return null
}
