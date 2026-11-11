import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Storage from '@/lib/storage';
import Loading from '@/components/Loading';

type UserInfo = { name: string; lastname: string; profileImage?: string }

const EditUser = () => {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    const [refreshing, setRefreshing] = useState(false)

    const [formData, setFormData] = useState({
            name: '',
            lastname: ''
        })
        const [errors, setErrors] = useState({
            nameError: '',
            lastnameError: ''
        })
     
        const validate = () => {
            const newErrors = {
                nameError: !formData.name ? 'Name is required' : '',
                lastnameError: !formData.lastname ? 'Lastname is required' : '',
            }

            setErrors(newErrors)

            return Object.values(newErrors).every(error => error === '')
        }
     
        const handleChange = (name: 'name' | 'lastname', value: string) => {
            setFormData(prevState => ({ ...prevState, [name]: value }))
        }
     
        const handleSubmit = async () => {

            const isValid = validate();

            console.log('Validate result:', isValid);

            if (!isValid) {
                return;
            }

            const updatedUserInfo = { ...userInfo, ...formData }
            await Storage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setUserInfo(updatedUserInfo)
            return true;
        }

        const loadUser = async () => {
            const data = await Storage.getItem('userInfo');
                
            if (data) {
                const parsedData = JSON.parse(data) as UserInfo
                setUserInfo(parsedData);
                setFormData(parsedData);
            }
        }

        useEffect(() => {
            
            loadUser()
        }, [])

    return (
        <View className='flex-1 bg-white px-8 gap-10'>
            <Text className='mt-20 text-4xl font-medium mb-4'>Edit your info</Text>
            <View className="gap-2">
                <Text className="text-zinc-700 font-semibold ml-1">
                    Name
                </Text>

                <View className="bg-zinc-50 rounded-2xl px-4 border border-zinc-100">
                    <TextInput
                        value={formData.name}
                        onChangeText={(text) =>
                            handleChange('name', text)
                        }
                        placeholder="John"
                        placeholderTextColor="#a1a1aa"
                        className="py-4 text-zinc-800"
                    />
                </View>

                {errors.nameError && (
                    <Text className="text-red-500 text-sm ml-1">
                        {errors.nameError}
                    </Text>
                )}
            </View>


            <View className="gap-2">
                <Text className="text-zinc-700 font-semibold ml-1">
                    Lastname
                </Text>

                <View className="bg-zinc-50 rounded-2xl px-4 border border-zinc-100">
                    <TextInput
                        value={formData.lastname}
                        onChangeText={(text) =>
                            handleChange('lastname', text)
                        }
                        placeholder="Doe"
                        placeholderTextColor="#a1a1aa"
                        className="py-4 text-zinc-800"
                    />
                </View>

                {errors.lastnameError && (
                    <Text className="text-red-500 text-sm ml-1">
                        {errors.lastnameError}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                    disabled={(formData.name.trim() === userInfo?.name.trim() && formData.lastname.trim() === userInfo?.lastname.trim()) || refreshing}
                    onPress={async () => {
                            setRefreshing(true)
                            try {
                                const saved = await handleSubmit()
                                if (saved) setUserInfo({ ...formData, profileImage: userInfo?.profileImage })
                            } finally {
                                setRefreshing(false)
                            }
                            
                        }}
                        className={`${(formData.name.trim() === userInfo?.name.trim() && formData.lastname.trim() === userInfo?.lastname.trim()) || refreshing  ? "opacity-70" : "opacity-100"} bg-[#181c49] rounded-2xl py-5 gap-20 justify-center items-center`}
                    >

                        <Text className="text-center text-white font-bold text-lg">
                            Save
                        </Text>
                        {refreshing && <Loading />}
            </TouchableOpacity>
        </View>
    )
}

export default EditUser

const styles = StyleSheet.create({})
