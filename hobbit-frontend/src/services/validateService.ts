const API_BASE_URL = import.meta.env.VITE_API_URL || 'http:

export const checkHobby = async (hobby: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate/hobby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hobby }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw error;
  }
}
