import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    this.setState({
      refreshing: true
    })
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/users');
      const arrCustom = res && res.data;
      this.setState({
        refreshing: false,
        data: arrCustom.map(e => {
          return {
            ...e,
            seleted: false,

          }
        })
      })
      console.log("res:", res)
    } catch (error) {
      this.setState({
        refreshing: false
      })
      console.log('error:', error);
    }
  }

  index = null
  onClick = (item, index) => {
    const { data } = this.state;
    this.index = index;
    const newArrData = data.map((e, i) => {
      if (item.id == e.id) {
        return {
          ...e,
          seleted: true
        }
      } else {
        return {
          ...e,
          seleted: false
        }
      }
    })
    this.setState({
      data: newArrData
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onClick(item, index)}
        style={{
          backgroundColor: item.seleted ? 'orange' : 'white',
          borderWidth: 1, marginLeft: 10, padding: 8, borderRadius: 10
        }}>
        <Image source={require('./img_acc.png')} style={{ width: 100, height: 100 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'red' }}>{item.username}</Text>
          <Text style={{ color: 'blue' }}>{item.email}</Text>
          <Text style={{ color: 'green' }}>{item.address.street + " , " + item.address.city}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  onRefresh = () => {
    this.getUser();
  }

  onClickButton = () => {
    // scroll to index 
    // done
    this.flatList.scrollToIndex({ animated: true, index: this.index });

  }

  getItemLayout = (data, index) => {
    return {
      length: 200, offset: 200 * index, index
    }
  }

  render() {
    const { data, refreshing } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
        }>
          <View style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Demo horizontal flast list</Text>
          </View>
          <FlatList
            getItemLayout={this.getItemLayout}
            extraData={data}
            ref={(ref) => { this.flatList = ref; }}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
            horizontal
            data={data}
            keyExtractor={item => `key-${item.id}`}
            renderItem={this.renderItem}
          />

          <TouchableOpacity
            onPress={this.onClickButton}
            style={{ width: 200, height: 30, backgroundColor: 'grey', marginTop: 100 }}>
            <Text style={{ color: 'white' }}>Scroll To item seleted</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
