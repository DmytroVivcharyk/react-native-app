import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, ListRenderItem, RefreshControl} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import{ images } from '../../constants'
import SearchPanel from '../../components/SearchPanel'
import VideoCard from '@/components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import { IPost } from '@/types/postsInterface'
import { useAppwrite } from '../../hooks/useAppwrite'

const Search: React.FC = () => {
  const  [isRefreshing, setIsRefreshig] = useState<boolean>(true)

  const { query } = useLocalSearchParams()

  const { data: posts, error, isLoading, refetchData } = useAppwrite<IPost[]>(() => searchPosts(query as string))


  useEffect(() => {
    refetchData()
  }, [query])

  useEffect(() => {
    setIsRefreshig(isLoading)
  }, [isLoading])

  const onRefresh = async () => {
    setIsRefreshig(true)
    await refetchData()
    setIsRefreshig(false)
  }  

  const renderItem: ListRenderItem<IPost> = ({ item }) => <VideoCard video={item} />;


  const renderListHeader = () => (
    <View className='my-6 px-4'>
        <View>
          <Text 
            className='font-pmedium text-sm text-gray-100' 
          >Search Results</Text>
          <Text 
            className='text-2xl font-psemibold text-white'
          >{query}</Text>
        </View>
        <Image 
          source={images.logoSmall}
          resizeMode='contain'
          className='w-12 h-12'
        />
        <View className='mb-6 mt-6'>
          <SearchPanel
            initialQuery={query as string} 
            placeholder='Search a video'
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

export default Search