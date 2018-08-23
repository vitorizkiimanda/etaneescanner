import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    cardTitle:{
        paddingTop: 7.5, 
        paddingHorizontal: 12.5, 
        fontWeight: '400', 
        color: '#004600',
    },
    cardTitleRight: {
        paddingTop: 7.5,
        paddingRight: 15,
        paddingHorizontal: 12.5,
        fontWeight: '800',
        color: '#004600',
    },
    itemCard:{
        margin: 0,
        padding: 0,
        width: 120,
        height: 160,
        borderWidth: 0,
        borderColor: 'white',
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    itemCardImage:{
        height: 115,
        width: 115,
        padding: 0,
        margin: 0,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    itemCardTitle:{
        paddingHorizontal: 5,
        color: '#007300',
        fontWeight: '100',
        fontSize: 14.5
    },
    itemCardPrice:{
        paddingHorizontal: 5,
        color: '#47a337',
        fontWeight: '100',
        fontSize: 13.5
    }
});

export default Styles;