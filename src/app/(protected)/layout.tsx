'use client'
import React, { useEffect } from 'react'
import Navbar from './_components/navbar';
import useFcmToken from '@/hooks/useFcmToken';
import { getMessaging, onMessage } from 'firebase/messaging';
import app from '@/utils/firebase/firebaseConfig';
import { toast, Toaster } from 'sonner';

interface ProtectedRouteProps{
    children:React.ReactNode;
}

const demoFcm = "f2uz9WsS-g4dlU8eem6JtL:APA91bEHbMYy-m0iefQ594b0yulhSY2JiU7G9C_JZ4B4j13vDwy6yf_YmjTU-lvLU6oMv4RDU2P8UtKy5dIQAXQW8kQpcMiG3SrbwmM7e2btpQLQu_CVIIY";
const demoFcm2 = "dFKfeJFOFdioUpRaFMR-X5:APA91bEkUTqZcljwdBV87YEWmGb1ldv6w0VsrG_62Cyh7J_hlfyuW4haosyp57K2tnVeVBlt09yhDBZA1qiM-1RoqfGoCmO_4cYaEaZIiZ2oei6bL_9Bgc8";

const ProtectedRoute = ({children}:ProtectedRouteProps) => {

  const {fcmToken}= useFcmToken();
  if(fcmToken) {
    console.log('fcmToken:',fcmToken);
  }else{
    console.log('No fcmToken available');
  }

  useEffect(()=>{
    if(typeof window !== 'undefined' && 'serviceWorker' in navigator){
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging,(payload)=>{
        console.log('Foreground message:',payload);
        if(payload.notification){
          const {title,body} = payload.notification;

          toast(title,{
            duration:5000,
            position:"top-right",
            description:body,
            icon:'🔥'
          });
        }
      });
      return ()=>{
        unsubscribe();
      }
    }
  },[])

  return (
    <div className='bg-gradient h-full w-full flex flex-col gap-y-10 items-center justify-center'>
      <Toaster position='top-right' richColors/>
        <Navbar />
      {children}
    </div>
  )
}

export default ProtectedRoute
