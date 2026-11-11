import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const colors: Record<string, string> = { Shopping: '#A78BFA', Grocery: '#63D6B0', Pharmacy: '#65B8FF', Bills: '#F6B86A' };

export default function CategoryCard({ title, lastDate, hour, iconName }: any) {
  const router = useRouter();
  const color = colors[title] || '#A78BFA';
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/expenses', params: { category: title.toLowerCase() } })} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: `${color}22` }]}><Ionicons size={23} color={color} name={iconName} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{lastDate}</Text>
      <Text style={styles.date}>{hour}</Text>
      <Ionicons name="arrow-up-right" size={17} color="#778198" style={styles.arrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', padding: 16, borderRadius: 20, width: '48%', minHeight: 145, borderWidth: 1, borderColor: '#273044', marginBottom: 12 },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  title: { color: '#F5F6FA', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  date: { color: '#8993A7', fontSize: 11, marginTop: 2 },
  arrow: { position: 'absolute', right: 13, top: 14 },
});
