import { Animated, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as Storage from '@/lib/storage';
import Ionicons from '@expo/vector-icons/Ionicons';


type UserInfo = { name?: string; lastname?: string; profileImage?: string }
type Expense = { name: string; category: string; amount: number }
type CardInfo = {
    cardNumb: string
    expirationDate: string
    cvv: string
    initialBalance: number
    expenses: Expense[]
}
type ToastMessage = { type: 'success' | 'error'; message: string }

const Toast = ({ toast }: { toast: ToastMessage | null }) => {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(16)).current

    useEffect(() => {
        if (!toast) return
        opacity.setValue(0)
        translateY.setValue(16)
        Animated.parallel([
            Animated.timing(opacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start()
    }, [toast])

    if (!toast) return null

    return (
        <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className={`absolute bottom-8 left-6 right-6 flex-row items-center gap-3 px-5 py-4 rounded-2xl z-50
                ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
            <Text className='text-white text-lg'>
                {toast.type === 'success' ? '✓' : '✕'}
            </Text>
            <Text className='text-white text-base font-semibold flex-1'>
                {toast.message}
            </Text>
        </Animated.View>
    )
}


const AddCard = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'unknown' | ''>('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [showCVV, setShowCVV] = useState(false);

    const [toast, setToast] = useState<ToastMessage | null>(null)
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showToast = (type: ToastMessage['type'], message: string) => {
        if (toastTimer.current) clearTimeout(toastTimer.current)
        setToast({ type, message })
        toastTimer.current = setTimeout(() => setToast(null), 3000)
    }


    const [cardInfo, setCardInfo] = useState<CardInfo>({
        cardNumb: '',
        expirationDate: '',
        cvv: '',
        initialBalance: 0,
        expenses: [],
    })

    const [errors, setErrors] = useState({
        numbError: '',
        expirationError: '',
        cvvError: '',
    })

    const cardLogo = {
        visa: require('../../assets/visa-logo.png'),
        mastercard: require('../../assets/mastercard-logo.png'),
    };
    
    useEffect(() => {
        const loadData = async () => {

            const user = await Storage.getItem('userInfo')
            if (user) {
                try { setUserInfo(JSON.parse(user)) } catch { setUserInfo(null) }
            }

            const savedCard = await Storage.getItem('card')

            if (savedCard) {
                let card: Partial<CardInfo> & { type?: string }
                try { card = JSON.parse(savedCard) } catch { return }

                setCardInfo({
                    cardNumb: card.cardNumb || '',
                    expirationDate: card.expirationDate || '',
                    cvv: card.cvv || '',
                    initialBalance: Number(card.initialBalance) || 0,
                    expenses: Array.isArray(card.expenses) ? card.expenses : []
                })

                setCardType(card.type === 'visa' || card.type === 'mastercard' ? card.type : card.cardNumb ? 'unknown' : '')
                setIsEditMode(true)
            }
        }

        loadData()

        return () => { if (toastTimer.current) clearTimeout(toastTimer.current) }
    }, [])

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 16);
        return cleaned.match(/.{1,4}/g)?.join(' ') || '';
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 4);

        if (cleaned.length < 3) return cleaned;

        return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    };

    const getCardType = (number: string): 'visa' | 'mastercard' | 'unknown' => {
        const cleaned = number.replace(/\s/g, '');

        if (/^4/.test(cleaned)) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        if (/^2(2[2-9]|[3-6]|7[01])/.test(cleaned)) return 'mastercard';

        return 'unknown';
    };

    const addCardHandled = async () => {

        const [month, year] = cardInfo.expirationDate.split('/').map(Number)
        const newErrors = {
            numbError: cardInfo.cardNumb.replace(/\s/g, '').length !== 16 ? 'Card number should be 16 digits' : '',
            expirationError: cardInfo.expirationDate.length !== 5 || month < 1 || month > 12 || !year ? 'Wrong expiry date' : '',
            cvvError: !/^\d{3}$/.test(cardInfo.cvv) ? 'CVV must be 3 digits' : '',
        }

        setErrors(newErrors)

        const firstError = Object.values(newErrors).find(e => e !== '')
        if (firstError) {
            showToast('error', firstError)   // ← error toast
            return
        }

        const newCard = {
            ...cardInfo,
            type: cardType,
            expenses: Array.isArray(cardInfo.expenses) ? cardInfo.expenses : [],
            owner: {
                name: userInfo?.name,
                lastname: userInfo?.lastname
            },
            createdAt: new Date().toISOString()
        }

        await Storage.setItem('card', JSON.stringify(newCard))

        setIsEditMode(true)
        showToast('success', isEditMode ? 'Changes saved!' : 'Card added successfully!')
        console.log('Card saved / updated')
    }

    return (
        <View className='justify-center items-center flex-1 px-6 gap-8 bg-[#090D18]'>

            <View className={`h-70 w-full relative gap-3 justify-center items-center px-10 bg-linear-to-br rounded-4xl overflow-hidden
                ${
                    cardType === 'visa' ? "from-[#166ec9] via-[#024da1] to-[#023674]" :
                    cardType === 'mastercard' ? "from-[#939392] to-[#050505]" :
                    'from-gray-600 to-black'
                } `}>

                <Image
                    source={require('../../assets/world.jpg')}
                    className={`absolute inset-0 w-[364px] rounded-4xl z-0 h-full ${cardType === 'visa' ? 'opacity-20' : 'opacity-0'}`}
                />

                <Image
                    source={require('../../assets/world-black.png')}
                    className={`absolute -left-35 w-[400px] rotate-15 z-0 h-full ${cardType === 'mastercard' ? 'opacity-30' : 'opacity-0'}`}
                />

                <Text className='text-white absolute top-5 text-[18px] left-10 font-medium'>
                    Expense Tracker
                </Text>

                <Image className='w-10 h-10 absolute top-5 right-10' source={require('../../assets/NFC.png')} />

                <Image
                    className={`w-15 h-10 absolute bottom-5 right-5 ${cardType !== 'unknown' ? 'opacity-100' : 'opacity-0'}`}
                    source={cardType === 'visa' || cardType === 'mastercard' ? cardLogo[cardType] : undefined}
                />

                <Image className='w-12 h-12 absolute top-11 left-10' source={require('../../assets/silver-chip.png')} />

                <TextInput
                    value={cardInfo.cardNumb}
                    onChangeText={(text) => {
                        const formatted = formatCardNumber(text)
                        setCardInfo(prev => ({ ...prev, cardNumb: formatted }))
                        setCardType(getCardType(formatted))
                    }}
                    keyboardType='numeric'
                    className='w-full mt-5 font-bold text-[20px] bg-black/25 border-white/40 border rounded-lg text-white'
                    textAlign='center'
                    placeholderTextColor='white'
                    placeholder='Card number'
                />

                <View className='flex-row w-full gap-5 items-center'>

                    <TextInput
                        value={cardInfo.expirationDate}
                        onChangeText={(text) =>
                            setCardInfo(prev => ({
                                ...prev,
                                expirationDate: formatExpiry(text)
                            }))
                        }
                        maxLength={5}
                        className='bg-black/25 font-bold text-xl border-white/40 flex-1 border rounded-lg text-white'
                        textAlign='center'
                        placeholderTextColor='white'
                        placeholder='Expiration Date'
                    />

                    

                   <View className="flex-1 relative">
                        <TextInput
                            value={cardInfo.cvv}
                            maxLength={3}
                            keyboardType="numeric"
                            secureTextEntry={!showCVV}
                            onChangeText={(text) =>
                                setCardInfo((prev) => ({
                                    ...prev,
                                    cvv: text,
                                }))
                            }
                            className="bg-black/25 font-bold text-xl border-white/40 border rounded-lg text-white pr-12"
                            textAlign="center"
                            placeholderTextColor="white"
                            placeholder="CVV"
                        />

                        <TouchableOpacity
                            onPress={() => setShowCVV(!showCVV)}
                            className="absolute right-3 top-1/2"
                            style={{ transform: [{ translateY: -12 }] }}
                        >
                            <Ionicons
                                name={showCVV ? "eye-off" : "eye"}
                                size={22}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    
                </View>

                <Text className='text-[18px] font-semibold absolute bottom-7 left-11 text-white'>
                    {userInfo?.name} {userInfo?.lastname}
                </Text>
            </View>

            <View className="relative w-full px-2">
                <Text
                    className="absolute left-4 -top-3 bg-[#090D18] px-2 text-[#C7BEFF] text-sm font-medium z-10"
                >
                    Initial Balance
                </Text>

                <TextInput
                    value={String(cardInfo.initialBalance)}
                    onChangeText={(text) =>
                        setCardInfo((prev) => ({
                            ...prev,
                            initialBalance: Number(text) || 0,
                        }))
                    }
                    keyboardType="numeric"
                    placeholder="Enter amount"
                    placeholderTextColor="#9ca3af"
                    className="w-full h-14 rounded-2xl border-2 border-[#51447F] bg-[#111827] px-4 text-[18px] text-white"
                />
            </View>

            <TouchableOpacity
                onPress={addCardHandled}
                className='bg-[#8F7CFF] w-40 h-15 justify-center items-center rounded-lg'
            >
                <Text className='text-white text-center text-2xl font-semibold'>
                    {isEditMode ? "Save Changes" : "Add Card"}
                </Text>
            </TouchableOpacity>

            {/* ── Toast ── */}
            <Toast toast={toast} />

        </View>
    )
}

export default AddCard
