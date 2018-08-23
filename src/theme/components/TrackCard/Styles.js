import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    cardBody:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        height :100,
        padding: 5,
        borderWidth: 0,
        borderColor: 'white',
        margin: 10,
    },
    cardImage:{
        flex: 0.2, 
        height: 80,
        alignSelf: 'center',
        resizeMode: 'contain',
        // borderWidth: 1,
        // borderColor: '#000000'
    },
    cardName:{
        flex: 0.5,        
    },
    cardNameTop: {
        fontSize: 15,
        paddingTop: 5,
    },
    cardNameBottom: {
        paddingTop: 5,
        fontSize: 12,
    },
    cardTrack: {
        paddingTop: 5,
        flex: 0.3,
    },
    cardTrackTop: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right',
        textAlignVertical: 'top'
    },
    cardTrackBottom: {
        paddingTop: 5,
        fontSize: 12,
        textAlign: 'right',
    }
});

export default Styles;