import { arrayOf, bool, func, shape, string, number } from 'prop-types';
import React, { Component } from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import { activeFavoriteAction, removeFavoriteAction } from '../../../actions';
import { Amount, ButtonIcon, CursorBlink } from '../../../components';
import { ASSET, SHAPE, TEXT, THEME, STYLE } from '../../../config';
import { formatCurrency } from '../../../modules';
import ModalHodl from './ModalHodl';
import styles from './ListItem.style';

const { ALERT, COIN } = SHAPE;
const { EN: { HINT_SET_HODL } } = TEXT;
const { TRANSPARENT } = THEME;
const SWIPE_BUTTON = {
  backgroundColor: THEME.BACKGROUND_DARK_HIGHLIGHT, underlayColor: THEME.BACKGROUND_DARK,
};

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false, swipe: false };
    this._onFocus = this._onFocus.bind(this);
    this._onHodl = this._onHodl.bind(this);
    this._onPress = this._onPress.bind(this);
    this._onRemove = this._onRemove.bind(this);
  }

  _onFocus() {
    this.props.activeFavorite(this.props.coin);
  }

  _onPress() {
    this.props.onPress();
    this._onFocus();
  }

  _onHodl() {
    this.setState({ modal: !this.state.modal });
  }

  _onRemove() {
    const { coin, removeFavorite } = this.props;
    removeFavorite(coin);
  }

  render() {
    const {
      _onFocus, _onHodl, _onPress, _onRemove,
      props: {
        alerts, conversion = 0, coin, decimal, onAlert, value,
      },
      state: { modal },
    } = this;
    const {
      active, hodl = 0, image, price = 0,
    } = coin;

    const alert = alerts.find(item => item.coin === coin.coin);
    const menu = [
      { ...SWIPE_BUTTON, component: <ButtonIcon icon="wallet" onPress={_onHodl} style={styles.option} /> },
      { ...SWIPE_BUTTON, component: <ButtonIcon icon="alert" onPress={onAlert} style={styles.option} /> },
      { ...SWIPE_BUTTON, component: <ButtonIcon icon="remove" onPress={_onRemove} style={styles.option} /> },
    ];

    return (
      <Swipeout
        autoClose
        backgroundColor={TRANSPARENT}
        buttonWidth={52}
        close={!active || modal}
        onOpen={_onFocus}
        right={menu}
      >
        <View style={[STYLE.ROW, styles.container, (active && styles.active)]}>
          <TouchableWithoutFeedback onPress={_onPress}>
            <View style={[STYLE.ROW, styles.coin]}>
              <View style={styles.thumb}>
                <View style={[styles.imageWrap, styles.image]}>
                  <Image style={styles.image} source={{ uri: image }} />
                </View>
                { alert && <Image style={styles.alert} source={ASSET.alert} /> }
              </View>
              <View style={styles.coin}>
                <Text style={styles.symbol}>{coin.coin}</Text>
                { hodl !== 0 && <Amount style={styles.text} value={hodl * price} /> }
                { hodl === 0 && active && <Text style={[styles.text, styles.hint]}>{HINT_SET_HODL}</Text> }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback underlayColor={TRANSPARENT} onPress={_onFocus}>
            <View style={styles.values}>
              <View style={STYLE.ROW}>
                <Text style={styles.value}>
                  { active ? `${value}${decimal ? '.' : ''}` : formatCurrency(((conversion * value) / price), 4)}
                </Text>
                { active && <CursorBlink /> }
              </View>
              <Amount style={styles.text} value={(active ? value : 1) * price} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ModalHodl coin={coin} visible={modal} onClose={_onHodl} />
      </Swipeout>
    );
  }
}

ListItem.propTypes = {
  activeFavorite: func,
  alerts: arrayOf(shape(ALERT)),
  conversion: number,
  coin: shape(COIN),
  decimal: bool,
  onAlert: func,
  onPress: func,
  removeFavorite: func,
  value: string,
};

ListItem.defaultProps = {
  activeFavorite() {},
  alerts: [],
  conversion: 1,
  coin: {},
  decimal: false,
  onAlert: undefined,
  onPress: undefined,
  removeFavorite() {},
  value: 0,
};

const mapStateToProps = ({ alerts }) => ({
  alerts,
});

const mapDispatchToProps = dispatch => ({
  activeFavorite: favorite => dispatch(activeFavoriteAction(favorite)),
  removeFavorite: favorite => dispatch(removeFavoriteAction(favorite)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);