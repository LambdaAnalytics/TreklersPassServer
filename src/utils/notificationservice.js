const axios = require('axios').default;
const fcmKey = process.env.FCM_KEY;
const fcmURL = 'https://fcm.googleapis.com/fcm/send';


const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

const NotificationService = (function () {
    function NotificationService() {
    }
    NotificationService.sendNotification = (token, title, text, data = {}, options = {}) => {
        let fcmRequest = {
            url: fcmURL,
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `key=${fcmKey}`
            },
            data: {
                ...notification_options,
                data: {
                    title,
                    text,
                    ...data,
                },
                "notification": {
                    title,
                    text
                }
            },
            ...options
        };
        if (Array.isArray(token)) {
            fcmRequest.data.registration_ids = token;
        } else if (typeof token == "string") {
            fcmRequest.data.to = token;
        } else {
            return;
        }
        // console.log("fcmRequest :: ", fcmRequest)
        return axios(fcmRequest).then((r) => {
            console.log("Notication :: ", r.data)
        }).catch((error) => {
            console.log(error)
        })

    };
    return NotificationService;
})();

exports.NotificationService = NotificationService;