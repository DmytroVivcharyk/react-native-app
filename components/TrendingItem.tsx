import { 
    Image, 
    TextStyle, 
    ViewStyle, 
    ImageStyle, 
    TouchableOpacity, 
    ImageBackground,
  } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'

import { icons } from '../constants'
import { IPost } from '../types/postsInterface'

interface ITrendingItemProps {
    activeItem: IPost | null;
    item: IPost;
}
  
interface ITrendingItemState {
    play: boolean;
    videoRef: React.RefObject<Video>
}

const zoomIn: Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle> = {
    0: { scaleX: 0.9, scaleY: 0.9 },
    1: { scaleX: 1.1, scaleY: 1.1 }
};
  
const zoomOut: Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle> = {
    0: { scaleX: 1.1, scaleY: 1.1 },
    1: { scaleX: 0.9, scaleY: 0.9 }
};
  
Animatable.initializeRegistryWithDefinitions({
    zoomIn,
    zoomOut
})

export default class TrendingItem extends React. Component<ITrendingItemProps, ITrendingItemState>{

    constructor(props: ITrendingItemProps) {
        super(props);
        this.state = {
          play: false,
          videoRef: React.createRef()
        };
      }

      
    handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && !status.isBuffering && (status as any).didJustFinish) {
          this.setState({ play: false });
        }
      };


    render(): React.ReactNode {
        const {activeItem, item} = this.props

        if(activeItem === null || activeItem.length === 0) return null
        return (
            <Animatable.View
                className='mr-5'
                animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
                duration={500}
            >
                { this.state.play ? 
                <Video 
                    // ref={(ref: React.RefObject<Video>) => this.setState({videoRef: ref})}
                    source={{uri: item.video}}
                    className={`w-52 h-72 rounded-[35px] mt-3 bg-white/10 `}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay={this.state.play}
                    onPlaybackStatusUpdate={this.handlePlaybackStatusUpdate}
                />
                : (
                    <TouchableOpacity
                    className='relative justify-center items-center'
                    activeOpacity={0.7}
                    onPress={() => {this.setState({ play: true })}}
                    >
                    <ImageBackground 
                    source={{uri: item.thumbnail}}
                    className='w-52 h-72 overflow-hidden shadow-lg rounded-[35px] my-5 shadow-black/40'
                    resizeMode='cover'
                    />
                    <Image 
                        source={icons.play}
                        className='w-12 h-12 absolute'
                        resizeMode='contain'
                    />
                    </TouchableOpacity>
                )
                }
            </Animatable.View>
        )
    }
}
