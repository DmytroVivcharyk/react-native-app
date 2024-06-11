import React from "react";
import { View, Text, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from '../constants'
import CustomButton from "@/components/CustomButton";

import { useGlobalContext } from '../context/GlobalProvider'

const App: React.FC = (): React.ReactElement => {
    const { isLoggedIn, isLoading } = useGlobalContext()
    if(!isLoading && isLoggedIn) return <Redirect href='/home' />

    return (
        <SafeAreaView className=" bg-primary h-full">
            <ScrollView contentContainerStyle={{height: '100%'}}>
                <View className='w-full min-h-[85vh] justify-center items-center px-4'>
                    <Image 
                        source={images.logo}
                        resizeMode='contain'
                        className='w-[130px] h-[84px]'
                        style={{objectFit: 'contain', width: 130, height: 84}}
                    />
                    <Image 
                        source={images.cards}
                        resizeMode='contain'
                        className='max-w-[380px] w-full] h-[300px]'
                        style={{objectFit: 'cover', width: '100%', height: 300, maxWidth: 380}}
                    />

                    <View className='relative mt-5'>
                        <Text className='text-2xl text-white text-bold text-center'>
                            Discover Endless Posibilities With{' '}
                            <Text
                                className='text-secondary'
                            >React Native App</Text>
                        </Text>
                        <Image
                            source={images.path}
                            className='absolute w-[136px] h-[15px]
                            -bottom-2 right-8
                            '
                            resizeMode='contain'
                        />
                    </View>
                    <Text
                    className='text-sm font-pregular text-gray-100
                    mt-7 text-center'
                >
                    Where cretive meets innovation: embark on a journey of limitless
                    exploration with React Native App
                </Text>
                    {isLoading ?
                         <Text className='text-3xl text-white text-center px-4 my-4' >Loading...</Text>
                        : <CustomButton 
                        enabled={false}
                        title="Continue with Email"
                        containerStyles='w-full mt-7'
                        // handlePress={() => {router.push('/sign-in')}}
                        handlePress={() => {router.push('/home')}}
                        isLoading={false}
                    />
                    }
                    <Link href='/sign-in' className="text-2xl text-white">Sign-in</Link>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

export default App