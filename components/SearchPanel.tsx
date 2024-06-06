import { View, Text, TextInput, Image, TouchableOpacity ,KeyboardTypeOptions, TextInputProps, } from 'react-native'
import React from 'react'

import { icons } from '../constants'

interface ISearchPanel extends TextInputProps {
    value: string,
    handleChangeText: (text: string) => void,
    otherStyles?: string,
    placeholder?: string,
}

const SearchPanel: React.FC<ISearchPanel> = ({ value, handleChangeText, 
        otherStyles, placeholder, ...rest }: ISearchPanel): React.ReactElement => {
            rest.style = null // some strange behavior???

    return (
      <View 
        className='w-full h-16 bg-black-100 rounded-2xl border-2 flex-row items-center
         border-black-200 focus:border-secondary px-4 justify-center space-x-4' 
      >
        <TextInput 
            className='text-xl text-white font-pregular flex-1 h-full'
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            // value={value}
            // onChangeText={handleChangeText}
            {...rest}
        />
        <TouchableOpacity>
            <Image 
                source={icons.search}
                resizeMode='contain'
                className='w-5 h-5'
            />
        </TouchableOpacity>
    </View>
  )
}

export default SearchPanel