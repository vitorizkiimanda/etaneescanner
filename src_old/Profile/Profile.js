import React from "react";
import { DrawerNavigator } from "react-navigation";
import SignIn from '../SignIn';
import Register from '../Register';
import LogoTitle from '../LogoTitle';
import Mains from '../Mains';
import SideMenus from '../SideMenus'
import SideBar from "../SideBar/SideBar.js";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  AsyncStorage,
  TouchableOpacity
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
  Right
} from "native-base";
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker'

var options = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Take a Photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  quality: 1
};

var gambar = null

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    var data = this.fetchProfile()
    //    console.error(data)
  }
  state = {
    nama: '',
    email: '',
    hp: '',
    alamat: '',
    foto: 'a',
    icon: true,
    imageSource: null
  }

  async fetchProfile() {
    try {
      const value = await AsyncStorage.getItem('profile');
      let parsed = JSON.parse(value)
      if (value !== null) {
        // We have data!!
        this.setState({
          nama: parsed.data.nama,
          email: parsed.data.email,
          hp: parsed.data.hp,
          alamat: parsed.data.alamat,
          foto: 'http://azizpc.codepanda.web.id/' + parsed.data.foto
        })
        if (this.foto !== 'a') {
          this.setState({ icon: false })
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  async logOut() {
    // this.props.navigation.goBack({data:1})
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
      key: null
    }));
    await AsyncStorage.clear()
  }

  editProfile() {
    this.props.navigation.navigate('editProfile')
  }
  selectPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri }
        this.setState({imageSource: source})
          // console.error(gambar.uri)
      }
    })
  }

  render() {
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header style={styles.headerStyle} androidStatusBarColor='#004600'>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
        <View style={{ flex: 1 }}>
          <Content>
            <TouchableOpacity onPress={this.selectPhoto.bind(this)}>
              <Image
                square
                style={{
                  height: 120,
                  width: 110,
                  alignSelf: "center",
                  top: 20,
                  borderRadius: 100
                }}
                source={this.state.imageSource !== null ? this.state.imageSource :{uri:this.state.foto}} />
            </TouchableOpacity>
            {/* <Icon active={this.state.icon} name="person" style={styles.photoProfile} /> */}
            <Text style={styles.nama}>{this.state.nama}</Text>
            <View style={styles.hairStyle} />
            <View style={styles.row}>
              <Icon name="mail" style={styles.emailIcon} />
              <View > 
                <Text style={styles.email}>Email</Text>
                <Text style={styles.emails}>{this.state.email}</Text>
              </View>
            </View>
            <View style={styles.hairStyles} />
            <View style={styles.row}>
              <Icon name="ios-call" style={styles.phoneIcon} />
              <View >
                <Text style={styles.email}>Nomor Telepon</Text>
                <Text style={styles.emails}>{this.state.hp}</Text>
              </View>
            </View>
            <View style={styles.hairStyles} />
            <View style={styles.row}>
              <Icon name="bookmark" style={styles.addressIcon} />
              <View >
                <Text style={styles.email}>Alamat</Text>
                <Text style={styles.emails}>{this.state.alamat}</Text>
              </View>
            </View>
            <View style={styles.hairStyles} />
            <Button
              onPress={() => this.editProfile()}
              block={true}
              style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Update Profile</Text>
            </Button>
            <Button
              onPress={() => this.logOut()}
              block={true}
              style={styles.logoutbuttonStyle}>
              <Text style={styles.logoutbuttonTextStyle}>Log Out</Text>
            </Button>
          </Content>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#007300',
    height: 50,
    paddingTop: Platform.OS === "android" ? 2 : 0,
    // paddingTop: 18,
    // marginTop: Platform.OS === "android" ? 18 : 0,
    // backgroundColor: 'gray',
  },
  carding: {
    margin: 20,
    marginLeft: 10,
    width: 360
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 25,
    color: 'white',
    // alignItems: 'center',
    alignSelf: 'center'
  },
  buttonStyle: {
    margin: 10,
    borderRadius: 10,
  },
  logoutbuttonStyle: {
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'red',
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonTextStyle: {
    color: 'white'
  },
  logoutbuttonTextStyle: {
    color: 'red'
  },
  cardImage: {
    width: 360,
    height: 135,
    padding: 0,
    margin: 0,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logo: {
    // flex: 1,
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 50,
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  labelStyle: {
    color: 'white',
  },
  inputTextStyle: {
    color: 'white'
  },

  photoProfile: {
    fontSize: 100,
    alignSelf: 'center',
    paddingTop: 30,
  },

  emailIcon: {
    fontSize: 50,
    alignSelf: 'flex-start',
    paddingLeft: 20,
    paddingTop: 5
  },

  phoneIcon: {
    fontSize: 50,
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginRight: 10,
    paddingTop: 5
  },
  addressIcon: {
    fontSize: 50,
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginRight: 18,
    paddingTop: 5
  },
  nama: {
    fontSize: 28,
    alignSelf: 'center',
    paddingTop: 20,
  },
  hairStyle: {
    backgroundColor: '#A2A2A2',
    height: 1,
    width: 340,
    marginTop: 10,
    margin: 20,
    marginBottom: 10
  },
  hairStyles: {
    backgroundColor: '#A2A2A2',
    height: 1,
    width: 260,
    marginTop: 10,
    margin: 100,
    marginBottom: 10
  },
  email: {
    fontSize: 20,
    paddingLeft: 40,
    paddingTop: 2,
  },
  emails: {
    fontSize: 18,
    paddingLeft: 40,
    color: '#A2A2A2',
    paddingTop: 5,
  },
  row: {
    flexDirection: 'row',
  }

});