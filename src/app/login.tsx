
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { C, Field, Action } from '@/components/Premium';
import { loginAccount } from '@/lib/auth';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Missing details',
        'Enter your email and password.'
      );
      return;
    }

    try {
      setBusy(true);

      await loginAccount(email, password);

      Alert.alert(
        'Login Successful',
        'Welcome back!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)/home'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.message || 'Incorrect email or password.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        backgroundColor: C.bg,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 25,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: 62,
            height: 62,
            borderRadius: 21,
            backgroundColor: '#29234B',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 25,
          }}
        >
          <Ionicons
            name="wallet"
            size={30}
            color={C.purple}
          />
        </View>

        <Text
          style={{
            color: C.purple,
            fontSize: 11,
            fontWeight: '900',
            letterSpacing: 2,
          }}
        >
          DARK PREMIUM FINANCE
        </Text>

        <Text
          style={{
            color: C.text,
            fontSize: 34,
            fontWeight: '900',
            marginTop: 10,
          }}
        >
          Welcome back
        </Text>

        <Text
          style={{
            color: C.muted,
            fontSize: 14,
            marginTop: 8,
            marginBottom: 30,
          }}
        >
          Sign in to continue managing your money.
        </Text>

        <Field
          label="EMAIL ADDRESS"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!show}
        />

        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={{
            alignSelf: 'flex-end',
            marginTop: -7,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              color: C.purple,
              fontWeight: '700',
            }}
          >
            {show ? 'Hide password' : 'Show password'}
          </Text>
        </TouchableOpacity>

        <Action
          label={busy ? 'Signing in...' : 'Sign In'}
          onPress={submit}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: C.muted }}>
            New here?{' '}
          </Text>

          <TouchableOpacity
            disabled={busy}
            onPress={() => router.push('/register')}
          >
            <Text
              style={{
                color: C.purple,
                fontWeight: '900',
              }}
            >
              Create account
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: '#566078',
            fontSize: 10,
            textAlign: 'center',
            marginTop: 35,
            lineHeight: 16,
          }}
        >
          DEMO ACCOUNT STORAGE · Account data is stored locally.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
