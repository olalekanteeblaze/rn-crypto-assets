import axios from 'axios';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

const Item = ({ item, navigation }: { item: any, navigation: any }) => {
  const percentChange = item?.metrics?.market_data?.percent_change_usd_last_24_hours
  const formattedPercentChange = percentChange > 0 ? `+${percentChange?.toFixed(2)}` : percentChange?.toFixed(2)
  const price = item?.metrics?.market_data?.price_usd.toFixed(2)
  return (
    <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Asset', { id: item.id, symbol: item.symbol, percentChange, price })}>
      <View style={styles.logoContainer}>
        <Image borderRadius={10} source={{ uri: `https://messari.io/asset-images/${item.id}/32.png` }} style={styles.logo} />
        <View style={styles.coinInfo}>
          <Text style={styles.symbol}>{item?.symbol}</Text>
          <Text>${price}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Text style={{ color: percentChange > 0 ? 'green' : 'red' }}>{formattedPercentChange}%</Text>
      </View>
    </Pressable>
  )
};

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const {
    data,
    isFetchingNextPage,
    fetchNextPage: _fetchNextPage,
  } = useInfiniteQuery(
    'assets',
    async ({ pageParam = 1 }) => {
      const res = await axios.get(`https://data.messari.io/api/v1/assets?with-profiles&page=${pageParam}`)
      return res.data
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length ? currentPage + 1 : undefined
      },
    }
  )
  const renderItem = ({ item, navigation }: any) => {
    return (
      <Item item={item} navigation={navigation} />
    )
  };

  const handleRefresh = async () => {
    setRefreshing(true)
    await queryClient.refetchQueries(['assets'])
    setRefreshing(false)
  }

  const fetchNextPage = () => {
    setCurrentPage(() => currentPage + 1)
    _fetchNextPage({ pageParam: currentPage + 1 })
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.pages.flatMap((data) => data.data)}
        scrollEnabled
        renderItem={({ item }) => renderItem({ item, navigation })}
        onEndReachedThreshold={0.7}
        onEndReached={fetchNextPage}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      {isFetchingNextPage ? <Text style={styles.loadingText}>Loading...</Text> : null}
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
