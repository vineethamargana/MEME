 interface Meme {
    meme_id?: string;  // UUID
    user_id: string;  // UUID
    meme_title: string;  // Meme title (string)
    image_url: string;  // URL to the meme image (string)
    created_at: string;  // Timestamp (string format)
    updated_at: string;  // Timestamp (string format)
    meme_status: "Pending" | "Approved" | "Rejected";  // Meme status (enum)
    like_count: number;  // Like count (integer)
    comment_count: number;  // Comment count (integer)
    flag_count: number;  // Flag count (integer)
    risk_score: number;  // Risk score (float)
    tags: string[];  // Tags (array of strings)
  }
  export class MemeImpl implements Meme{
    meme_id?: string;  // UUID
    user_id: string;  // UUID
    meme_title: string;  // Meme title (string)
    image_url: string;  // URL to the meme image (string)
    created_at: string;  // Timestamp (string format)
    updated_at: string;  // Timestamp (string format)
    meme_status: "Pending" | "Approved" | "Rejected";  // Meme status (enum)
    like_count: number;  
    comment_count: number;  
    flag_count: number;  
    risk_score: number;  
    tags: string[];  

    constructor(meme:Meme){
      this.meme_id=meme.meme_id;
      this.user_id=meme.user_id;
      this.meme_title=meme.meme_title;
      this.image_url=meme.image_url;
      this.created_at=meme.created_at;
      this.updated_at=meme.updated_at;
      this.meme_status=meme.meme_status;
      this.like_count=meme.like_count;
      this.comment_count=meme.comment_count;
      this.flag_count=meme.flag_count;
      this.risk_score=meme.risk_score;
      this.tags=meme.tags;
    }
  }
  