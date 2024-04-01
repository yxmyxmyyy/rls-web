import * as mqtt from "mqtt/dist/mqtt.min";
import { reactive, ref } from "vue";

export function useMqtt() {
  const connection = reactive({
    protocol: "ws",
    host: "127.0.0.1",
    port: "1884",
    clientId: "emqx_vue3_" + Math.random().toString(16).substring(2, 8),
    clean: true,
    connectTimeout: 30 * 1000, // ms
    reconnectPeriod: 4000 // ms
    // for more options and details, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
  });

  const topic = "123";

  const location = ref(null);

  // 订阅 topic/mqttx 主题
  const subscription = ref({
    topic,
    qos: 0 as any
  });

  let client = ref({
    connected: false
  } as mqtt.MqttClient);

  const receivedMessages = ref("");
  const subscribedSuccess = ref(false);
  const btnLoadingType = ref("");
  const retryTimes = ref(0);

  const initData = () => {
    client.value = {
      connected: false
    } as mqtt.MqttClient;
    retryTimes.value = 0;
    btnLoadingType.value = "";
    subscribedSuccess.value = false;
  };

  const handleOnReConnect = () => {
    retryTimes.value += 1;
    if (retryTimes.value > 5) {
      try {
        client.value.end();
        initData();
        console.log("connection maxReconnectTimes limit, stop retry");
      } catch (error) {
        console.log("handleOnReConnect catch error:", error);
      }
    }
  };

  const createConnection = () => {
    try {
      btnLoadingType.value = "connect";
      const { protocol, host, port, ...options } = connection;
      const connectUrl = `${protocol}://${host}:${port}/mqtt`;
      // 连接MQTT 服务器
      client.value = mqtt.connect(connectUrl, options);

      if (client.value.on) {
        // https://github.com/mqttjs/MQTT.js#event-connect
        client.value.on("connect", () => {
          btnLoadingType.value = "";
          console.log("connection successful");
        });

        // https://github.com/mqttjs/MQTT.js#event-reconnect
        client.value.on("reconnect", handleOnReConnect);

        // https://github.com/mqttjs/MQTT.js#event-error
        client.value.on("error", error => {
          console.log("connection error:", error);
        });

        // https://github.com/mqttjs/MQTT.js#event-message
        client.value.on("message", (topic: string, message) => {
          receivedMessages.value = receivedMessages.value.concat(
            message.toString()
          );
          location.value = JSON.parse(message.toString());
        });
      }
    } catch (error) {
      btnLoadingType.value = "";
      console.log("mqtt.connect error:", error);
    }
  };

  // subscribe topic
  // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
  const doSubscribe = id => {
    btnLoadingType.value = "subscribe";
    const { topic, qos } = { topic: id, qos: 0 as any };
    client.value.subscribe(
      topic,
      { qos },
      (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
        btnLoadingType.value = "";
        if (error) {
          console.log("subscribe error:", error);
          return;
        }
        subscribedSuccess.value = true;
        console.log("subscribe successfully:", granted);
      }
    );
  };

  return {
    connection,
    topic,
    subscription,
    client,
    receivedMessages,
    subscribedSuccess,
    btnLoadingType,
    retryTimes,
    location,
    initData,
    createConnection,
    doSubscribe
  };
}
