import React from 'react';
import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useFavorites } from '../hooks/useGlobalState';

const Item = ({ item, navigation }: { item: any, navigation: any }) => {
  const { percentChange, symbol, price, id } = item
  const formattedPercentChange = percentChange > 0 ? `+${percentChange?.toFixed(2)}` : percentChange?.toFixed(2)
  return (
    <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Asset', { id, symbol, percentChange, price })}>
      <View style={styles.logoContainer}>
        <Image borderRadius={10} source={{ uri: `https://messari.io/asset-images/${id}/32.png` }} style={styles.logo} />
        <View style={styles.coinInfo}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text>${price}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Text style={{ color: percentChange > 0 ? 'green' : 'red' }}>{formattedPercentChange}%</Text>
      </View>
    </Pressable>
  )
};

export default function FavoriteScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const { favorites } = useFavorites()

  const renderItem = ({ item, navigation }: any) => {
    return (
      <Item item={item} navigation={navigation} />
    )
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        scrollEnabled
        renderItem={({ item }) => renderItem({ item, navigation })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  logo: {
    width: 30,
    height: 30
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  coinInfo: {
    marginLeft: 10
  },
  symbol: {
    fontSize: 20
  },
  loadingText: {
    textAlign: 'center'
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
