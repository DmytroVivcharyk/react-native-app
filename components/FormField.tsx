import { View, Text, TextInput, TouchableOpacity, Image, KeyboardTypeOptions, TextInputProps } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'

interface IFormField extends TextInputProps {
    title: string,
    value: string,
    handleChangeText: (text: string) => void,
    otherStyles?: string,
    placeholder?: string,
}

const FormField: React.FC<IFormField> = ({title, value, handleChangeText, 
        otherStyles, placeholder, ...props }: IFormField): React.ReactElement => {

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-gray-100 text-base font-pmedium ml-3'>{title}</Text>
      <View 
        className='w-full h-16 bg-black-100 rounded-2xl border-2 flex-row items-center
         border-black-200 focus:border-secondary px-3 ' 
      >
        <TextInput 
            className='text-white font-psemibold h-[100%] flex-1 text-xl'
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
            {...props}
        />

        {title === 'Password' && (
          <TouchableOpacity 
            onPress={() => setShowPassword(val => !val)}
          >
            <Image 
              className='w-9 h-9'
              source={!showPassword ? icons.eye : icons.eyeHide }
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField