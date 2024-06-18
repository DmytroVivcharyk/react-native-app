import { View, Text } from 'react-native'
import React from 'react'

interface IInfoBox {
    title: string | number,
    subtitle?: string,
    contanerStyles?: string,
    titleStyles?: string
}

const InfoBox: React.FC<IInfoBox> = ({title, contanerStyles, titleStyles, subtitle}) => {
  return (
    <View className={` ${contanerStyles}`} >
      <Text 
        className={`text-white text-center font-psemibold ${titleStyles}`}
      >{title}</Text>
      <Text 
        className={`text-sm text-gray-100 text-center font-pregular ${titleStyles}`}
      >{subtitle}</Text>
    </View>
  )
}

export default InfoBox