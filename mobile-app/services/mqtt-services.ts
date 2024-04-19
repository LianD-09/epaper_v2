import { MQTT_USERNAME, MQTT_PASSWORD } from "../utils/config"

// export const connect = (client, payload) => {
//     client.connect({
//         userName: MQTT_USERNAME,
//         password: MQTT_PASSWORD,
//         useSSL: false,
//         reconnect: true,
//         timeout: 10,
//         onSuccess: payload.onSuccess,
//         onFailure: payload.onFailure
//     })
// }

// export const disconnect = (client, { onSuccess, onFailure }) => {
//     try {
//         client.disconnect();
//         onSuccess();
//     }
//     catch (e) {
//         onFailure();
//     }
// }

// export const subcribeTopic = (client, topic, payload) => {
//     if (!client?.isConnected()) {
//         return;
//     }

//     client.subscribe(
//         topic,
//         {
//             ...payload
//         }
//     )
// }

// export const unsubcribeTopic = (client, topic, payload) => {
//     if (!client?.isConnected()) {
//         return;
//     }

//     client.unsubscribe(
//         topic,
//         {
//             ...payload
//         }
//     )
// }

