import React, { useState, useEffect, ReactElement } from 'react'
import { View, Text, Image, FlatList, ListRenderItem, RefreshControl, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { useGlobalContext } from '../../context/GlobalProvider'

import{ icons } from '../../constants'
import InfoBox from '@/components/InfoBox'
import VideoCard from '@/components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { fetchUserPosts, logOut } from '../../lib/appwrite'
import { useAppwrite } from '../../hooks/useAppwrite'


import { IPost } from '@/types/postsInterface'


interface IProfile {

}

const Profile: React.FC<IProfile> = (): ReactElement => {
  const  [isRefreshing, setIsRefreshig] = useState<boolean>(true)
  const { user, setUser, setIsLoggedIn } = useGlobalContext()


  const { data: posts, error, isLoading, refetchData } = useAppwrite<IPost[]>(() => fetchUserPosts(user?.$id as string))

  useEffect(() => {
    setIsRefreshig(isLoading)
  }, [isLoading])

  const onRefresh = async () => {
    setIsRefreshig(true)
    await refetchData()
    setIsRefreshig(false)
  }  

  const onLogoutHandler = async () => {
    console.log('Logedout')
    await logOut()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/')
  }

  const renderItem: ListRenderItem<IPost> = ({ item }) => <VideoCard video={item} />;


  const renderListHeader = () => (
    <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
        <TouchableOpacity
          className='w-full items-end mb-10'
          onPress={onLogoutHandler}
        >
          <Image 
            source={icons.logout}
            resizeMode='contain'
            className='w-6 h-6'
          />
        </TouchableOpacity>
        <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
          <Image 
            source={{uri: user?.avatar}}
            className='w-[90%] h-[90%] rounded-lg'
            resizeMode='contain'
          />
        </View>
        <InfoBox 
          title={user?.username || 'User'}
          contanerStyles='mt-5'
          titleStyles='text-lg'
        />

        <View className='mt-5 flex-row' >
          <InfoBox 
            title={posts?.length || 0}
            subtitle='Posts'
            contanerStyles='mr-10'
            titleStyles='text-xl'
          />
          <InfoBox 
            title='154.8k'
            subtitle='Followers'
            titleStyles='text-xl'
          />
        </View>
    </View>
  )

  const loader = <Text className='text-3xl text-white text-center px-4' >Loading...</Text>
  const errorElemnt = <Text className='text-3xl text-[#ff0000] text-center px-4'>SomeError: {error?.message}</Text>

  const showLoader = isRefreshing ? loader : null
  const showError = error ? errorElemnt : null
  const emptyElement = !isRefreshing && !error ? <EmptyState 
        title='No Videous Found'
        subtitle='No videous found for this search query'
        /> : null

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data={posts}
        keyExtractor={((item: IPost) => item.$id)}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <>
            {showLoader}
            {showError}
            {emptyElement}
          </>
        }
        refreshControl={<RefreshControl 
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />}
      />
    </SafeAreaView>
  )
}

export default Profile