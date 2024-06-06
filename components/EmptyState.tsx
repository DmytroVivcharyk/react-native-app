import { View, Text, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import { images } from '@/constants'
import CustomButton from './CustomButton'

interface IEmpty {
    title: string,
    subtitle?: string
}

const EmpteState: React.FC<IEmpty> = ({title, subtitle}) => {
  return (
    <View className='justify-centere items-center px-4'>
      <Image 
        source={images.empty}
        resizeMode='contain'
        className='w-[270px] h-[215px]'
      />
      <Text 
        className='text-xl text-center mt-2 font-psemibold text-white'
      >{title}</Text>
      <Text 
        className='font-pmedium text-sm mt-2 text-gray-100' 
      >{subtitle}</Text>

      <CustomButton 
        title='Create video'
        isLoading={false}
        handlePress={() => { router.push('/create') }}
        containerStyles='mt-5'
      />
    </View>
  )
}

export default EmpteState