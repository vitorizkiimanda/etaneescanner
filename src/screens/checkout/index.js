import React from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    Picker,
    Alert,
    ActivityIndicator
} from "react-native";
import {
    Button,
    Text,
    Container,
    Card,
    CardItem,
    Body,
    Content,
    Header,
    Title,
    Left,
    Icon,
    Right,
    Footer,
    Input
} from "native-base";
import {
    Col,
    Row,
    Grid
} from 'react-native-easy-grid';
import HorizontalItemList from '../../theme/components/HorizontalItemList';
import ItemBanner from '../../theme/components/ItemBanner';
import Provider from '../../provider/setup.js'
import styles from './styles';

var resep = require('../../../assets/image/resep.png');
var axios = require('../../api/axios.js');

class CheckOut extends React.Component {
    constructor(props) {
        provider = new Provider()
        super(props)
        this.state = {
            barang: [],
            isReady: false,
            checkOut: [],
            jumlah: 0,
            sum: 0,
            panjang: 0,
            habis: false,
            total: 0,
            image: 'https://yourganic.codepanda.web.id/',
            loading: false,
            token: null
        }
        this.fetchData()
        this.retrieveToken()
    }

    async retrieveItem() {
        const items = []
        var total = 0
        var j = 0
        for (var i = 0; i < 99; i++) {
            try {
                const retrievedItem = await AsyncStorage.getItem('Barang' + i);
                if (retrievedItem != null) {
                    items[j] = JSON.parse(retrievedItem)
                    total = total + (parseInt(items[j].price) * parseInt(items[j].jumlah))
                    j = j + 1
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        this.setState({ total: total })
        return items
    }

    fetchData() {
        this.retrieveItem().then((parsed) => {
            //this callback is executed when your Promise is resolved
            this.setState({
                barang: parsed,
                isReady: true,
                panjang: parsed.length
            })
        }).catch((error) => {
            console.log('Terjadi kesalahan : ' + error);
        });
    }

    async storeItem(key, item) {
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    remove(index) {
        try {
            var jsonOfItem = AsyncStorage.removeItem('Barang' + index)
            this.fetchData()
            return jsonOfItem

        } catch (error) {
            console.log(error.message)
        }
        this.setState({ barang });
    }



    jumlah({ jumlah, index }) {
        let { barang } = this.state;
        let targetPost = barang[index]

        // Flip the 'liked' property of the targetPost
        targetPost.jumlah = jumlah

        // Then update targetPost in 'posts'
        // You probably don't need the following line.
        barang[index] = targetPost

        // Then reset the 'state.posts' property
        this.setState({ barang })
        this.fetchData()
        // console.error(this.state.barang[index])
        // this.storeItem('Barang' + this.state.barang[index].id, this.state.barang[index])
        provider.storeItem('Barang'+this.state.barang[index].id, this.state.barang[index])
    }

    async retrieveToken() {
        // const tokens = await AsyncStorage.getItem('access-token');
        // if (tokens) {
        //     this.setState({
        //         token: JSON.parse(tokens)
        //     })
        // }

        provider.getToken().then((value)=>{
            // console.error(value)
            if(value){
                this.setState({
                    token: JSON.parse(value)
                })
            }
        }).catch((error) => {
            console.log('Terjadi kesalahan : ' + error);
        });
    }

    checkOut() {
        this.setState({ loading: true })
        const checkOuts = []
        var hasil = null

        if (this.state.barang.length != 0) {
            for (var i = 0; i < this.state.barang.length; i++) {
                if (this.state.barang[i].jumlah <= this.state.barang[i].stock) {
                    let checkOut = {
                        item_id: this.state.barang[i].id,
                        qty: this.state.barang[i].jumlah,
                        msg: "Testing kuy"
                    }
                    checkOuts.push(checkOut)
                    habis = true
                }
                else {
                    alert("Barang " + this.state.barang[i].name + " tidak mencukupi")
                    var habis = false
                    this.setState({
                        loading : false
                    })
                    break
                }
            }
            if (habis) {
                axios.post('/api/transaction/create', checkOuts, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.token
                    },
                }).then(response => {
                    if (response.data) {
                        // console.error(response.data)
                        // this.storeItem('user-profile',response.data.data)
                        // alert("Update Berhasil")
                        // this.props.navigation.pop()
                        // console.error(response.data)
                        // console.error(response.data.data[0].code)
                        for (var i = 0; i < 15; i++) {
                            AsyncStorage.removeItem('Barang' + i)
                        }
                        this.props.navigation.push("KonfirmasiPembayaran", response.data.data[0])
                    }
                    else {
                        alert("Pembelian Gagal Periksa Koneksi anda")
                        this.setState({ loading: false })
                    }
                }).catch(error => {
                    alert("Login Gagal, periksa email dan password anda")
                    this.setState({ loading: false })
                    console.error(error)
                });
            }
        }
        else {
            alert("Cart Kosong, silahkan beli barang terlebih dahulu")
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
                <View>
                    <Header style={styles.header} noShadow>
                        <StatusBar
                            backgroundColor="#004600"
                            barStyle="light-content"
                        />
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Shopping Cart</Title>
                        </Body>
                    </Header>
                </View>
                <Content style={styles.content}>
                    <Card style={{ padding: 0, margin: 0 }}>
                        <Text style={styles.shoppingBag}>
                            YOUR SHOPPING BAG
                        </Text>
                        <Text style={styles.reviews}>
                            Review {this.state.panjang} items Rp{this.state.total}
                        </Text>
                        <FlatList
                            data={this.state.barang}
                            renderItem={({ item, index }) => (
                                <CardItem transparent>
                                    <Image style={styles.itemCardImage}
                                        source={{ uri: this.state.image + item.img }}
                                    />
                                    <View style={{ flexDirection: 'column', }}>
                                        <Text style={styles.itemCardTitle}>{item.name}</Text>
                                        <Text style={styles.itemCardPrice}>Rp {item.price}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', marginLeft: 280 }}>
                                        <Input
                                            style={{ flex: 0.5, margin: 7, paddingBottom: 3, borderBottomWidth: 0.7 }}
                                            keyboardType={"numeric"}
                                            maxLength={1}
                                            onChangeText={(jumlah) => this.jumlah({ jumlah, index })}>
                                            {item.jumlah}
                                        </Input>
                                        <TouchableOpacity onPress={() => this.remove(item.id)}>
                                            <Icon name='close' style={{ flex: 0.5, textAlignVertical: 'center' }} />
                                        </TouchableOpacity>
                                        {/* <Picker
                                            selectedValue={this.state.sum}
                                            style={{ height: 20, width: 73, marginLeft: 140, paddingLeft: 20}}
                                            onValueChange={(itemValue, itemIndex) => this.setState({jumlah : itemValue})}
                                            >
                                            <Picker.Item label="0" value="0"  />
                                            <Picker.Item label="1" value="1" />
                                            <Picker.Item label="2" value="2" />
                                            <Picker.Item label="3" value="3" />
                                            <Picker.Item label="4" value="4" />
                                            <Picker.Item label="5" value="5" />
                                            <Picker.Item label="6" value="6" />
                                        </Picker> */}
                                        {/* <Text style={{marginLeft: 340}}>{item.jumlah}</Text> */}
                                    </View>
                                </CardItem>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={styles.hairStyles} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.shipping} >Shipping</Text>
                            <Text style={styles.priceShipping} >FREE</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.shipping} >SubTotal</Text>
                            <Text style={styles.priceShipping} >Rp{this.state.total}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.shipping} >Total</Text>
                            <Text style={styles.priceTotal} >Rp{this.state.total}</Text>
                        </View>
                        <View style={styles.hairStyles} />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('Home')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="arrow-dropleft" style={{ marginLeft: 10, fontSize: 24, marginTop: 10, color: '#636568' }} />
                                    <Text style={{ marginLeft: 10, marginTop: 10, color: '#636568' }}>Continue Shipping</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <Button onPress={() => this.props.navigation.push('KonfirmasiPembayaran')} transparent style={{borderRadius:80, borderColor:'white', borderWidth:2,  marginLeft: 80, marginBottom: 10, backgroundColor: '#007300'}}>
                                <Text style={{ color: 'white'}}>CHECKOUT</Text> 
                            </Button> */}
                            <Button onPress={() => this.checkOut()} transparent style={{ borderRadius: 80, borderColor: 'white', borderWidth: 2, marginLeft: 80, marginBottom: 10, backgroundColor: '#007300' }}>
                                <Text style={{ color: 'white' }}>CHECKOUT</Text>
                            </Button>
                        </View>
                        {this.state.loading ?
                            <View style={{ paddingTop: 250, alignSelf: 'center', justifyContent: 'center', position: 'absolute' }}>
                                <ActivityIndicator size="large" />
                            </View>
                            :
                            <View />
                        }
                    </Card>
                </Content>
            </Container>
        );
    }
}

export default CheckOut;