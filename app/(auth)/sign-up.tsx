import React, { useState } from 'react'
import { View, Text, ScrollView, Image, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';
import { images } from '../../constants';
import FormField from '@/components/FormField';
import CustomButton from '../../components/CustomButton'
import { createUser } from '../../lib/appwrite'

interface IForm {
  email: string,
  password: string,
  userName: string
}

const SignUp: React.FC = (): React.ReactElement => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
  const [form, setForm] = useState<IForm>({
    userName: '',
    email: '',
    password: '',
  })

  const submit = async () => {
    const {email, userName, password} = form

    if(!email || !password || !userName) {
      Alert.alert('Error', 'Please fill in all the fields')
      return
    }

    setIsSubmiting(true)

    try{
      const result = await createUser(email, password, userName)
      setForm({
        userName: '',
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
          > Sign-Up to{'  '}
            <Text className='text-secondary block'>React Native App</Text>
          </Text>
          <FormField
            title='UserName'
            placeholder='Enter Your name'
            value={form.userName}
            handleChangeText={(e) => {setForm({...form, userName: e})}}
            otherStyles='mt-10'
            autoCapitalize='words'
          />
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
            title='Sign-up'
            handlePress={submit}
            isLoading={isSubmiting}
            containerStyles='mt-10'
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text
              className='text-lg text-gray-100 font-pregular'
            >Have an account alredy?</Text>
            <Link 
              href="/sign-in"
              className='text-lg font-psemibold text-secondary'
            >
              Log in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp 