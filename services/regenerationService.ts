interface RegenerationCheck {
  canRegenerate: boolean;
  regenerationCount: number;
  maxRegenerations: number;
}

export class RegenerationService {
  static async checkRegenerationLimit(email: string): Promise<RegenerationCheck> {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      const response = await fetch('/api/check-regeneration-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check regeneration limit');
      }

      const data = await response.json();
      
      return {
        canRegenerate: data.canRegenerate,
        regenerationCount: data.regenerationCount,
        maxRegenerations: data.maxRegenerations
      };
    } catch (error) {
      console.error('Error checking regeneration limit:', error);
      throw error;
    }
  }

  static async incrementRegenerationCount(email: string): Promise<RegenerationCheck> {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      // First check current status
      const check = await this.checkRegenerationLimit(email);
      
      if (!check.canRegenerate) {
        throw new Error('Regeneration limit reached');
      }

      // Increment the regeneration count via API
      const response = await fetch('/api/regenerate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to regenerate images');
      }

      const data = await response.json();

      return {
        canRegenerate: data.regenerationCount < data.maxRegenerations,
        regenerationCount: data.regenerationCount,
        maxRegenerations: data.maxRegenerations
      };
    } catch (error) {
      console.error('Error incrementing regeneration count:', error);
      throw error;
    }
  }
}
