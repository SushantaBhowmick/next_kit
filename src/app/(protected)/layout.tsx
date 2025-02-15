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
