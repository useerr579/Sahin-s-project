import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View className='justify-center items-center absolute'>
      <View className='w-10 h-10 border-black border border-b-transparent rounded-full animate-spin'></View>
    </View>
  )
}

export default Loading
