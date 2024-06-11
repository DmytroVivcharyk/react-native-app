import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import { IPost } from '../types/postsInterface'
import { icons } from '../constants'

interface IVideoCard {
    video: IPost,
} 

const VideoCard: React.FC<IVideoCard> = ({video: {thumbnail, title, video,  
    creator: {avatar, username}}}): React.ReactElement => {
    
    const [play, setPlay] = useState<boolean>(false)

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && !status.isBuffering && (status as any).didJustFinish) {
            setPlay(false);
        }
    }

  return (
    <View className='flex-col items-center px-4 mb-14 w-full'>
      <View className='flex-row items-start gap-3 '>
        <View className='justify-center items-start flex-row flex-1'>
            <View 
                className='w-[46px] h-[46px] rounded-lg border
                border-secondary justify-center items-center p-0.5
            '>
                <Image 
                    resizeMode='contain'
                    source={{uri: avatar}}
                    className='w-full h-full rounded-lg'
                />
            </View>
            <View className='flex-1 justify-center ml-3 gap-y-1'>
                <Text 
                    className='text-sm text-white font-psemibold'
                    numberOfLines={1}
                >{title}</Text>
                <Text
                    className='text-xs text-gray-100 font-pregular'
                    numberOfLines={1}
                >{username}</Text>
            </View>
        </View>
        <View className='pt-2'>
            <Image 
                className='w-6 h-6 mr-1'
                resizeMode='contain'
                source={icons.menu}
            />
        </View>
      </View>

      { play ? 
            <Video 
                source={{uri: video}}
                className={`w-full h-60 rounded-чд mt-3 bg-white/10 `}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay={play}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
        : (
            <TouchableOpacity
                className='w-full h-60 rounded-xl mt-3
                relative justify-center items-center'
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
            >
                <Image 
                 source={{uri: thumbnail}}
                 className='h-full w-full rounded-xl mt-3'
                 resizeMode='contain'
                />
                <Image 
                 source={icons.play}
                 className='w-12 h-12 absolute'
                 resizeMode='contain'
                />
            </TouchableOpacity>
        )
      }
    </View>
  )
}

export default VideoCard