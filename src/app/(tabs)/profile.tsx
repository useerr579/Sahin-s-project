
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { C } from '@/components/Premium';
import { logoutAccount } from '@/lib/auth';
import * as Storage from '@/lib/storage';

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState('User');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await Storage.getItem('userInfo');

        if (raw) {
          const user = JSON.parse(raw);

          setName(user.name || 'User');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.log('Profile loading error:', error);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await logoutAccount();

      router.replace('/login');
    } catch (error) {
      console.log('Logout error:', error);
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person-outline',
      route: '/profile',
    },
    {
      title: 'Analytics',
      icon: 'bar-chart-outline',
      route: '/analytics',
    },
    {
      title: 'Subscriptions',
      icon: 'repeat-outline',
      route: '/subscriptions',
    },
    {
      title: 'Calendar',
      icon: 'calendar-outline',
      route: '/calendar',
    },
    {
      title: 'Achievements',
      icon: 'trophy-outline',
      route: '/achievements',
    },
  ] as const;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: C.bg,
      }}
      contentContainerStyle={{
        padding: 22,
        paddingBottom: 110,
      }}
    >
      <Text
        style={{
          color: C.text,
          fontSize: 30,
          fontWeight: '900',
          marginBottom: 25,
        }}
      >
        Profile
      </Text>

      <View
        style={{
          backgroundColor: '#171D2D',
          borderRadius: 22,
          padding: 22,
          marginBottom: 25,
          borderWidth: 1,
          borderColor: '#293149',
        }}
      >
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 22,
            backgroundColor: '#29234B',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 17,
          }}
        >
          <Ionicons
            name="person"
            size={32}
            color={C.purple}
          />
        </View>

        <Text
          style={{
            color: C.text,
            fontSize: 23,
            fontWeight: '900',
          }}
        >
          {name}
        </Text>

        <Text
          style={{
            color: C.muted,
            fontSize: 14,
            marginTop: 6,
          }}
        >
          {email}
        </Text>

        <View
          style={{
            backgroundColor: '#29234B',
            paddingHorizontal: 13,
            paddingVertical: 7,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginTop: 15,
          }}
        >
          <Text
            style={{
              color: C.purple,
              fontWeight: '800',
              fontSize: 11,
            }}
          >
            PREMIUM MEMBER
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: C.muted,
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 2,
          marginBottom: 13,
        }}
      >
        ACCOUNT SETTINGS
      </Text>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.title}
          onPress={() => {
            if (item.title !== 'Personal Information') {
              router.push(item.route as any);
            }
          }}
          style={{
            backgroundColor: '#171D2D',
            borderRadius: 16,
            padding: 18,
            marginBottom: 11,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#293149',
          }}
        >
          <Ionicons
            name={item.icon as any}
            size={22}
            color={C.purple}
          />

          <Text
            style={{
              color: C.text,
              fontSize: 14,
              fontWeight: '700',
              marginLeft: 14,
              flex: 1,
            }}
          >
            {item.title}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={C.muted}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={loading}
        onPress={handleLogout}
        style={{
          backgroundColor: '#3A1D2A',
          borderRadius: 16,
          padding: 18,
          marginTop: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#713247',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FF718D" />
        ) : (
          <>
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#FF718D"
            />

            <Text
              style={{
                color: '#FF718D',
                fontSize: 15,
                fontWeight: '900',
                marginLeft: 10,
              }}
            >
              Log Out
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
