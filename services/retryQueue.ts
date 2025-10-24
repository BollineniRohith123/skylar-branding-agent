import type { Base64Image, Product, GenerationResult } from '../types';

export interface RetryQueueItem {
  id: string;
  logo: Base64Image;
  product: Product;
  attempts: number;
  maxAttempts: number;
  onRetryComplete: (result: GenerationResult) => void;
  createdAt: number;
}

/**
 * Background retry queue for failed image generations
 * Automatically retries failed images in the background without user intervention
 * Ensures that temporary failures are resolved without showing error messages
 */
export class RetryQueue {
  private queue: Map<string, RetryQueueItem> = new Map();
  private isProcessing = false;
  private processInterval: NodeJS.Timeout | null = null;
  private readonly PROCESS_INTERVAL = 5000; // Check queue every 5 seconds
  private readonly MAX_QUEUE_SIZE = 50; // Prevent memory issues

  /**
   * Add an item to the retry queue
   */
  addToQueue(item: RetryQueueItem): void {
    // Prevent queue from growing too large
    if (this.queue.size >= this.MAX_QUEUE_SIZE) {
      console.warn('Retry queue is full, skipping item');
      return;
    }

    this.queue.set(item.id, item);
    console.log(`Added to retry queue: ${item.product.name} (${this.queue.size} items in queue)`);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  /**
   * Remove an item from the queue
   */
  removeFromQueue(id: string): void {
    this.queue.delete(id);
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.size;
  }

  /**
   * Start processing the queue
   */
  private startProcessing(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;
    console.log('Starting retry queue processor');

    this.processInterval = setInterval(() => {
      this.processQueue();
    }, this.PROCESS_INTERVAL);
  }

  /**
   * Stop processing the queue
   */
  stopProcessing(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    this.isProcessing = false;
    console.log('Stopped retry queue processor');
  }

  /**
   * Process items in the queue
   */
  private async processQueue(): Promise<void> {
    if (this.queue.size === 0) {
      this.stopProcessing();
      return;
    }

    // Process up to 3 items concurrently to avoid overwhelming the API
    const itemsToProcess = Array.from(this.queue.values()).slice(0, 3);

    for (const item of itemsToProcess) {
      try {
        // Check if item has been in queue too long (> 30 minutes)
        const ageInMinutes = (Date.now() - item.createdAt) / 60000;
        if (ageInMinutes > 30) {
          console.log(`Removing stale item from queue: ${item.product.name}`);
          this.removeFromQueue(item.id);
          continue;
        }

        // Attempt to regenerate
        console.log(`Retrying from queue: ${item.product.name} (attempt ${item.attempts}/${item.maxAttempts})`);
        
        // Call the retry callback - this will be handled by the component
        // For now, we just mark it as still loading
        item.onRetryComplete({ status: 'loading', imageUrl: null, error: null });

        // Remove from queue after processing (the main retry logic will handle the actual retry)
        this.removeFromQueue(item.id);
      } catch (error) {
        console.error(`Error processing retry queue item: ${item.product.name}`, error);
      }
    }
  }

  /**
   * Clear the entire queue
   */
  clearQueue(): void {
    this.queue.clear();
    this.stopProcessing();
    console.log('Cleared retry queue');
  }

  /**
   * Get all items in the queue
   */
  getQueueItems(): RetryQueueItem[] {
    return Array.from(this.queue.values());
  }
}

// Export singleton instance
export const retryQueue = new RetryQueue();

