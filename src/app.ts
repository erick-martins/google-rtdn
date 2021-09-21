import * as DotEnv from 'dotenv';
import { PubSub } from '@google-cloud/pubsub';

DotEnv.config();

enum NotificationType {
  /**
   * A subscription was recovered from account suspension.
   */
  SUBSCRIPTION_RECOVERED = 1,
  /**
   * An active subscription has been renewed.
   */
  SUBSCRIPTION_RENEWED = 2,
  /**
   * A subscription has been voluntarily or involuntarily canceled. In a voluntary cancellation, this value is sent when the user cancels.
   */
  SUBSCRIPTION_CANCELED = 3,
  /**
   * A new subscription has been purchased.
   */
  SUBSCRIPTION_PURCHASED = 4,
  /**
   * A subscription has entered account hold (if enabled).
   */
  SUBSCRIPTION_ON_HOLD = 5,
  /**
   * A subscription has entered the grace period (if enabled).
   */
  SUBSCRIPTION_IN_GRACE_PERIOD = 6,
  /**
   * User has reactivated subscription in Play > Account > Subscriptions (requires activation of subscription restoration).
   */
  SUBSCRIPTION_RESTARTED = 7,
  /**
   * A change in subscription price has been confirmed by the user.
   */
  SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8,
  /**
   * The renewal time for a subscription has been extended.
   */
  SUBSCRIPTION_DEFERRED = 9,
  /**
   * A subscription has been paused.
   */
  SUBSCRIPTION_PAUSED = 10,
  /**
   * The schedule of a subscription pause has been changed.
   */
  SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11,
  /**
   * A subscription was revoked by the user before its expiration date.
   */
  SUBSCRIPTION_REVOKED = 12,
  /**
   *  The subscription has expired.
   */
  SUBSCRIPTION_EXPIRED = 13,
}

type SubscriptionNotification = {
  version: string;
  notificationType: NotificationType;
  purchaseToken: string;
  subscriptionId: string;
};

type OneTimeProductNotification = {
  version: string;
  notificationType: NotificationType;
  purchaseToken: string;
  sku: string;
};

type TestNotification = {
  version: string;
};

type InAppPurchaseMessageData = (
  | { testNotification: TestNotification }
  | { oneTimeProductNotification: OneTimeProductNotification }
  | { subscriptionNotification: SubscriptionNotification }
) & {
  version: string;
  packageName: string;
  eventTimeMillis: number;
};

type PubSubInAppPurchaseMessage = {
  id: number;
  data: Buffer;
  attributes: Record<string, any>;
  ackId: string;
  deliveryAttempt: number;
  orderingKey: string;
  publishTime: Date;
  received: number;
  ack: () => void;
}

  
class App {
  private pubSubClient: PubSub = new PubSub();;

  private bufferDataToObject = <T>(bufferData: Buffer, encoding: BufferEncoding = 'utf-8'): T => {
    const str = bufferData.toString(encoding)
    return JSON.parse(str) as T;
  }

  private messageHandler = (message: PubSubInAppPurchaseMessage) => {
    try {
      const data = this.bufferDataToObject<InAppPurchaseMessageData>(message.data);
      console.log(`Received message ${message.id}:`);
      console.log('\tData:', data);
      console.log('\tAttributes:', message.attributes);
    } catch (error: any) {
      console.error("Could not parse message data", error);
    }

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  public listen(subscriptionName: string) {
    // References an existing subscription
    const subscription = this.pubSubClient.subscription(subscriptionName);

    // Listen for new messages
    subscription.on('message', this.messageHandler);
  }
}

const app = new App();

app.listen(process.env.TOPIC as string);
