const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface PacmanScore {
  userId: string;
  score: number;
}

export interface PacmanScoreResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    score: number;
    level: number;
    rank?: number;
    timestamp: string;
  };
}

/**
 * Submit a Pacman game score
 */
export const submitPacmanScore = async (scoreData: PacmanScore): Promise<PacmanScoreResponse> => {
  try {
    const token = localStorage.getItem('better-auth.session_token');
    
    const response = await fetch(`${API_BASE_URL}/pacman/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        userId: scoreData.userId,
        score: scoreData.score,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit score');
    }

    return {
      success: true,
      message: 'Score submitted successfully!',
      data: data,
    };
  } catch (error: any) {
    console.error('Error submitting Pacman score:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit score. Please try again.',
    };
  }
};
