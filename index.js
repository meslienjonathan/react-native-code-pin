import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, View, 
  TouchableOpacity, 
  Image,
  Animated,
  Vibration,
  Easing
} from 'react-native';

import PropTypes from 'prop-types';

const COLOR = ['#EB5088', '#72C1FA', '#F5D679', '#76ECC9', '#5468F3', 'red']
const ButtonSize = 75
const WIDTH  = (((13 * 2) + ButtonSize ) * 3);
export default class CodePin extends Component {

  static propTypes = {
    ForgetText: PropTypes.string,
    ForgetMethod: PropTypes.func,
    TextColor: PropTypes.string,
    BorderColor: PropTypes.string,
    PinColor: PropTypes.string,
    BorderRadius: PropTypes.number,
    Keyboard: PropTypes.arrayOf(PropTypes.number),
    Size: PropTypes.number.isRequired,
    Random: PropTypes.bool,
    FontSize: PropTypes.number,
    CodeColor: PropTypes.arrayOf(PropTypes.string),
    KeyboardColor: PropTypes.string,
    Code: PropTypes.string.isRequired,
    ImageSize: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number
    }),
    ImageLocation: PropTypes.any,
  }

  static defaultProps = {
    ForgetText: 'forget',
    ForgetMethod: () => (console.log('forget')),
    TextColor: '#5262F3',
    BorderColor: 'rgba(0,0,0,0.1)',
    PinColor: 'rgba(0,0,0,0.1)',
    BorderRadius: ButtonSize / 2,
    Keyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    Size: 4,
    Random: false,
    FontSize: 30,
    CodeColor: COLOR,
    ImageSize: {height: 15, width:20},
    ImageLocation: require('./assets/icons/backspace-arrow.png')
  }
  
  constructor(props) {
    super(props)
      this.state = {
        AnimatedVibration: new Animated.Value(0)
      }
      this.index = 0
      this.code = []
      this.Animation = []
      this.interpolate = []
  }

  renderPrivateCode = (Size) => {
    let arrayCode = [];
    for(let i = 0; i < Size; i++) 
      arrayCode.push(<View  style={[styles.CercleStyle,{backgroundColor:this.props.PinColor}]} key={i}/>)
    return arrayCode
  }

  returnInterpolate = (Size) => {
    for(let i = 0; i < Size; i++){
        const {Start, Stop} = this.CalculPosition(i);
        const opacity = this.Animation[i].interpolate({
          inputRange:  [Start, (Start + 1), Stop],
          outputRange: [0, 1, 1],
        })
        const half = (Start >= 0) ? Start + ((Stop - Start) / 2)  :  Start * 0.5;
        const lader = (55 - (5 * (Size - 2)))
        const width = this.Animation[i].interpolate({
          inputRange:  [Start, half, Stop],
          outputRange: [17, lader, 17],
        })
        this.interpolate.push({width, opacity})
    } 
  }

  renderPrivateCodeAnimation = (Size) => {
    let zIndex = Size
    let arrayCode = [];
    for(let i = 0; i < Size; i++)    
      arrayCode.push(<Animated.View key={i} style={[styles.CercleColor,{backgroundColor:this.props.CodeColor[i], opacity: this.interpolate[i].opacity, zIndex: zIndex-- ,width: this.interpolate[i].width, left: this.Animation[i]}]}/>)
    return arrayCode
  }

  shuffle = (array) => {
    let ctr = array.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = array[ctr];
        array[ctr] = array[index];
        array[index] = temp;
    }
    return array;
  }
  
  InitAnimation = (Size) => {
    for(let i = 0; i < Size; i++)
      this.InitValue(this.CalculPosition(i).Start)
  }

  InitValue = (value) => {
    this.Animation.push(new Animated.Value(value))
  }

  CalculPosition = (index) => {
    const espace  = ((WIDTH  - (ButtonSize / 1.5) * 2) - 17) / (this.props.Size - 1)
    if(index === 0) 
      return {Start: -230, Stop: 0}
    return {Start:((espace * (index - 1))) , Stop:((espace * index))} 
  }

  randomKeyboard = (keyboard, random) => {  
    if(random){
      keyboard = this.shuffle(keyboard)
      const tmp = keyboard.shift()
      keyboard.push(this.props.ForgetText, tmp, 'delete')
      return keyboard
    }
    const tmp = keyboard[9]
    keyboard[9] = this.props.ForgetText
    keyboard.push(tmp, 'delete')
    return keyboard
  }
 
  renderTouchable = (Keyboard, props, index) => {
    if(Keyboard  == props.ForgetText) {
      return (  
          <View style={[
            styles.ToucheStyle,
            {height:ButtonSize,
             width:ButtonSize, 
             backgroundColor: props.KeyboardColor,
             borderRadius: props.BorderRadius}]} key={index}>
            <TouchableOpacity onPress={props.ForgetMethod}>
              <Text style={{color:props.TextColor, fontSize:22}}>{Keyboard}</Text>
            </TouchableOpacity>
          </View>
      )
    } else if(Keyboard == 'delete') {
      return (
        <TouchableOpacity key={index} onPress={() => { this.code.pop(); this.rendAnimate() }}>
          <View style={
              [styles.ToucheStyle, 
              {height:ButtonSize, 
              width:ButtonSize, 
              borderRadius:props.BorderRadius,
              borderWidth: 1,
              borderColor:props.BorderColor,
              backgroundColor: props.KeyboardColor
            }]}>
            <Image style={[{...props.ImageSize}]} source={props.ImageLocation}/>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity key={index} onPress={() => {this.eventCode(Keyboard)}}>
          <View style={
              [styles.ToucheStyle, 
              {height:ButtonSize, 
              width:ButtonSize, 
              borderRadius:props.BorderRadius,
              borderWidth: 1, 
              borderColor:props.BorderColor,
              backgroundColor: props.KeyboardColor
            }]}>
            <Text style={[{color:props.TextColor, fontSize:props.FontSize}]}>{Keyboard}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  AnimatedVibration = () => {
   setTimeout(() => {
    Vibration.vibrate(1000)
    Animated.sequence([
      Animated.timing(this.state.AnimatedVibration, {
        toValue: 25,
        easing: Easing.bounce,
        duration: 50
      }),
      Animated.timing(this.state.AnimatedVibration, {
        toValue: -25,
        easing: Easing.bounce,
        duration: 50
      }),
      Animated.timing(this.state.AnimatedVibration, {
        toValue: 25,
        easing: Easing.bounce,
        duration: 50
      }),
      Animated.timing(this.state.AnimatedVibration, {
        toValue: -25,
        easing: Easing.bounce,
        duration: 50
      }),
      Animated.timing(this.state.AnimatedVibration, {
        toValue: 0,
        easing: Easing.bounce,
        duration: 50
      })
    ]).start()
   }, 350)
  } 

  CodeSuccess = () => {
    if(this.code.join('') === this.props.Code)
      return true
    this.AnimatedVibration()
    return false
  }

  eventCode = (e) => {
    if(this.code.length < this.props.Size)
      this.code.push(e);
      this.rendAnimateFalse()
    if(this.code.length == this.props.Size)
      this.props.eventCode(this.code, this.CodeSuccess());

  }

  rendAnimate = () => {
     if(this.index >= 1) {
      Animated.timing(this.Animation[this.index -1], {
        toValue: this.CalculPosition(this.index -1).Start,
        duration: 350
      }).start()
      this.index--
     }
  }

  rendAnimateFalse = () => {
   if(this.index < this.props.Size){
    Animated.timing(this.Animation[this.index], {
      toValue: this.CalculPosition(this.index).Stop,
      duration: 350
    }).start()
    this.index++
   }
  }

  componentWillMount() {
    this.InitAnimation(this.props.Size)
    this.returnInterpolate(this.props.Size)
  }

  render() {
    const {Random, Keyboard, Size} = this.props
    const PADDING = (ButtonSize / 1.5);

    return (
        <Animated.View style={[{marginLeft: this.state.AnimatedVibration}]}>
          <View style={[styles.CodeStyle, {marginHorizontal: PADDING}]}>
              {this.renderPrivateCodeAnimation(Size)}
              {this.renderPrivateCode(Size)}
          </View>
          <View style={[styles.KeyboardStyle]}>
            <View style={[styles.container, {width: WIDTH}]}>
              {this.randomKeyboard(Keyboard, Random).map((keyboard, index) => (this.renderTouchable(keyboard, this.props, index)))}
            </View>
          </View>
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ToucheStyle: {
    alignItems:'center', 
    justifyContent: 'center',
    marginHorizontal: 13,
    marginVertical: 8,
  }, 
  KeyboardStyle:{
    paddingTop: 50,
    alignItems: 'center',
  },
  CodeStyle : {
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    justifyContent:'space-between',
  },
  CercleStyle: {
    height: 17, 
    width: 17, 
    borderRadius: 17 / 2
  },
  CercleColor: {
    borderRadius: 17 / 2, 
    position:'absolute', 
    bottom: 0, 
    height: 17,
  }
});
