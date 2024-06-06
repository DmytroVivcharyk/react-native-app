import React from "react";
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

interface IButton {
    title: string,
    handlePress: (e: GestureResponderEvent) => void,
    containerStyles?: string,
    textStyles?: string,
    isLoading: boolean
}

const CustomButton: React.FC<IButton> = ({title, handlePress, containerStyles, textStyles, isLoading}): React.ReactElement => {

    return (
        <TouchableOpacity
             disabled={isLoading}
            activeOpacity={0.7}
            className={`bg-secondary rounded-xl min-h-[62px] w-full
            justify-center items-center ${containerStyles}
            ${isLoading? 'opacity: 50': ''}`}
            onPress={handlePress}
            >
            <Text className={`font-psemibold text-primary text-lg px-4 ${textStyles}`}
            >{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton