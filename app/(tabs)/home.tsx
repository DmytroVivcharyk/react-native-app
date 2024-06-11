import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, Image, FlatList, ListRenderItem, RefreshControl} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import{ images } from '../../constants'
import SearchPanel from '../../components/SearchPanel'
import Trending from '../../components/Trending'
import VideoCard from '@/components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { fetchAllPosts, fetchLatestPosts } from '../../lib/appwrite'
import { IPost } from '@/types/postsInterface'
import { useAppwrite } from '../../hooks/useAppwrite'

const Home: React.FC = () => {
  const [searcValue, setSearchValue] = useState<string>('')
  const  [isRefreshing, setIsRefreshig] = useState<boolean>(true)

  const { data: posts, error, isLoading, refetchData } = useAppwrite<IPost[]>(fetchAllPosts)
  
  const { data: latesPosts, 
    error: latestError, 
    isLoading: isLatestLoading,
    refetchData: refetchLatest
  } = useAppwrite<IPost[]>(fetchLatestPosts) 


  useEffect(() => {
    setIsRefreshig(isLoading)
  }, [isLoading])

  const onRefresh = async () => {
    setIsRefreshig(true)
    await refetchData()
    await refetchLatest
    setIsRefreshig(false)
  }

  const onSearch = useCallback<(a: string) => void>((text: string): void => {
    setSearchValue(text)
  }, [])
  

  const renderItem: ListRenderItem<IPost> = ({ item }) => <VideoCard video={item} />;


  const renderListHeader = () => (
    <View className='my-6 px-4 space-y-6'>
      <View className='justify-between items-start flex-row mb-6' >
        <View>
          <Text 
            className='font-pmedium text-sm text-gray-100' 
          >Welcome Back</Text>
          <Text 
            className='text-2xl font-psemibold text-white'
          >React Native App</Text>
        </View>
        <Image 
          source={images.logoSmall}
          resizeMode='contain'
          className='w-12 h-12'
        />
      </View>
      <SearchPanel
        placeholder='Search a video'
        value={searcValue}
        handleChangeText={onSearch}
      />

      <View className='w-full flex-1 pt-5 pb-8'>
          <Text className='text-gray-100 text-lg font-pregular'>Latest Videos</Text>
          <Trending 
            posts={latesPosts} 
            isLoading={isLatestLoading}
            error={latestError}
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
        subtitle='There are no created videous yet'
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

export default Home