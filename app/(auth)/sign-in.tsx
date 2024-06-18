import React, { useState } from 'react'
import { View, Text, ScrollView, Image, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';
import { images } from '../../constants';
import FormField from '@/components/FormField';
import CustomButton from '../../components/CustomButton'

import { signIn, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider';

interface IForm {
  email: string,
  password: string
}

const SignIn: React.FC = (): React.ReactElement => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState<IForm>({
    email: '',
    password: '',
  })

  const submit = async () => {
    const {email, password} = form
    
    if(!email || !password ) {
      Alert.alert('Error', 'Please fill in all the fields')
      return
    }

    setIsSubmiting(true)

    try{
      await signIn(email, password)

      const result = await getCurrentUser()
      setUser(result)
      setIsLoggedIn(true)

      setForm({
        email: '',
        password: '',
      })
      router.replace('/home')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='py-5'>
        <View className='w-full min-h-[80vh] my-4 px-4 justify-center'>
          <Image 
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <Text
            className='text-2xl text-white text-semibold font-psemibold mt-10 flex flex-col self-center text-center'
          > Log in to{'  '}
            <Text className='text-secondary block'>React Native App</Text>
          </Text>
          <FormField
            title='Email'
            placeholder='Enter Your Email'
            value={form.email}
            handleChangeText={(e) => {setForm({...form, email: e})}}
            otherStyles='mt-7'
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <FormField
            title='Password'
            placeholder='Enter Your Password'
            value={form.password}
            handleChangeText={(e) => {setForm({...form, password: e})}}
            otherStyles='mt-7'
            keyboardType='default'
            autoCapitalize='none'
          />

          <CustomButton 
            title='Sign-in'
            handlePress={submit}
            isLoading={isSubmiting}
            containerStyles='mt-10'
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text
              className='text-lg text-gray-100 font-pregular'
            >Dont have an account?</Text>
            <Link 
              href="/sign-up"
              className='text-lg font-psemibold text-secondary'
            >
              Sign-up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn 