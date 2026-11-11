import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Storage from '@/lib/storage';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

type UserInfo = { name?: string; lastname?: string; profileImage?: string };

export default function Header({ balance }: { balance?: number }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await Storage.getItem('userInfo');
      if (data) {
        try { setUserInfo(JSON.parse(data)); } catch { setUserInfo(null); }
      }
    };
    loadUser();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photos to change your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && userInfo) {
      const updated = { ...userInfo, profileImage: result.assets[0].uri };
      setUserInfo(updated);
      await Storage.setItem('userInfo', JSON.stringify(updated));
    }
  };

  const name = `${userInfo?.name || ''} ${userInfo?.lastname || ''}`.trim() || 'Welcome back';

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View>
          <Text style={styles.eyebrow}>EXPENSE TRACKER</Text>
          <Text style={styles.heading}>Good to see you,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
          {userInfo?.profileImage ? <Image source={{ uri: userInfo.profileImage }} style={styles.avatar} /> : <Ionicons name="person" size={25} color="#C7BEFF" />}
        </TouchableOpacity>
      </View>
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>TOTAL AVAILABLE BALANCE</Text>
          <View style={styles.balanceIcon}><Ionicons name="wallet-outline" size={19} color="#C7BEFF" /></View>
        </View>
        <Text style={styles.balance}>${Number(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={styles.balanceBottom}><View style={styles.dot} /><Text style={styles.balanceFoot}>Your money, under control</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#090D18', paddingHorizontal: 22, paddingTop: 58, paddingBottom: 24 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  eyebrow: { color: '#9B8CFF', fontSize: 10, letterSpacing: 2.2, fontWeight: '800', marginBottom: 9 },
  heading: { color: '#A7B0C2', fontSize: 15 },
  name: { color: '#F7F8FC', fontSize: 23, fontWeight: '800', marginTop: 3 },
  avatarWrap: { width: 48, height: 48, borderRadius: 17, backgroundColor: '#25213F', borderWidth: 1, borderColor: '#6656B5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar: { width: 48, height: 48 },
  balanceCard: { borderRadius: 25, padding: 22, backgroundColor: '#211D3D', borderWidth: 1, borderColor: '#51447F' },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#C0B8E9', fontSize: 10, letterSpacing: 1.4, fontWeight: '700' },
  balanceIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#39315D', alignItems: 'center', justifyContent: 'center' },
  balance: { color: '#FFFFFF', fontSize: 35, fontWeight: '800', marginTop: 15, letterSpacing: -1 },
  balanceBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#69D7AE', marginRight: 8 },
  balanceFoot: { color: '#B7B0D3', fontSize: 12 },
});
