import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Storage from '@/lib/storage';
export default function Entry() {
 const router=useRouter();
 useEffect(()=>{ let alive=true; (async()=>{ const session=await Storage.getItem('authSession'); if(!alive)return; router.replace(session?'/(tabs)/home':'/login'); })(); return ()=>{alive=false}; },[]);
 return <View style={{flex:1,backgroundColor:'#090D18',alignItems:'center',justifyContent:'center'}}><ActivityIndicator color="#9B8CFF" size="large"/></View>;
}
