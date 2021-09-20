"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DotEnv = __importStar(require("dotenv"));
const pubsub_1 = require("@google-cloud/pubsub");
DotEnv.config();
var NotificationType;
(function (NotificationType) {
    /**
     * A subscription was recovered from account suspension.
     */
    NotificationType[NotificationType["SUBSCRIPTION_RECOVERED"] = 1] = "SUBSCRIPTION_RECOVERED";
    /**
     * An active subscription has been renewed.
     */
    NotificationType[NotificationType["SUBSCRIPTION_RENEWED"] = 2] = "SUBSCRIPTION_RENEWED";
    /**
     * A subscription has been voluntarily or involuntarily canceled. In a voluntary cancellation, this value is sent when the user cancels.
     */
    NotificationType[NotificationType["SUBSCRIPTION_CANCELED"] = 3] = "SUBSCRIPTION_CANCELED";
    /**
     * A new subscription has been purchased.
     */
    NotificationType[NotificationType["SUBSCRIPTION_PURCHASED"] = 4] = "SUBSCRIPTION_PURCHASED";
    /**
     * A subscription has entered account hold (if enabled).
     */
    NotificationType[NotificationType["SUBSCRIPTION_ON_HOLD"] = 5] = "SUBSCRIPTION_ON_HOLD";
    /**
     * A subscription has entered the grace period (if enabled).
     */
    NotificationType[NotificationType["SUBSCRIPTION_IN_GRACE_PERIOD"] = 6] = "SUBSCRIPTION_IN_GRACE_PERIOD";
    /**
     * User has reactivated subscription in Play > Account > Subscriptions (requires activation of subscription restoration).
     */
    NotificationType[NotificationType["SUBSCRIPTION_RESTARTED"] = 7] = "SUBSCRIPTION_RESTARTED";
    /**
     * A change in subscription price has been confirmed by the user.
     */
    NotificationType[NotificationType["SUBSCRIPTION_PRICE_CHANGE_CONFIRMED"] = 8] = "SUBSCRIPTION_PRICE_CHANGE_CONFIRMED";
    /**
     * The renewal time for a subscription has been extended.
     */
    NotificationType[NotificationType["SUBSCRIPTION_DEFERRED"] = 9] = "SUBSCRIPTION_DEFERRED";
    /**
     * A subscription has been paused.
     */
    NotificationType[NotificationType["SUBSCRIPTION_PAUSED"] = 0] = "SUBSCRIPTION_PAUSED";
    /**
     * The schedule of a subscription pause has been changed.
     */
    NotificationType[NotificationType["SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED"] = 1] = "SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED";
    /**
     * A subscription was revoked by the user before its expiration date.
     */
    NotificationType[NotificationType["SUBSCRIPTION_REVOKED"] = 2] = "SUBSCRIPTION_REVOKED";
    /**
     *  The subscription has expired.
     */
    NotificationType[NotificationType["SUBSCRIPTION_EXPIRED"] = 3] = "SUBSCRIPTION_EXPIRED";
})(NotificationType || (NotificationType = {}));
class App {
    listenForMessages(subscriptionName, timeout = 60) {
        // References an existing subscription
        const subscription = this.pubSubClient.subscription(subscriptionName);
        // Create an event handler to handle messages
        let messageCount = 0;
        const messageHandler = (message) => {
            console.log(`Received message ${message.id}:`);
            console.log(message);
            console.log(`Data: ${message.data}`);
            console.log(`Attributes:`);
            console.log(message.attributes);
            messageCount += 1;
            // "Ack" (acknowledge receipt of) the message
            message.ack();
        };
        // Listen for new messages until timeout is hit
        subscription.on('message', messageHandler);
    }
    listen(subscriptionName, timeout = 60) {
        timeout = Number(timeout);
        this.pubSubClient = new pubsub_1.PubSub();
        this.listenForMessages(subscriptionName, timeout);
    }
}
const app = new App();
app.listen(process.env.TOPIC);
