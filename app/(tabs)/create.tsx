import React, {useState} from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Video, ResizeMode } from 'expo-av'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'


import { icons } from '../../constants'
import FormField from '../../components/FormField'
import CustoButton from '../../components/CustomButton'

import { useGlobalContext } from '../../context/GlobalProvider'
import { postVideo } from '../../lib/appwrite'

import {IPickFileResponse, IAsset} from '../../types/fileInterface'

interface ICreate {

}
export type fileType = 'video' | 'image'

export interface IPostForm {
  title: string,
  prompt: string,
  video: IAsset | null,
  thumbnail: IAsset | null,
  userId: string | null
}

const Create: React.FC<ICreate> = () => {
  const [uploading, setUploading] = useState(false)
  const {user} = useGlobalContext()
  const [form, setForm] = useState<IPostForm>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
    userId: user?.$id || null
  })

  const openPicker = async (selectType: fileType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ?  
          ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    }).then(res => res as IPickFileResponse)


    if(!result.canceled) {
      if(selectType === 'image') {
        setForm({...form, thumbnail: result.assets[0]})
      }
      if(selectType === 'video') {
        setForm({...form, video: result.assets[0]})
      }
    } 
  } 

  const onSbmited = async () => {
    if(!form.userId) return Alert.alert('You are not authorized, Please try to log-in again!')
    if(!form.prompt || !form.thumbnail || !form.title || !form.video) {
      return Alert.alert('Please fill in all the fields')
    }

    setUploading(true)
    console.log(form) 
    
    try {

      await postVideo(form)

      Alert.alert('Succes', 'Post uploaded successfully')
      router.push('/home')

    } catch (error : any) {
      Alert.alert('Error', error.message)

    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
        userId: user?.$id || null
      })

      setUploading(false)
    }
  }

  return (
    <SafeAreaView className='h-full bg-primary' >
      <ScrollView className='px-4 my-6' >
        <Text
          className='text-2xl text-white font-psemibold'
        >Upload Video</Text>

        <FormField 
          otherStyles='mt-10'
          title='Video Title'
          value={form.title}
          placeholder='give your video a catch title...'
          handleChangeText={(e) => setForm({...form, title: e})}
        />

        <View className='space-y-2 mt-7' >
          <Text className='text-base text-gray-100 font-pmedium'>
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              < Video 
                source={{uri: form.video?.uri}}
                className='w-full h-64 rounded-xl'
                resizeMode={ResizeMode.STRETCH}
                isLooping
              />
            ) : (
              <View 
                className='w-full h-40 px-4 bg-black-100 
                rounded-2xl justify-center items-center'>
                  <View className='w-14 h-14 border border-dashed
                    border-secondary-100 justify-center items-center'>
                  <Image 
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />
                  </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker('image')} >
            {form.thumbnail ? (
              <Image 
                source={{uri: form.thumbnail.uri}}
                resizeMode='contain'
                className=' w-full h-64 rounded-2xl'
              />
            ) : (
              <View 
                className='w-full h-16 px-4 bg-black-100 border-2 border-black-200
                rounded-2xl justify-center items-center flex-row space-x-2'>
                  <Image 
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-5 h-5'
                  />
                  <Text className='text-sm text-gray-100 font-pmedium'>
                    Chose a file
                  </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          otherStyles='mt-7'
          title='AI Prompt'
          value={form.prompt}
          placeholder='Prompt you used '
          handleChangeText={(e) => setForm({...form, prompt: e})}
        />

        <CustoButton 
          isLoading={uploading}
          title='Submit & Publish'
          handlePress={onSbmited}
          containerStyles='mt-7'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create