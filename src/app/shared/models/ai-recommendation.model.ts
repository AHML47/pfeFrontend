
export interface AIRecommendation {
  id: string;
  type: 'reorder' | 'discount' | 'trending' | 'low-stock';
  productId: string;
  productName: string;
  title: string; 
  description: string; 
  actionRequired: boolean; 
  suggestedAction: string; 
  confidence: number; 
  createdAt: Date;
  actionTaken: boolean;
  actionTakenAt?: Date;
  actionDetails?: string; 
}

export interface AIRecommendationHistory {
  id: string;
  recommendation: AIRecommendation;
  action: 'viewed' | 'accepted' | 'rejected' | 'dismissed';
  date: Date;
  result?: string; 
}
