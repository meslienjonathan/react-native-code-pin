# react-native-code-pin

 ![License](https://img.shields.io/badge/license-MIT-blue.svg) ![npm Version](https://img.shields.io/npm/v/codepin.svg) ![npm Downloads](https://img.shields.io/npm/dt/codepin.svg)<br>
_This is a react-native component for a implements a code pin view in your project_<br>

_Attention: This package is under development and evolution over time_<br>
_Contributions are welcome!_<br>


<p align='center'><img src='https://image.noelshack.com/fichiers/2020/41/1/1601921081-ezgif-com-gif-maker-1.gif' alt='PinCode'><img src='https://image.noelshack.com/fichiers/2020/41/1/1601921084-ezgif-com-gif-maker.gif' alt='PinCode2'></p>


## Installation

```
npm install --save pincode
```
or
```
yarn add pincode
```

## Basic Usage

Basic usage requires Code and Size.
* _**Size**_ : requires the size of the code 

```jsx
import PinCode from 'pincode'

<PinCode Size={4} />
```

## Options

| Key | Description | Required | Default | Type |
|---|---|---|---|---|
|**`ForgetText`**|Change the text of the forget method |`false`|`forget`|`string`|
|**`ForgetMethod`**|take as a parameter a function to execute when forget is called|`false`|`() => (console.log('forget')`|`func`|
|**`Size`**|is a size of the code |`true`|`4`|`number`|
|**`Random`**|return the keyboard keys randomly|`false`|`false`|`boolean`|
|**`eventCode`**|is a function that takes in parameter the password typed by the user, a error function and a loading function|???| `(event, error, loading) => {}`|`func`|

## Example

basic use of **eventCode** prop
```jsx
...
import PinCode from 'pincode'

export default Example extends Component {
  ...
  checkCode = (event, loading, error) => {
    if(event == 'this.state.YourCode'){
      loading(true);
      setTimeout(() => {
          loading(false)
      }, 5000);
    } else {
      error();
    }
  }
  
  render(){
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
          <PinCode Size={4} eventCode={this.checkCode}/>
        </View>
    )
  }
}
```

## Utilisation

* _**eventCode(event, error, loading)**_<br>
* _**`event()`**_ return the code entered by the user<br>
* _**`error()`**_ clear the animation<br>
* _**`loading(value)`**_ stop the loading animation value by default egal false


## Styles

| Key | Description | Default | Type |
|---|---|---|---|
|**`TextColor`**|change color of the keyboard text|`'#5262F3'`|`string`|
|**`BorderColor`**|change color of the Keyboard border|`'rgba(0,0,0,0.1)'`|`string`|
|**`PinColor`**|Change color of the pin code |`turquoise`|`string`|
|**`FontSize`**|sets the font size|`30`|`number`|
|**`CodeColor`**|is an array of the different colors of the animation|`['#EB5088', '#72C1FA', '#F5D679', '#76ECC9', '#5468F3', 'red']`|`arrayOf(string)`|
|**`ImageSize`**|size of the icon|`{height: 15, width:20}`|`object(height, width)`|
|**`ImageLocation`**|link to the icon|`require('./assets/icons/backspace-arrow.png')`|`any`|

