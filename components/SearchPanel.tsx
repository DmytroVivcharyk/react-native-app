import React, { useState } from 'react'
import { View, TextInput, Image, TouchableOpacity ,KeyboardTypeOptions, TextInputProps, Alert } from 'react-native'
import { router, usePathname } from 'expo-router'

import { icons } from '../constants'

interface ISearchPanel extends TextInputProps {
    otherStyles?: string,
    placeholder?: string,
    initialQuery: string
}

const SearchPanel: React.FC<ISearchPanel> = ({otherStyles, placeholder, initialQuery, ...rest }: ISearchPanel): React.ReactElement => {
    rest.style = null // some strange behavior???

    const patthname  = usePathname()
    const [query, setQuery] = useState<string>(initialQuery)

    const handleSearch = () => {
      if(!query) {
        return Alert.alert('Missing query', 'Plese input what would you like to find!')
      }

      if(patthname.startsWith('/search')) {
        router.setParams({query})
      } else {
        router.push(`/search/${query}`)
      }
    }

    return (
      <View 
        className='w-full h-16 bg-black-100 rounded-2xl border-2 flex-row items-center
         border-black-200 focus:border-secondary px-4 justify-center space-x-4' 
      >
        <TextInput 
            className='text-xl text-white font-pregular flex-1 h-full'
            placeholder={placeholder}
            placeholderTextColor='#CDCDE0'
            value={query}
            onChangeText={(e) => setQuery(e)}
            {...rest}
        />
        <TouchableOpacity
          onPress={handleSearch}
        >
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