import { View, Text, Image, ImageSourcePropType, ImageStyle } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'

interface ITabIcon {
  icon: ImageSourcePropType,
  color: string,
  name: string,
  focused: boolean
}

const TabIcon: React.FC<ITabIcon>  = ({icon, color, name, focused}): React.ReactElement =>  {
  return (
    <View className='justify-center items-center gap-1'>
      <Image 
        source={icon}
        resizeMode='contain'
        style={{ tintColor: color } as ImageStyle}
        className='w-6 h-6'
      />
      <Text
        style={{color: color}}
        className={`${focused ? 'font-pbold' : 'font-pregular'} text-xs`}
      >{name}</Text>
    </View>
  )
}

const TabsLayout: React.FC = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 75
          }
        }}
      >
        <Tabs.Screen 
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name='Home'
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name='bookmark'
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.bookmark}
                color={color}
                name='Bookmark'
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name='create'
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.plus}
                color={color}
                name='Create'
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.profile}
                color={color}
                name='Profile'
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout