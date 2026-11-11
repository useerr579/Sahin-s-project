import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Storage from '@/lib/storage';

const OnboardingRegister = ({setStep}: { setStep: (step: number) => void }) => {

        const [formData, setFormData] = useState({
            name: '',
            lastname: '',
            profileImage: null
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

            await Storage.setItem(
                'userInfo',
                JSON.stringify(formData)
            );

            return true;
        }

    return (
        <View className='flex-1 bg-[#090D18] px-8 gap-10'>
            <Text className='mt-20 text-4xl font-bold mb-4 text-white'>Add your info</Text>
            <View className="gap-2">
                <Text className="text-[#E6E8F0] font-semibold ml-1">
                    Name
                </Text>

                <View className="bg-[#0B1220] rounded-2xl px-4 border border-[#273044]">
                    <TextInput
                        value={formData.name}
                        onChangeText={(text) =>
                            handleChange('name', text)
                        }
                        placeholder="John"
                        placeholderTextColor="#a1a1aa"
                        className="py-4 text-white"
                    />
                </View>

                {errors.nameError && (
                    <Text className="text-red-500 text-sm ml-1">
                        {errors.nameError}
                    </Text>
                )}
            </View>

            <View className="gap-2">
                <Text className="text-[#E6E8F0] font-semibold ml-1">
                    Lastname
                </Text>

                <View className="bg-[#0B1220] rounded-2xl px-4 border border-[#273044]">
                    <TextInput
                        value={formData.lastname}
                        onChangeText={(text) =>
                            handleChange('lastname', text)
                        }
                        placeholder="Doe"
                        placeholderTextColor="#a1a1aa"
                        className="py-4 text-white"
                    />
                </View>

                {errors.lastnameError && (
                    <Text className="text-red-500 text-sm ml-1">
                        {errors.lastnameError}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                        onPress={async () => {
                            if (await handleSubmit()) {
                                setStep(4)
                            }
                        }}
                        className="bg-[#181c49] rounded-2xl py-5"
                    >
                        <Text className="text-center text-white font-bold text-lg">
                            Create Account
                        </Text>
            </TouchableOpacity>
        </View>
    )
}

export default OnboardingRegister

const styles = StyleSheet.create({})
