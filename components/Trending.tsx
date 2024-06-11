import {FlatList, ListRenderItem, RefreshControl, ViewToken  } from 'react-native'
import React, {useState, useCallback, useRef,} from 'react'
import { Video } from 'expo-av'

import TrendingItem from './TrendingItem'
import { IPost } from '../types/postsInterface'


interface ITrending {
    posts: IPost[] | null
    isLoading: boolean,
    error: Error | null
}

const Trending: React.FC<ITrending> = ({ posts, isLoading }) => {
  const [activeItem, setActiveItem] = useState<IPost | null >(posts ? posts[0] : null)
  
  const renderPost: ListRenderItem<IPost> = ({item}) => (
    <TrendingItem activeItem={activeItem} item={item} />
  )

  const viewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const viewableItem = viewableItems[0].item as IPost;
      setActiveItem(viewableItem);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  }

  return (
    <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
        horizontal
        refreshControl={<RefreshControl 
          refreshing={isLoading}
          onRefresh={() => {}}
        />}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentOffset={{ x: 170, y: 0 }}
    />
  )
}

export default Trending