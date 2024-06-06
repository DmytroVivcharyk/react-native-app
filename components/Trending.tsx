import { View, Text, FlatList, ListRenderItem } from 'react-native'
import React from 'react'

interface IPost {
 id: number | string 
}

interface ITrending {
    posts: IPost[] | null | undefined
}

const Trending: React.FC<ITrending> = ({ posts }) => {

  const renderPost: ListRenderItem<IPost> = ({item}) => (
    <Text className='text-lg text-white mr-6'>Trending: {item.id}</Text>
  )

  return (
    <FlatList 
        data={posts ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        horizontal
    />
  )
}

export default Trending