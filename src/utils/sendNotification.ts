import admin, { ServiceAccount } from 'firebase-admin'
import serviceFile from '@/data/firebase-adminsdk.json'


if(!admin.apps.length){
    admin.initializeApp({
        credential:admin.credential.cert(serviceFile as ServiceAccount)
    })
}

export const sendNotification = async(token:string,title:string,body:string)=>{
    const message={
        token,
        notification:{
            title,
            body,
        },
    };

    try {
        const response = await admin.messaging().send(message);
        return response;
    } catch (error) {
        console.log('Error sending message:',error);;
        return error;
    }
}