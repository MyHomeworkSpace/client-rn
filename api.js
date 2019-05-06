import { AsyncStorage } from 'react-native';

module.exports = {
    GET: async endpoint => {
        let resp = await fetch(`https://api-v2.myhomework.space/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + await AsyncStorage.getItem("token")
            },
        })
        return await resp.json()
    },
    POST: async (endpoint, body) => {
        let formBody = [];
        for (const property in body) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        let bodyEncoded = formBody.join("&");
        let resp = await fetch(`https://api-v2.myhomework.space/${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					'Authorization': 'Bearer ' + await AsyncStorage.getItem("token")
				},
				body: bodyEncoded
        })
        return await resp.json()
    }
}