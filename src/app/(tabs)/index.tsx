import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

import Header from '@/components/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import ModalComponent from '@/components/ModalComponent';
import * as Storage from '@/lib/storage';
import CategoryCard from '@/components/CategoryCard';
import Toast from 'react-native-toast-message';

type Expense = { name: string; category: string; amount: number }
type CardInfo = {
  cardNumb: string
  expirationDate: string
  cvv: string
  initialBalance: number
  expenses: Expense[]
  [key: string]: unknown
}
type IconName = React.ComponentProps<typeof Ionicons>['name']

export default function HomeScreenBody() {
  const router = useRouter();

  const [isExpModalVisible, setExpModalVisible] = useState(false);
  const [isTopModalVisible, setTopModalVisible] = useState(false);

  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  const [expense, setExpense] = useState({
    name: '',
    category: 'any',
    amount: 0,
  });

  const [topup, setTopup] = useState(0);

  const topupOptions = [50, 100, 250, 500];

  const selectOptions = [
    {
      title: 'Shopping',
      value: 'shopping',
      icon: 'cart-outline' as IconName,
    },
    {
      title: 'Grocery',
      value: 'grocery',
      icon: 'cube-outline' as IconName,
    },
    {
      title: 'Pharmacy',
      value: 'pharmacy',
      icon: 'medkit-outline' as IconName,
    },
    {
      title: 'Bills',
      value: 'bills',
      icon: 'wallet-outline' as IconName,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      const loadCard = async () => {
        const data = await Storage.getItem('card');

        if (data) {
          try { setCardInfo(JSON.parse(data)) } catch { setCardInfo(null) }
        } else setCardInfo(null)
      };

      loadCard();
    }, [])
  );

  const saveCard = async (updated: CardInfo) => {
    setCardInfo(updated);
    await Storage.setItem('card', JSON.stringify(updated));
  };

  return (
    <ScrollView className="flex-1 bg-[#090D18]">
      <Header balance={cardInfo?.initialBalance} />

      <View className="px-5 pt-2 pb-28">
        <View className="mb-5 px-1"><Text className="text-white text-2xl font-extrabold">Your overview</Text><Text className="text-[#8993A7] mt-1">A smarter look at your daily spending</Text></View>

        <ModalComponent
          isModalVisible={isExpModalVisible}
          setModalVisible={setExpModalVisible}
        >
          <View className="h-[460px] bg-[#111827] rounded-t-3xl p-5">

            <View>
              <Text className="mb-1 text-white">Expense name</Text>

              <TextInput
                placeholder="Enter name"
                value={expense.name}
                onChangeText={(text) =>
                  setExpense((prev) => ({
                    ...prev,
                    name: text,
                  }))
                }
                placeholderTextColor="#8993A7" className="border rounded-lg border-[#39445A] bg-[#0B1220] text-white pl-3 mb-6"
              />
            </View>

            <View>
              <Text className="mb-1 text-white">Expense amount</Text>

              <TextInput
                inputMode="numeric"
                placeholder="Enter amount"
                value={expense.amount ? String(expense.amount) : ''}
                onChangeText={(text) =>
                  setExpense((prev) => ({
                    ...prev,
                    amount: Number(text) || 0,
                  }))
                }
                placeholderTextColor="#8993A7" className="border rounded-lg border-[#39445A] bg-[#0B1220] text-white pl-3"
              />
            </View>

            <View className="mt-5">
              <Text className="text-white">Select Category</Text>

              <View className="flex-row flex-wrap gap-4 mt-2">
                {selectOptions.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row p-5 border ${
                      item.value === expense.category
                        ? 'bg-amber-600/10 border-[#39445A]'
                        : 'border-[#39445A]'
                    } w-[48%] justify-center items-center gap-2 rounded-xl`}
                    onPress={() =>
                      setExpense((prev) => ({
                        ...prev,
                        category: item.value,
                      }))
                    }
                  >
                    <Ionicons
                      size={24}
                      color={
                        item.value === expense.category ? '#B8ACFF' : '#D4D9E5'
                      }
                      name={item.icon}
                    />

                    <Text
                      className={`${
                        item.value === expense.category
                          ? 'text-orange-400'
                          : 'text-white'
                      }`}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={async () => {
                if (!cardInfo) return;

                const amount = Number(expense.amount) || 0;
                const trimmedName = expense.name.trim();

                if (!trimmedName || amount <= 0) {
                  Toast.show({
                    type: 'error',
                    text1: 'Invalid expense',
                    text2: 'Please enter a valid name and amount.',
                  });
                  return;
                }

                if (amount > Number(cardInfo.initialBalance)) {
                  Toast.show({
                    type: 'error',
                    text1: 'Insufficient balance',
                    text2: "You don't have enough funds for this expense.",
                  });
                  return;
                }

                const updated = {
                  ...cardInfo,
                  expenses: [
                    ...(Array.isArray(cardInfo.expenses) ? cardInfo.expenses : []),
                    {
                      name: trimmedName,
                      category: expense.category || 'shopping',
                      amount,
                    },
                  ],
                  initialBalance:
                    Number(cardInfo.initialBalance) - amount,
                };

                await saveCard(updated);

                Toast.show({
                  type: 'success',
                  text1: 'Expense added',
                  text2: `$${amount} deducted from your balance.`,
                });

                setExpense({
                  name: '',
                  category: 'shopping',
                  amount: 0,
                });

                setExpModalVisible(false);
              }}
              className="bg-[#8F7CFF] py-5 rounded-2xl mt-6"
            >
              <Text className="text-white text-center font-medium text-lg">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </ModalComponent>


        <ModalComponent
          isModalVisible={isTopModalVisible}
          setModalVisible={setTopModalVisible}
        >
          <View className="h-[350px] bg-[#111827] rounded-t-3xl p-5">

            <View>
              <Text className="mb-1 text-white">Topup amount</Text>

              <TextInput
                inputMode="numeric"
                placeholder="Enter amount"
                value={String(topup)}
                onChangeText={(text) =>
                  setTopup(Number(text) || 0)
                }
                placeholderTextColor="#8993A7" className="border rounded-lg border-[#39445A] bg-[#0B1220] text-white pl-3"
              />
            </View>

            <View className="flex-row flex-wrap gap-2 mt-6">
              {topupOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setTopup(item)}
                  className="w-[49%] rounded-xl border border-[#51447F] p-5"
                >
                  <Text className="text-center text-white">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={async () => {
                if (!cardInfo) return;

                if (!topup || topup <= 0) {
                  Toast.show({
                    type: 'error',
                    text1: 'Invalid amount',
                    text2: 'Please enter a valid topup amount.',
                  });
                  return;
                }

                const updated = {
                  ...cardInfo,
                  initialBalance:
                    Number(cardInfo.initialBalance) + Number(topup),
                };

                await saveCard(updated);

                Toast.show({
                  type: 'success',
                  text1: 'Topup successful',
                  text2: `$${topup} added to your balance.`,
                });

                setTopModalVisible(false);
                setTopup(0);
              }}
              className="bg-[#8F7CFF] py-5 rounded-2xl mt-8"
            >
              <Text className="text-white text-center font-medium text-lg">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </ModalComponent>

        {/* UI */}

        <View className="flex-row justify-between items-center mb-4 px-3">
          <Text className="text-3xl font-bold text-white">
            Activities
          </Text>

          <Text className="text-md text-[#9AA4B7]">
            Monthly Report
          </Text>
        </View>

        <View className="flex-row gap-3">

          <View className="flex-1 gap-3">

            <TouchableOpacity
              onPress={() => setExpModalVisible(true)}
              className="bg-[#25213F] border border-[#51447F] justify-center items-center rounded-[20px] p-[18px] min-h-[130px] overflow-hidden"
            >
              <Ionicons
                color="white"
                size={40}
                name="cash-outline"
              />

              <Text className="text-white text-sm font-medium mb-1">
                Details
              </Text>

              <Text className="text-white text-xl font-bold">
                ${cardInfo?.initialBalance || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTopModalVisible(true)}
              className="bg-[#111827] border border-[#273044] rounded-[20px] p-[18px] min-h-[100px] items-center justify-center"
            >
              <View className="w-11 h-11 rounded-xl border-2 border-white items-center justify-center mb-2">
                <Ionicons
                  size={34}
                  color="white"
                  name="arrow-up-circle-outline"
                />
              </View>

              <Text className="text-white text-sm font-semibold">
                Topup
              </Text>
            </TouchableOpacity>

          </View>

          <View className="flex-1 bg-[#111827] border border-[#273044] rounded-[20px] p-4.5 items-center justify-center">

            <View className="h-11 w-11 border-2 border-white rounded-xl self-center p-2 mb-3">
              <Ionicons
                color="white"
                size={20}
                name="git-pull-request-outline"
              />
            </View>

            <Text className="text-white text-[32px] font-bold leading-9">
              18
            </Text>

            <Text className="text-white text-sm font-medium mt-0.5">
              Requests
            </Text>

            <Text className="text-[#8A8FA3] text-xs mt-2 mb-2">
              Requests channel
            </Text>

            <View className="flex-row items-center">
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
                className="w-8 h-8 rounded-full border-2 border-[#0D1B4B] z-30"
              />

              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
                className="w-8 h-8 rounded-full border-2 border-[#0D1B4B] -ml-2.5 z-20"
              />

              <View className="w-8 h-8 rounded-full bg-[#2A3A7A] border-2 border-[#0D1B4B] -ml-2.5 z-10 items-center justify-center">
                <Text className="text-white text-[9px] font-bold">
                  +14
                </Text>
              </View>
            </View>

          </View>
        </View>

        <View className='gap-4 mt-5'>
          <View className='w-full flex-row justify-between'>
            <CategoryCard title="Shopping" lastDate="20 June 2020" hour="2:20 PM" iconName="cart-outline" />
            <CategoryCard title="Grocery" lastDate="20 June 2020" hour="2:20 PM" iconName="cube-outline" />
          </View>

          <View className='w-full flex-row justify-between'>
            <CategoryCard title="Pharmacy" lastDate="20 June 2020" hour="2:20 PM" iconName="medkit-outline" />
            <CategoryCard title="Bills" lastDate="20 June 2020" hour="2:20 PM" iconName="wallet-outline" />
          </View>
        </View>

        <View className="mt-5 rounded-3xl bg-[#111827] border border-[#273044] p-5">
          <View className="flex-row justify-between items-center mb-4">
            <View><Text className="text-white text-lg font-extrabold">Spending insight</Text><Text className="text-[#8993A7] text-xs mt-1">Weekly overview</Text></View>
            <Ionicons name="analytics-outline" size={23} color="#A99BFF" />
          </View>
          <View className="flex-row items-end justify-between h-24">
            {[32, 58, 42, 76, 48, 88, 61].map((height, index) => <View key={index} className="flex-1 mx-1 rounded-t-lg" style={{ height: `${height}%`, backgroundColor: index === 5 ? '#A99BFF' : '#51447F' }} />)}
          </View>
          <View className="flex-row justify-between mt-3"><Text className="text-[#8993A7] text-xs">Mon</Text><Text className="text-[#8993A7] text-xs">Tue</Text><Text className="text-[#8993A7] text-xs">Wed</Text><Text className="text-[#8993A7] text-xs">Thu</Text><Text className="text-[#8993A7] text-xs">Fri</Text><Text className="text-[#8993A7] text-xs">Sat</Text><Text className="text-[#8993A7] text-xs">Sun</Text></View>
        </View>
        
      </View>


      <Toast />
    </ScrollView>
  );
}
