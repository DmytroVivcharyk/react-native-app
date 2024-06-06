import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, Image, FlatList, ListRenderItem, RefreshControl} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import{ images } from '../../constants'
import SearchPanel from '../../components/SearchPanel'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { fetchAllPosts } from '../../lib/appwrite'
import { IPost } from '@/types/postsInterface'
import { useAppwrite } from '../../hooks/useAppwrite'

const dataTempo: IPost[] = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5},]

const Home: React.FC = () => {
  const [searcValue, setSearchValue] = useState<string>('')
  const  [isRefreshing, setIsRefreshig] = useState<boolean>(false)
  const [data, setData] = useState<IPost[]>(dataTempo)
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [errer, setError] = useState(null)

  useEffect(() => {
    // setIsLoading(true)
    // fetchAllPosts()
    //   .then(res => {
    //     setData(res)
    //   })
    //   .catch(error => console.log(error))
    //   .finally(() => setIsLoading(false))
  }, [])

  const { data: posts, error, isLoading } = useAppwrite<IPost[], []>(fetchAllPosts, [])

  const onRefresh = async () => {
    setIsRefreshig(true)
    setTimeout(() => {
      setIsRefreshig(false)
    }, 2000)
  }

  const onSearch = useCallback<(a: string) => void>((text: string): void => {
    setSearchValue(text)
  }, [])
  

  const renderItem: ListRenderItem<IPost> = ({ item }) => (
    <Text className='text-3xl text-secondary'>Home: {item.id}</Text>
  );

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
          <Trending posts={data}/>
      </View>
    </View>
  )

  return (
    <SafeAreaView className='bg-primary min-h-[100vh]'>
      <FlatList 
        data={data}
        keyExtractor={((item: IPost) => item.id.toString())}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={<EmptyState 
          title='No Videous Found'
          subtitle='There are no created videous yet'
          />}
        refreshControl={<RefreshControl 
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />}
      />
    </SafeAreaView>
  )
}

export default Home