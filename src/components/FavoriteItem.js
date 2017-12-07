import { arrayOf, bool, func, shape, string, number } from 'prop-types';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { View as Animatable } from 'react-native-animatable';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { activeFavoriteAction } from '../actions';
import { C, THEME, STYLE } from '../config';
import { formatCurrency } from '../modules';
import Touchable from './Touchable';
import styles from './FavoriteItem.style';

class FavoriteItem extends Component {
  constructor(props) {
    super(props);
    this._onActiveItem = this._onActiveItem.bind(this);
    this._onPress = this._onPress.bind(this);
  }

  _onActiveItem() {
    this.props.activeFavorite(this.props.currency);
  }

  _onPress() {
    this.props.onPress();
    this._onActiveItem();
  }

  render() {
    const {
      _onPress, _onActiveItem,
      props: {
        alerts, conversionUsd, decimal, value,
        currency: { active, name, image, symbol, usd },
      },
    } = this;
    const alert = alerts.find(item => item.currency == symbol);

    return (
      <Touchable onPress={_onPress}>
        <View style={[styles.container, (active && styles.active)]}>
          <View style={[styles.thumb, styles.image]}>
            { image && <Image style={styles.image} source={{ uri: image }} /> }
            { alert && <Image style={styles.alert} source={C.ICON.alert} /> }
          </View>
          <View style={styles.currency}>
            <Text style={STYLE.CURRENCY_SYMBOL}>{symbol}</Text>
            <Text style={styles.text}>{name}</Text>
          </View>
          <TouchableWithoutFeedback underlayColor={THEME.TRANSPARENT} onPress={_onActiveItem}>
            <View style={styles.values}>
              { active && <Text style={[styles.text, styles.highlight]}>{`$${formatCurrency(value * usd)}`}</Text> }
              <View style={STYLE.ROW}>
                <Text style={styles.value}>
                  { active ? `${value}${decimal ? '.' : ''}` : formatCurrency(((conversionUsd * value) / usd), 4)}
                </Text>
                { active &&
                  <Animatable animation="fadeIn" duration={500} iterationCount="infinite" style={styles.blink} /> }
              </View>
              <Text style={styles.text}>{`$${formatCurrency(usd)}`}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Touchable>
    );
  }
}

FavoriteItem.propTypes = {
  activeFavorite: func,
  alerts: arrayOf(C.SHAPE.ALERT),
  conversionUsd: number,
  currency: shape({
    active: bool,
    name: string,
    rank: number,
    symbol: string,
    usd: number,
  }),
  decimal: bool,
  onPress: func,
  value: string,
};

FavoriteItem.defaultProps = {
  activeFavorite() {},
  alerts: [],
  conversionUsd: 1,
  currency: {
    active: false,
    usd: 0,
  },
  decimal: false,
  onPress: undefined,
  value: 0,
};

const mapStateToProps = ({ alerts }) => ({
  alerts,
});

const mapDispatchToProps = dispatch => ({
  activeFavorite: favorite => dispatch(activeFavoriteAction(favorite)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteItem);
