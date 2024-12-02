interface Meme {
    meme_id?: string; // UUID, primary key
    user_id: string; // Foreign key referencing users.user_id
    meme_title: string; // Title of the meme
    image_url: string; // URL of the meme image
    created_at: string; // Creation timestamp (ISO 8601 format)
    updated_at: string; // Last update timestamp (ISO 8601 format)
    meme_status: 'Pending' | 'Approved' | 'Rejected'; // Status of the meme
    like_count: number; // Number of likes, default is 0
    comment_count: number; // Number of comments, default is 0
    flag_count: number; // Number of flags, default is 0
    risk_score: number; // Risk score for content moderation, default is 0
    tags: Record<string, any>[]; // Array of JSON objects representing tags, default is []
  }
  