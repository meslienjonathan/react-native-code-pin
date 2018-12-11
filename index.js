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

const COLOR = ['#EB5088', '#72C1FA', '#F5D679', '#76ECC9', '#5468F3', 'red'];
const ButtonSize = 75;
const WIDTH  = (((13 * 2) + ButtonSize ) * 3);
const AnimHeight = 20;
export default class CodePin extends Component {

  static propTypes = {
    ForgetText: PropTypes.string,
    ForgetMethod: PropTypes.func,
    TextColor: PropTypes.string,
    BorderColor: PropTypes.string,
    PinColor: PropTypes.string,
    BorderRadius: PropTypes.number,
    Size: PropTypes.number.isRequired,
    Random: PropTypes.bool,
    FontSize: PropTypes.number,
    CodeColor: PropTypes.arrayOf(PropTypes.string),
    KeyboardColor: PropTypes.string,
    ImageSize: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number
    }),
    ImageLocation: PropTypes.any,
  };

  static defaultProps = {
    ForgetText: 'forget',
    ForgetMethod: () => (console.log('forget')),
    TextColor: '#5262F3',
    BorderColor: 'rgba(0,0,0,0.1)',
    PinColor: 'rgba(0,0,0,0.1)',
    BorderRadius: ButtonSize / 2,
    Size: 4,
    Random: false,
    FontSize: 30,
    CodeColor: COLOR,
    ImageSize: {height: 15, width:20},
    ImageLocation: require('./assets/icons/backspace-arrow.png')
  };
  
  constructor(props) {
    super(props)
      this.AnimLoading = this.AnimLoading.bind(this)
      this.Clear = this.Clear.bind(this)
      this.Loading = this.Loading.bind(this)
      this.state = {
        AnimatedVibration: new Animated.Value(0),
        Animation: [],
        Loading: true,
        clear: true
      }
      this.index = 0;
      this.twoIndex = 0
      this.code = [];
      this.interpolate = [];
      this.Animation = []
  }

  renderPrivateCode = (Size) => {
    let arrayCode = [];
    for(let i = 0; i < Size; i++) 
      arrayCode.push(<Animated.View  style={[styles.CercleStyle,{backgroundColor:this.props.PinColor, marginBottom: this.Animation[i].margin }]} key={i}/>);
    return arrayCode;
  }

  returnInterpolate = (Size) => {
    for(let i = 0; i < Size; i++){
        const {Start, Stop} = this.CalculPosition(i);
        const opacity = this.Animation[i].position.interpolate({
          inputRange:  [Start, (Start + 1), Stop],
          outputRange: [0, 1, 1],
        });
        const half = (Start >= 0) ? Start + ((Stop - Start) / 2)  :  Start * 0.5;
        const lader = (55 - (5 * (Size - 2)));
        const width = this.Animation[i].position.interpolate({
          inputRange:  [Start, half, Stop],
          outputRange: [17, lader, 17],
        });
        this.interpolate.push({width, opacity});
    } 
  }

  renderPrivateCodeAnimation = (Size) => {
    let zIndex = Size;
    let arrayCode = [];
    for(let i = 0; i < Size; i++)    
      arrayCode.push(<Animated.View key={i} style={[styles.CercleColor,{backgroundColor:this.props.CodeColor[i], marginBottom: this.Animation[i].margin, opacity: this.interpolate[i].opacity, zIndex: zIndex-- ,width: this.interpolate[i].width, left: this.Animation[i].position}]}/>)
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
      this.InitValue(this.CalculPosition(i).Start);
  }

  InitValue = (value) => {
    this.Animation.push({margin: new Animated.Value(0), position: new Animated.Value(value)})
  }

  CalculPosition = (index) => {
    const espace  = ((WIDTH  - (ButtonSize / 1.5) * 2) - 17) / (this.props.Size - 1)
    if(index === 0) 
      return {Start: -230, Stop: 0}
    return {Start:((espace * (index - 1))) , Stop:((espace * index))} 
  }

  randomKeyboard = (random) => {  
    const keyboard = [1,2,3,4,5,6,7,8,9,0]
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
  } 

  eventCode = (e) => {
    if(this.code.length < this.props.Size){
      this.code.push(e);
      this.rendAnimateFalse()
    }   
    if(this.code.length == this.props.Size){
      this.props.eventCode(this.code.join(''), this.Loading, this.Clear);
    }
  }

  rendAnimate = () => {
     if(this.index >= 1) {
      Animated.timing(this.Animation[this.index -1].position, {
        toValue: this.CalculPosition(this.index -1).Start,
        duration: 350
      }).start()
      this.index--
     }
  }

  rendAnimateFalse = () => {
   if(this.index < this.props.Size){
    Animated.timing(this.Animation[this.index].position, {
      toValue: this.CalculPosition(this.index).Stop,
      duration: 350
    }).start()
    this.index++
   }
  }

  AnimatedLoading = (index) => {
    index++
    if(index == this.props.Size)
      this.AnimLoading(0)
    else
      this.AnimLoading(index)
  } 

  Clear = () => {
   const time = setTimeout(() => {
    this.code = []
    this.AnimatedVibration()
    for(let i = 0; i < this.props.Size; i++) {
      Animated.timing(this.Animation[this.index -1].position, {
        toValue: this.CalculPosition(this.index -1).Start,
        duration: 1
      }).start()
      this.index--
    }
   }, 350)
   this.timers.push(time)
  }

  Loading = (bool = false) => {this.setState({Loading: bool}, () => this.AnimLoading())}


  AnimLoading = (index = 0) => {
    if(this.state.Loading == true){
        Animated.sequence([
          Animated.timing(this.Animation[index].margin, {
            toValue: AnimHeight,
            duration: 400
          }),
          Animated.timing(this.Animation[index].margin, {
            toValue: 0,
            duration: 400
          })
        ]).start()
      const time = setTimeout(() => {this.AnimatedLoading(index)}, 200)
      this.timers.push(time)
    }
  }

  componentWillMount() {
    this.timers = []
    this.InitAnimation(this.props.Size)
    this.returnInterpolate(this.props.Size)
  }

  componentWillUnmount() {
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });
  }

  render() {
    const {Random, Size} = this.props
    const PADDING = (ButtonSize / 1.5);
    return (
        <Animated.View style={[{marginLeft: this.state.AnimatedVibration}]}>
          <View style={[styles.CodeStyle, {marginHorizontal: PADDING}]}>
              {this.renderPrivateCodeAnimation(Size)}
              {this.renderPrivateCode(Size)}
          </View>
          <View style={[styles.KeyboardStyle]}>
            <View style={[styles.container, {width: WIDTH}]}>
              {this.randomKeyboard(Random).map((keyboard, index) => (this.renderTouchable(keyboard, this.props, index)))}
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
    height: 20
  },
  CercleStyle: {
    height: 17, 
    width: 17, 
    borderRadius: 17 / 2,
  },
  CercleColor: {
    borderRadius: 100,
    position:'absolute', 
    bottom: 0, 
    height: 17,
  }
});